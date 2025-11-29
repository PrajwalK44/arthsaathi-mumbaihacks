import json
import os
from typing import Dict, Any

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
SESSIONS_DIR = os.path.join(DATA_DIR, "sessions")
REPORTS_DIR = os.path.join(DATA_DIR, "reports")

for d in (DATA_DIR, SESSIONS_DIR, REPORTS_DIR):
    os.makedirs(d, exist_ok=True)


def session_path(session_id: str) -> str:
    return os.path.join(SESSIONS_DIR, f"{session_id}.json")


def report_path(session_id: str) -> str:
    return os.path.join(REPORTS_DIR, f"{session_id}.json")


def save_session(session_id: str, session: Dict[str, Any]) -> None:
    p = session_path(session_id)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(session, f, ensure_ascii=False, indent=2)


def load_session(session_id: str) -> Dict[str, Any]:
    p = session_path(session_id)
    if not os.path.exists(p):
        return {}
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)


def save_report(session_id: str, report: Dict[str, Any]) -> None:
    p = report_path(session_id)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)


def load_report(session_id: str) -> Dict[str, Any]:
    p = report_path(session_id)
    if not os.path.exists(p):
        return {}
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)


def list_session_ids() -> list:
    """Return list of session ids (filenames without .json) present in sessions dir."""
    ids = []
    try:
        for fn in os.listdir(SESSIONS_DIR):
            if fn.endswith('.json'):
                ids.append(fn[:-5])
    except Exception:
        pass
    return ids


def load_all_sessions() -> Dict[str, Dict[str, Any]]:
    """Load all session files into a dict keyed by session id."""
    out: Dict[str, Dict[str, Any]] = {}
    for sid in list_session_ids():
        try:
            out[sid] = load_session(sid)
        except Exception:
            out[sid] = {}
    return out
