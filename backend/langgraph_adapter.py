"""Adapter to optionally integrate LangGraph for tool orchestration.

This module exposes `execute_tool(tool_name, args, session_state)` which will:
- If `langgraph` is available and a basic expected API exists, register tools as nodes and
  execute through LangGraph.
- Otherwise, fall back to direct function calls (the existing `TOOLS` registry).

The adapter is defensive: it never raises ImportError if LangGraph isn't installed.
"""
from typing import Any, Dict
import logging

try:
    import langgraph
    HAS_LANGGRAPH = True
except Exception:
    HAS_LANGGRAPH = False

from tools import (
    profile_store_get,
    profile_store_update,
    calculator_tool,
    question_generator,
    report_generator,
    analysis_agent,
)

TOOLS = {
    "profile_store_get": profile_store_get,
    "profile_store_update": profile_store_update,
    "calculator": calculator_tool,
    "question_generator": question_generator,
    "report_generator": report_generator,
    "analysis_agent": analysis_agent,
}

logger = logging.getLogger("langgraph_adapter")


def execute_tool(tool_name: str, args: Dict[str, Any], session_state: Dict[str, Any]) -> Dict[str, Any]:
    """Execute a tool by name. Use LangGraph if available; otherwise fallback.

    Returns the tool output dict.
    """
    if tool_name not in TOOLS:
        return {"error": f"Unknown tool: {tool_name}"}

    if HAS_LANGGRAPH:
        try:
            # Minimal best-effort integration: try to use a high-level execution API.
            # LangGraph APIs may vary; this uses a simple pattern if available.
            if hasattr(langgraph, "Graph"):
                g = langgraph.Graph()
                # Register a single node that calls our function
                def node_fn(payload):
                    return TOOLS[tool_name](session_state, payload) if tool_name.startswith("profile_store_") else TOOLS[tool_name](payload)

                # Some langgraph versions accept add_node(name, func)
                try:
                    g.add_node(tool_name, node_fn)
                    res = g.run(tool_name, args)
                    return res
                except Exception:
                    # Fallback to direct call if add_node/run not supported
                    pass

            # If Graph API not present or failed, try a generic executor
            if hasattr(langgraph, "execute"):
                return langgraph.execute(tool_name, args)

        except Exception as e:
            logger.warning(f"LangGraph execution failed, falling back: {e}")

    # Fallback: direct call
    try:
        if tool_name.startswith("profile_store_"):
            return TOOLS[tool_name](session_state, args)
        return TOOLS[tool_name](args)
    except Exception as e:
        return {"error": str(e)}
