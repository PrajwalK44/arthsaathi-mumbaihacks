import json
import logging
from typing import Dict, Any, Optional
from llm_client import chat

from pydantic import BaseModel, Field, root_validator, ValidationError
from typing import Literal

logger = logging.getLogger("agent_core")

SYSTEM_PROMPT = """
You are an autonomous financial advisor agent. You receive user input and the current session state (JSON).

Your output MUST be valid JSON with exactly the following fields:
- action: one of 'CALL_TOOL', 'RESPOND', 'FINISH'
- tool: (string) name of tool to call when action is 'CALL_TOOL' (required for CALL_TOOL)
- tool_args: (object) arguments for the tool
- updated_profile_data: (object) partial profile updates the agent wants to apply
- response: (string) user-facing text when action is 'RESPOND' or 'FINISH'

If you ask to CALL_TOOL, the backend will execute the tool and provide its output back to you; then you should produce a final RESPOND or FINISH message in a follow-up call.
If the LLM cannot produce valid JSON, return a short, safe RESPOND text only.
"""


class LLMPlan(BaseModel):
    action: Literal["CALL_TOOL", "RESPOND", "FINISH"]
    tool: Optional[str] = None
    tool_args: Optional[Dict[str, Any]] = Field(default_factory=dict)
    updated_profile_data: Optional[Dict[str, Any]] = Field(default_factory=dict)
    response: Optional[str] = ""

    @root_validator(skip_on_failure=True)
    def check_tool_required_for_call(cls, values):
        action = values.get("action")
        tool = values.get("tool")
        if action == "CALL_TOOL" and not tool:
            raise ValueError("'tool' is required when action == CALL_TOOL")
        return values


def validate_plan(content: str) -> Dict[str, Any]:
    """Validate raw LLM content and return a dict:
    {valid: bool, plan: Optional[LLMPlan], errors: Optional[str]}
    """
    # Try to parse the LLM output as JSON. If that fails, attempt to extract
    # a JSON object from the text (common when LLM adds commentary around JSON).
    try:
        parsed = json.loads(content)
    except Exception as e:
        # Attempt to salvage JSON embedded in surrounding text
        try:
            import re

            m = re.search(r"(\{.*\})", content, re.DOTALL)
            if m:
                parsed = json.loads(m.group(1))
            else:
                return {"valid": False, "plan": None, "errors": f"Invalid JSON: {e}", "raw": content}
        except Exception as e2:
            return {"valid": False, "plan": None, "errors": f"Invalid JSON: {e}; extraction failed: {e2}", "raw": content}

    try:
        plan = LLMPlan.parse_obj(parsed)
        return {"valid": True, "plan": plan, "errors": None}
    except ValidationError as ve:
        return {"valid": False, "plan": None, "errors": ve.json(), "raw": parsed}


class Agent:
    def __init__(self):
        self.system = SYSTEM_PROMPT

    def handle(self, user_input: str, session_state: Dict[str, Any]) -> Dict[str, Any]:
        # First pass: ask the LLM what to do
        messages = [
            {"role": "system", "content": self.system},
            {"role": "user", "content": json.dumps({"session_state": session_state, "user_input": user_input})}
        ]

        try:
            res = chat(messages)
            content = res.get("content", "")
        except Exception as e:
            logger.exception("LLM chat failed")
            # Do not leak internal errors to the user
            return {"response": "The analysis service is temporarily unavailable. Please try again later.", "updated_profile_data": {}, "status": "RESPOND"}

        validated = validate_plan(content)
        if not validated["valid"]:
            # Fallback: return a safe RESPOND message with explanation
            return {
                "response": (
                    "I didn't understand that — could you rephrase? "
                    "(Agent received non-JSON or malformed plan.)"
                ),
                "updated_profile_data": {},
                "status": "RESPOND",
                "llm_raw": validated.get("raw"),
                "llm_errors": validated.get("errors"),
            }

        plan: LLMPlan = validated["plan"]

        if plan.action == "CALL_TOOL":
            tool_name = plan.tool
            tool_args = plan.tool_args or {}
            # Execute tool via langgraph_adapter (uses LangGraph if available)
            try:
                from langgraph_adapter import execute_tool
                tool_output = execute_tool(tool_name, tool_args or {}, session_state)
            except Exception as e:
                logger.exception("Tool execution failed: %s", tool_name)
                return {"response": "A requested operation failed. Please try again.", "updated_profile_data": {}, "status": "RESPOND"}

            # Send tool_output back to LLM for final response
            followup = [
                {"role": "system", "content": self.system},
                {"role": "user", "content": json.dumps({"session_state": session_state, "user_input": user_input})},
                {"role": "assistant", "content": json.dumps({"tool": tool_name, "tool_output": tool_output})}
            ]
            try:
                final = chat(followup)
                final_content = final.get("content", "")
            except Exception:
                logger.exception("LLM follow-up failed after tool %s", tool_name)
                return {"response": "The analysis service failed to produce a final response. Please try again.", "updated_profile_data": {}, "status": "RESPOND", "tool_output": tool_output}
            final_validated = validate_plan(final_content)
            if not final_validated["valid"]:
                # Fallback: return raw final content as a response
                logger.warning("Final plan not valid JSON: %s", final_validated.get("errors"))
                return {"response": final_content, "updated_profile_data": {}, "status": "RESPOND", "tool_output": tool_output}

            final_plan: LLMPlan = final_validated["plan"]
            return {"response": final_plan.response or "", "updated_profile_data": final_plan.updated_profile_data or {}, "status": final_plan.action, "tool_output": tool_output}

        else:
            # RESPOND or FINISH
            return {"response": plan.response or content, "updated_profile_data": plan.updated_profile_data or {}, "status": plan.action, "tool_output": None}
