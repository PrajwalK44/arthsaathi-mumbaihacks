import uvicorn
import logging
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from uuid import uuid4
from agent_core import Agent
from storage import save_session, save_report, load_session, load_all_sessions

# Configure logger
logger = logging.getLogger("main_api")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(name)s: %(message)s"))
if not logger.handlers:
    logger.addHandler(handler)

app = FastAPI(title="Financial Advisor Agent")
agent = Agent()

# Optionally pre-load sessions (not required) - storage is canonical
try:
    SESSIONS: Dict[str, Dict[str, Any]] = load_all_sessions()
except Exception:
    SESSIONS = {}


class ChatRequest(BaseModel):
    user_input: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    session_id: str
    response: str
    updated_profile: Dict[str, Any]
    new_questions: Optional[List[Dict[str, Any]]] = None
    finished: Optional[bool] = False


def normalize_questions(qs: Any) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    if not isinstance(qs, list):
        return out
    for q in qs:
        if not isinstance(q, dict):
            continue
        key = q.get("key") or q.get("id") or q.get("name")
        label = q.get("label") or q.get("question") or key
        qtype = q.get("type") or q.get("kind") or "text"
        options = q.get("options") or []
        normalized = {"key": key, "label": label, "type": qtype, "options": options}
        # preserve any other fields
        for k, v in q.items():
            if k not in normalized:
                normalized[k] = v
        out.append(normalized)
    return out


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    sid = req.session_id or str(uuid4())

    # Load session on every request; storage is the source of truth
    try:
        session = load_session(sid)
    except Exception as e:
        logger.warning("Failed to load session %s: %s", sid, e)
        session = {}

    if not session:
        # Initialize default session
        session = {
            "user_profile": {
                "income": {"amount": None, "stability": None, "notes": ""},
                "debt": {"has_debt": None, "details": [], "status": "incomplete"},
                "assets": {"savings": None, "investments": [], "liquidity": None},
                "goals": {"short_term": None, "long_term": None},
                "psychology": {"risk_tolerance": None, "spending_habits": None},
            },
            "messages": [],
        }
        try:
            save_session(sid, session)
        except Exception:
            logger.debug("Failed to persist new session %s", sid)

    # Ask the agent what to do
    try:
        result = agent.handle(req.user_input, session)
        logger.info("Agent returned status=%s", result.get("status"))
        logger.debug("Agent result: %s", result)
    except Exception as e:
        logger.exception("Agent handling failed: %s", e)
        return ChatResponse(session_id=sid, response="Internal error processing request.", updated_profile=session.get("user_profile", {}))

    # Merge any profile updates suggested by the agent
    updated = result.get("updated_profile_data", {}) or {}
    if isinstance(updated, dict) and updated:
        session["user_profile"].update(updated)

    # Handle any tool output returned by the agent
    tool_output = result.get("tool_output")
    new_questions = None
    finished = False

    if isinstance(tool_output, dict):
        logger.info("Agent tool_output keys=%s", list(tool_output.keys()))
        if "questions" in tool_output:
            new_questions = normalize_questions(tool_output.get("questions"))
        if "next_questions" in tool_output:
            new_questions = normalize_questions(tool_output.get("next_questions"))
        if "report" in tool_output:
            try:
                save_report(sid, tool_output)
            except Exception:
                logger.debug("Failed to save report for %s", sid)
            finished = True

    # If agent didn't provide follow-ups and not finished, call analysis_agent automatically
    if not new_questions and not finished:
        try:
            from langgraph_adapter import execute_tool

            analysis_out = execute_tool("analysis_agent", {"profile": session.get("user_profile", {}), "rounds": 1}, session)
            logger.info("analysis_agent returned type=%s", type(analysis_out))
            logger.debug("analysis_out=%s", analysis_out)
            if isinstance(analysis_out, dict):
                upd = analysis_out.get("updated_profile") or {}
                if isinstance(upd, dict) and upd:
                    session["user_profile"].update(upd)
                if analysis_out.get("next_questions"):
                    new_questions = normalize_questions(analysis_out.get("next_questions"))
                if analysis_out.get("questions"):
                    new_questions = normalize_questions(analysis_out.get("questions"))
                if analysis_out.get("report"):
                    try:
                        save_report(sid, analysis_out)
                    except Exception:
                        logger.debug("Failed to save analysis report for %s", sid)
                    finished = True
        except Exception as e:
            logger.debug("analysis_agent invocation failed: %s", e)

    # Persist session after any updates
    try:
        save_session(sid, session)
    except Exception:
        logger.debug("Failed to save session %s", sid)

    # Respect agent-declared finish
    if result.get("status") == "FINISH":
        finished = True

    resp = ChatResponse(
        session_id=sid,
        response=result.get("response", ""),
        updated_profile=session.get("user_profile", {}),
        new_questions=new_questions,
        finished=finished,
    )
    return resp


if __name__ == "__main__":
    uvicorn.run("main_api:app", host="127.0.0.1", port=8000, reload=True)
