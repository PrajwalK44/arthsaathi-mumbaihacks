import os
from typing import List, Dict, Any
from dotenv import load_dotenv
load_dotenv()


def _get_model():
    # Prefer explicit model via env, default to Groq Llama instant model
    return os.environ.get("AGENT_MODEL", "llama-3.1-8b-instant")


def chat(messages: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Send chat messages to the configured LLM and return a dict with 'content'.

    This wrapper uses the LangChain Groq/Llama chat wrapper when available.
    If the provider is not installed or an unexpected error occurs, a lightweight
    deterministic fallback is used to allow local development and hackathon runs.
    """
    model_name = _get_model()

    # First attempt: provider-backed LangChain ChatGroq
    try:
        from langchain.schema import HumanMessage, SystemMessage, AIMessage
        try:
            from langchain_groq import ChatGroq
        except Exception:
            ChatGroq = None

        if ChatGroq is not None:
            llm = ChatGroq(
                model=model_name,
                temperature=0,
                max_tokens=None,
                reasoning_format="parsed",
                timeout=None,
                max_retries=2,
            )

            lc_messages = []
            for m in messages:
                role = m.get("role")
                content = m.get("content", "")
                if role == "system":
                    lc_messages.append(SystemMessage(content=content))
                elif role == "user":
                    lc_messages.append(HumanMessage(content=content))
                else:
                    lc_messages.append(AIMessage(content=content))

            if hasattr(llm, "predict_messages"):
                res = llm.predict_messages(lc_messages)
                text = getattr(res, "content", None) or str(res)
            elif hasattr(llm, "chat"):
                resp = llm.chat(messages=[{"role": m.get("role"), "content": m.get("content")} for m in messages])
                text = resp.get("text") if isinstance(resp, dict) else str(resp)
            elif hasattr(llm, "predict"):
                prompt = "\n".join(f"[{m.get('role')}] {m.get('content')}" for m in messages)
                resp = llm.predict(prompt)
                text = resp if isinstance(resp, str) else str(resp)
            else:
                raise RuntimeError("ChatGroq instance does not expose a usable predict/chat method")

            return {"content": text}

    except Exception:
        # If provider isn't available or errors occur, fall back to local heuristic LLM
        pass

    # --- Local fallback LLM (for development/hackathon) ---
    try:
        import json as _json
        import re as _re

        sys_text = ""
        user_text = ""
        for m in messages:
            if m.get("role") == "system":
                sys_text = m.get("content", "")
            if m.get("role") == "user":
                user_text = m.get("content", "")

        # If analysis_agent-style prompt, return structured analysis JSON
        if "financial analysis assistant" in sys_text.lower() or "receive a json user profile" in sys_text.lower():
            default = {
                "updated_profile": {},
                "next_questions": [
                    {"key": "income_frequency", "label": "How often do you receive income?", "type": "select", "options": ["Monthly", "Weekly", "Other"]}
                ],
                "finish": False,
                "explanation": "Fallback analysis: basic follow-up generated locally."
            }
            return {"content": _json.dumps(default)}

        # If agent orchestration prompt, ask to CALL_TOOL analysis_agent
        if "You are an autonomous financial advisor agent" in sys_text:
            profile = {}
            try:
                u = _json.loads(user_text)
                profile = u.get("session_state", {}) if isinstance(u, dict) else {}
            except Exception:
                m = _re.search(r"(\{.*\})", user_text, _re.DOTALL)
                if m:
                    try:
                        u = _json.loads(m.group(1))
                        profile = u.get("session_state", {})
                    except Exception:
                        profile = {}

            plan = {
                "action": "CALL_TOOL",
                "tool": "analysis_agent",
                "tool_args": {"profile": profile.get("user_profile", {}), "rounds": 1},
                "updated_profile_data": {},
                "response": ""
            }
            return {"content": _json.dumps(plan)}

        # Generic fallback plan
        generic = {"action": "RESPOND", "response": "Fallback LLM: no provider configured.", "updated_profile_data": {}}
        return {"content": _json.dumps(generic)}

    except Exception:
        return {"content": '{"action": "RESPOND", "response": "Fallback error", "updated_profile_data": {}}'}
