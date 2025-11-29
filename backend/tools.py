from typing import Any, Dict, List
import json
from llm_client import chat


def profile_store_get(session_state: Dict[str, Any]) -> Dict[str, Any]:
    return session_state.get("user_profile", {})


def profile_store_update(session_state: Dict[str, Any], update: Dict[str, Any]) -> Dict[str, Any]:
    profile = session_state.setdefault("user_profile", {})
    # shallow merge for top-level keys
    for k, v in update.items():
        if k in profile and isinstance(profile[k], dict) and isinstance(v, dict):
            profile[k].update(v)
        else:
            profile[k] = v
    session_state["user_profile"] = profile
    return profile


def calculator_tool(args: Dict[str, Any]) -> Dict[str, Any]:
    # Simple calculator: supports ratio and sum operations for now
    op = args.get("op")
    numbers = args.get("numbers", [])
    try:
        if op == "sum":
            return {"result": sum(numbers)}
        if op == "ratio":
            a = float(numbers[0])
            b = float(numbers[1])
            return {"result": a / b if b != 0 else None}
        return {"result": None, "error": "unknown op"}
    except Exception as e:
        return {"result": None, "error": str(e)}


def question_generator(args: Dict[str, Any]) -> Dict[str, Any]:
    """Return structured follow-up questions.

    If caller passes `structured=True` the function returns a `questions` list of
    dicts with `key`, `label`, `type`, and optionally `options`.
    """
    topic = args.get("topic", "details")
    structured = bool(args.get("structured", False))

    if structured:
        # Provide a few example follow-up questions with choices and 'other' option
        questions: List[Dict[str, Any]] = [
            {
                "key": f"{topic}_frequency",
                "label": f"How often do you {topic}?",
                "type": "select",
                "options": ["Daily", "Weekly", "Monthly", "Rarely", "Other"],
                "required": True,
            },
            {
                "key": f"{topic}_amount",
                "label": f"Typical amount related to {topic} (USD):",
                "type": "number",
                "min": 0,
                "step": 10,
                "required": False,
            },
            {
                "key": f"{topic}_notes",
                "label": f"Anything else about {topic}?",
                "type": "text",
                "placeholder": "Optional details...",
                "required": False,
            },
        ]
        return {"questions": questions}

    # Fallback single-text follow up
    q = f"Could you provide more detail about {topic}? For example, amounts, frequency, and dates."
    return {"question": q}


def analysis_agent(args: Dict[str, Any]) -> Dict[str, Any]:
    """Call the LLM to analyze a profile and suggest profile updates and next questions.

    Expected args: {"profile": {...}, "rounds": int}
    Returns structured JSON:
    {"updated_profile": {...}, "next_questions": [...], "finish": bool, "explanation": str}
    """
    profile = args.get("profile", {})
    rounds = int(args.get("rounds", 1))

    system = (
        "You are a financial analysis assistant. Receive a JSON user profile and return\n"
        "a JSON object with keys: updated_profile (partial updates), next_questions (array of question objects),\n"
        "finish (boolean) to indicate whether to stop asking more questions, and explanation (short string).\n"
        "Only return JSON. Keep it concise and machine-readable."
    )

    user_msg = json.dumps({"profile": profile, "rounds": rounds})

    try:
        res = chat([{"role": "system", "content": system}, {"role": "user", "content": user_msg}])
        content = res.get("content", "")
        # Attempt to extract JSON
        try:
            j = json.loads(content)
        except Exception:
            import re

            m = re.search(r"(\{.*\})", content, re.DOTALL)
            if m:
                j = json.loads(m.group(1))
            else:
                # Fallback heuristic: ask for structured questions based on keys missing
                j = {"updated_profile": {}, "next_questions": [], "finish": True, "explanation": "LLM returned non-JSON"}

        # Ensure keys exist
        return {
            "updated_profile": j.get("updated_profile", {}),
            "next_questions": j.get("next_questions", []),
            "finish": bool(j.get("finish", False)),
            "explanation": j.get("explanation", ""),
        }
    except Exception as e:
        return {"updated_profile": {}, "next_questions": [], "finish": True, "explanation": str(e)}


def report_generator(profile: Dict[str, Any]) -> Dict[str, Any]:
    # Minimal report generator — in production, call an LLM or templating engine
    mirror = json.dumps(profile, indent=2)
    diagnosis = "Based on the data, an initial diagnosis would be prepared here."
    lesson = "Actionable lesson: prioritize emergency savings, reduce high-interest debt."
    return {"report": f"The Mirror:\n{mirror}\n\nThe Diagnosis:\n{diagnosis}\n\nThe Lesson:\n{lesson}"}
