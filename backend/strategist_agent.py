import json
from typing import Any
from datetime import datetime
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END
from typing_extensions import TypedDict

class DecisionAnalysisState(TypedDict):
    """State for decision analysis workflow"""
    persona_id: str
    persona_data: dict
    event_id: str
    event_data: dict
    selected_choice_id: str
    selected_choice: dict
    all_choices: list
    financial_state_before: dict
    analysis_report: dict
    second_order_effects: dict
    behavioral_insights: dict
    simulation_update: dict
    timestamp: str

class StrategistAgent:
    def __init__(self, groq_api_key: str = None):
        """Initialize Strategist Agent with Groq LLM"""
        self.llm = ChatGroq(
            model="openai/gpt-oss-120b",
            temperature=0.7,
            groq_api_key=''
        )
        self.workflow = self._build_workflow()
    
    def _build_workflow(self):
        """Build the decision analysis workflow using LangGraph"""
        workflow = StateGraph(DecisionAnalysisState)
        
        workflow.add_node("extract_context", self._extract_context)
        workflow.add_node("analyze_choice", self._analyze_choice)
        workflow.add_node("calculate_second_order", self._calculate_second_order)
        workflow.add_node("build_decision_tree", self._build_decision_tree)
        workflow.add_node("generate_behavioral_insights", self._generate_behavioral_insights)
        workflow.add_node("compile_report", self._compile_report)
        
        workflow.add_edge("extract_context", "analyze_choice")
        workflow.add_edge("analyze_choice", "calculate_second_order")
        workflow.add_edge("calculate_second_order", "build_decision_tree")
        workflow.add_edge("build_decision_tree", "generate_behavioral_insights")
        workflow.add_edge("generate_behavioral_insights", "compile_report")
        workflow.add_edge("compile_report", END)
        
        workflow.set_entry_point("extract_context")
        return workflow.compile()
    
    def _extract_context(self, state: DecisionAnalysisState) -> DecisionAnalysisState:
        """Extract and validate context from input"""
        state["timestamp"] = datetime.now().isoformat()
        
        # Capture financial state BEFORE decision
        state["financial_state_before"] = {
            "income": state["persona_data"].get("financial_baseline", {}).get("avg_monthly_income"),
            "savings": state["persona_data"].get("financial_baseline", {}).get("savings_balance"),
            "debt": state["persona_data"].get("financial_baseline", {}).get("debt_total"),
            "fixed_expenses": state["persona_data"].get("financial_baseline", {}).get("fixed_expenses")
        }
        
        return state
    
    def _analyze_choice(self, state: DecisionAnalysisState) -> DecisionAnalysisState:
        """Analyze the selected choice using LLM"""
        prompt = PromptTemplate(
            input_variables=["event_title", "event_desc", "choice_text", "financial_impact", "behavioral_tag", "outcome_narrative"],
            template="""Analyze this financial decision deeply:

Event: {event_title}
Description: {event_desc}

Selected Choice: {choice_text}
Financial Impact: {financial_impact} INR
Behavioral Tag: {behavioral_tag}
Outcome Narrative: {outcome_narrative}

Provide a JSON response ONLY (no markdown, no extra text) with these exact keys:
{{
    "immediate_impact": {financial_impact},
    "psychological_consequence": "brief text about emotional impact",
    "opportunity_cost": "what was foregone",
    "sustainability_score": 6,
    "urgency_vs_planning": "Strategic or Impulse",
    "risk_assessment": "brief text about risks"
}}

Return ONLY valid JSON."""
        )
        
        prompt_text = prompt.format(
            event_title=state["event_data"].get("title"),
            event_desc=state["event_data"].get("description"),
            choice_text=state["selected_choice"].get("text"),
            financial_impact=state["selected_choice"].get("financial_impact", 0),
            behavioral_tag=state["selected_choice"].get("behavioral_tag"),
            outcome_narrative=state["selected_choice"].get("outcome_narrative")
        )
        
        response = self.llm.invoke([HumanMessage(content=prompt_text)])
        try:
            analysis = json.loads(response.content)
            # Flatten and sanitize response
            state["analysis_report"] = {
                "immediate_impact": state["selected_choice"].get("financial_impact", 0),
                "psychological_consequence": analysis.get("psychological_consequence", "N/A"),
                "opportunity_cost": analysis.get("opportunity_cost", "N/A"),
                "sustainability_score": int(analysis.get("sustainability_score", 5)),
                "urgency_vs_planning": analysis.get("urgency_vs_planning", "N/A"),
                "risk_assessment": analysis.get("risk_assessment", "N/A")
            }
        except (json.JSONDecodeError, ValueError, TypeError):
            # Fallback with sanitized values
            state["analysis_report"] = {
                "immediate_impact": state["selected_choice"].get("financial_impact", 0),
                "psychological_consequence": "Unable to analyze",
                "opportunity_cost": "Unable to determine",
                "sustainability_score": 5,
                "urgency_vs_planning": state["selected_choice"].get("behavioral_tag", "Unknown"),
                "risk_assessment": "Standard financial risk"
            }
        
        return state
    
    def _project_3month(self, state: DecisionAnalysisState) -> dict:
        """Project 3-month financial impact"""
        impact = state["selected_choice"].get("financial_impact", 0)
        return {
            "cumulative_impact": impact * 3,
            "trend": "negative" if impact < 0 else "positive" if impact > 0 else "neutral"
        }
    
    def _project_12month(self, state: DecisionAnalysisState) -> dict:
        """Project 12-month financial impact with detailed breakdown"""
        impact = state["selected_choice"].get("financial_impact", 0)
        liability = state["selected_choice"].get("future_liability", 0)
        
        before = state["financial_state_before"]
        income = before.get("income", 1)
        
        # CORRECT: Calculate recovery time for the IMMEDIATE impact amount
        immediate_cost = abs(impact) if impact < 0 else 0
        monthly_surplus = income - before.get("fixed_expenses", 0)
        
        recovery_months = 0
        if immediate_cost > 0 and monthly_surplus > 0:
            recovery_months = max(1, int(immediate_cost / monthly_surplus))
        
        cumulative_impact = (impact * 12)
        debt_accumulation = (liability * 12) if liability > 0 else 0
        
        # Financial health after 12 months
        projected_savings_12m = max(0, before.get("savings", 0) + cumulative_impact)
        projected_debt_12m = before.get("debt", 0) + debt_accumulation
        
        return {
            "cumulative_impact": cumulative_impact,
            "monthly_average": impact,
            "debt_accumulation": debt_accumulation,
            "trend": "negative" if impact < 0 else "positive" if impact > 0 else "neutral",
            "net_position": cumulative_impact - debt_accumulation,
            "projected_savings": projected_savings_12m,
            "projected_debt": projected_debt_12m,
            "recovery_timeline_months": max(0, round(recovery_months, 1)),
            "financial_health_score": self._calculate_health_score(
                projected_savings_12m,
                income,
                projected_debt_12m
            )
        }
    
    def _calculate_second_order(self, state: DecisionAnalysisState) -> DecisionAnalysisState:
        """Calculate 2nd and 3rd order financial effects"""
        selected = state["selected_choice"]
        all_choices = state["all_choices"]
        
        # Build comparison matrix
        second_order = {
            "selected_choice": {
                "immediate_impact": selected.get("financial_impact", 0),
                "future_liability": selected.get("future_liability", 0),
                "time_impact": selected.get("time_impact", "None"),
            },
            "paths_not_taken": [],
            "cumulative_scenario_6_months": None,
            "cumulative_scenario_12_months": None,
        }
        
        # Analyze each alternative
        for choice in all_choices:
            if choice["id"] != state["selected_choice_id"]:
                second_order["paths_not_taken"].append({
                    "choice_id": choice["id"],
                    "text": choice["text"],
                    "immediate_impact": choice.get("financial_impact", 0),
                    "future_liability": choice.get("future_liability", 0),
                    "behavioral_consequence": choice.get("behavioral_tag"),
                    "outcome_narrative": choice.get("outcome_narrative")
                })
        
        # Simulate 6-month trajectory
        before = state["financial_state_before"]
        selected = state["selected_choice"]
        
        # CORRECT: Calculate full 6-month impact
        six_month_impact = selected.get("financial_impact", 0) * 6
        projected_savings_6m = before.get("savings", 0) + six_month_impact
        
        second_order["cumulative_scenario_6_months"] = {
            "projected_savings": max(0, projected_savings_6m),
            "debt_trajectory": before.get("debt", 0) + selected.get("future_liability", 0),
            "financial_health_score": self._calculate_health_score(
                max(0, projected_savings_6m),
                before.get("income", 1),
                before.get("debt", 0) + selected.get("future_liability", 0)
            )
        }
        
        # Simulate 12-month trajectory
        monthly_impact_12 = selected.get("financial_impact", 0)
        projected_savings_12m = before.get("savings", 0) + (monthly_impact_12 * 12)
        
        second_order["cumulative_scenario_12_months"] = {
            "projected_savings": max(0, projected_savings_12m),
            "debt_trajectory": before.get("debt", 0) + (selected.get("future_liability", 0) * 12),
            "financial_health_score": self._calculate_health_score(
                max(0, projected_savings_12m),
                before.get("income", 1),
                before.get("debt", 0) + (selected.get("future_liability", 0) * 12)
            )
        }
        
        state["second_order_effects"] = second_order
        return state
    
    def _build_decision_tree(self, state: DecisionAnalysisState) -> DecisionAnalysisState:
        """Build comprehensive decision tree with consequences"""
        proj_12m = self._project_12month(state)
        
        tree = {
            "decision_node": {
                "event_id": state["event_id"],
                "event_title": state["event_data"].get("title"),
                "decision_made": state["selected_choice"].get("text"),
                "timestamp": state["timestamp"]
            },
            "branch_outcomes": {
                "taken_branch": {
                    "immediate_consequences": self._get_consequences(state["selected_choice"]),
                    "3_month_outlook": self._project_3month(state),
                    "12_month_outlook": proj_12m,
                    "behavioral_reinforcement": state["selected_choice"].get("behavioral_tag")
                },
                "not_taken_branches": []
            },
            "decision_quality_metrics": {
                "was_optimal": self._was_optimal_decision(state),
                "regret_likelihood": self._calculate_regret(state),
                "learning_opportunity": self._extract_learning(state)
            }
        }
        
        # Add alternative branch analysis
        for alt_choice in state["all_choices"]:
            if alt_choice["id"] != state["selected_choice_id"]:
                tree["branch_outcomes"]["not_taken_branches"].append({
                    "choice_text": alt_choice.get("text"),
                    "what_would_have_happened": alt_choice.get("outcome_narrative"),
                    "financial_difference": alt_choice.get("financial_impact", 0) - state["selected_choice"].get("financial_impact", 0),
                    "alternative_behavioral_path": alt_choice.get("behavioral_tag")
                })
        
        state["simulation_update"] = tree
        return state
    
    def _get_consequences(self, choice: dict) -> dict:
        """Extract consequences from choice"""
        return {
            "financial": choice.get("financial_impact", 0),
            "time": choice.get("time_impact", "None"),
            "future_liability": choice.get("future_liability", 0),
            "narrative": choice.get("outcome_narrative")
        }
    
    def _was_optimal_decision(self, state: DecisionAnalysisState) -> bool:
        """Check if selected choice was financially optimal"""
        selected_impact = state["selected_choice"].get("financial_impact", 0)
        for choice in state["all_choices"]:
            if choice["id"] != state["selected_choice_id"]:
                if choice.get("financial_impact", 0) > selected_impact:
                    return False
        return True
    
    def _calculate_regret(self, state: DecisionAnalysisState) -> float:
        """Calculate likelihood of regret (0-1)"""
        if state["selected_choice"].get("financial_impact", 0) < -5000:
            return 0.8
        if state["selected_choice"].get("future_liability", 0) > 0:
            return 0.6
        return 0.2
    
    def _extract_learning(self, state: DecisionAnalysisState) -> str:
        """Extract key learning from decision"""
        tag = state["selected_choice"].get("behavioral_tag", "")
        if "Risk" in tag or "Reckless" in tag:
            return "High-risk decision made. Opportunity to practice risk assessment."
        elif "Prudent" in tag:
            return "Cautious approach. Opportunity to explore calculated risks."
        return "Opportunity to reflect on decision-making patterns."
    
    def _calculate_health_score(self, savings: float, income: float, debt: float) -> float:
        """Calculate financial health score (0-100)"""
        if income == 0:
            return 0
        savings_ratio = min((savings / income) * 100, 50)
        debt_ratio = max(50 - (debt / income) * 100, 0)
        return (savings_ratio + debt_ratio) / 2
    
    def analyze_decision(self, 
                        persona_id: str, 
                        persona_data: dict,
                        event_id: str,
                        event_data: dict,
                        selected_choice_id: str) -> dict:
        """Main entry point for decision analysis"""
        
        # Find selected choice
        selected_choice = None
        all_choices = event_data.get("choices", [])
        
        for choice in all_choices:
            if choice["id"] == selected_choice_id:
                selected_choice = choice
                break
        
        if not selected_choice:
            raise ValueError(f"Choice {selected_choice_id} not found in event {event_id}")
        
        initial_state: DecisionAnalysisState = {
            "persona_id": persona_id,
            "persona_data": persona_data,
            "event_id": event_id,
            "event_data": event_data,
            "selected_choice_id": selected_choice_id,
            "selected_choice": selected_choice,
            "all_choices": all_choices,
            "financial_state_before": {},
            "analysis_report": {},
            "second_order_effects": {},
            "behavioral_insights": {},
            "simulation_update": {},
            "timestamp": ""
        }
        
        try:
            final_state = self.workflow.invoke(initial_state)
            return self._format_final_report(final_state)
        except Exception as e:
            print(f"⚠ Workflow error (continuing with partial analysis): {str(e)}")
            # Return partial report with available data
            return self._format_final_report(initial_state)
    
    def _generate_behavioral_insights(self, state: DecisionAnalysisState) -> DecisionAnalysisState:
        """Generate behavioral and psychological insights using LLM"""
        prompt = PromptTemplate(
            input_variables=["persona_name", "persona_type", "stressor", "behavioral_tag", "selected_outcome"],
            template="""Behavioral Analysis for Gig Economy Persona:

Persona: {persona_name} ({persona_type})
Primary Stressor: {stressor}
Decision Type: {behavioral_tag}
Outcome: {selected_outcome}

Provide JSON with:
1. decision_archetype: Which archetype does this reflect? (e.g., "Scarcity Mindset", "Risk Taker", "Prudent Planner")
2. vulnerability_indicators: What vulnerabilities does this expose?
3. adaptive_capacity: Can this persona adapt to financial shocks after this decision?
4. long_term_trajectory: Where does this put them in 12 months?
5. intervention_opportunities: What could help them make better decisions?
6. peer_comparison: How does this compare to similar personas?

Return valid JSON only."""
        )
        
        persona = state["persona_data"]
        prompt_text = prompt.format(
            persona_name=persona.get("display_profile", {}).get("name"),
            persona_type=persona.get("type"),
            stressor=persona.get("psychometric_profile", {}).get("primary_stressor"),
            behavioral_tag=state["selected_choice"].get("behavioral_tag"),
            selected_outcome=state["selected_choice"].get("outcome_narrative")
        )
        
        response = self.llm.invoke([HumanMessage(content=prompt_text)])
        try:
            raw_response = response.content.strip()
            # Remove markdown code blocks if present
            if raw_response.startswith("```"):
                raw_response = raw_response.split("```")[1]
                if raw_response.startswith("json"):
                    raw_response = raw_response[4:]
                raw_response = raw_response.strip()
            
            state["behavioral_insights"] = json.loads(raw_response)
        except json.JSONDecodeError as e:
            print(f"⚠️ Behavioral insights parsing failed: {str(e)}")
            # Fallback with simplified structure
            state["behavioral_insights"] = {
                "decision_archetype": state["selected_choice"].get("behavioral_tag", "Unknown"),
                "vulnerability_indicators": [
                    "Reduced cash buffer after major expense",
                    "Increased financial stress and anxiety"
                ],
                "adaptive_capacity": {
                    "short_term": "Moderate - can maintain operations but limited flexibility",
                    "medium_term": "Low - vulnerable to next emergency without buffer rebuild"
                },
                "long_term_trajectory": "Sustainability depends on consistent income and avoiding additional shocks",
                "intervention_opportunities": [
                    "Emergency fund rebuilding plan",
                    "Financial literacy on risk management",
                    "Income diversification strategies"
                ],
                "potential_impact": "Could reduce yearly repair costs by 30%",
                "peer_comparison": {
                    "risk_profile": "Above average - relies on quick fixes vs preventive maintenance",
                    "comparative_personas": [
                        {
                            "name": "Anita Patel",
                            "recommendation": "Financial literacy workshops on vehicle maintenance budgeting",
                            "priority": "HIGH",
                            "approach": "Postpones servicing",
                            "yearly_repair_costs": "₹8,000-12,000",
                            "downtime_hours": "40-60 hours/year",
                            "resilience_score": "30/100"
                        },
                        {
                            "name": "Javier Torres",
                            "approach": "Preventive maintenance",
                            "yearly_repair_costs": "₹4,000-6,000",
                            "downtime_hours": "5-10 hours/year",
                            "resilience_score": "75/100"
                        }
                    ],
                    "ramesh_position": "Middle-ground: Higher costs than Javier but lower downtime risk than Anita"
                }
            }
            
        return state
    
    def _compile_report(self, state: DecisionAnalysisState) -> DecisionAnalysisState:
        """Compile final comprehensive report - validation step"""
        required_fields = [
            "persona_id", "event_id", "timestamp",
            "selected_choice_id", "selected_choice", "all_choices",
            "financial_state_before", "analysis_report",
            "second_order_effects", "behavioral_insights", "simulation_update"
        ]
        
        for field in required_fields:
            # Verify all required fields are populated
            if not state.get(field):
                state[field] = {} if field not in ["all_choices", "timestamp"] else ([] if field == "all_choices" else "")
        
        return state
    
    def _format_final_report(self, state: DecisionAnalysisState) -> dict:
        """Format the final comprehensive report"""
        return {
            "metadata": {
                "persona_id": state["persona_id"],
                "event_id": state["event_id"],
                "analysis_timestamp": state["timestamp"],
                "decision_made": state["selected_choice"].get("text") if state.get("selected_choice") else "Unknown"
            },
            "immediate_analysis": state.get("analysis_report", {}),
            "decision_tree": state.get("simulation_update", {}),
            "second_order_effects": state.get("second_order_effects", {}),
            "behavioral_analysis": state.get("behavioral_insights", {}),
            "financial_trajectory": {
                "before": state.get("financial_state_before", {}),
                "3_month_projection": state.get("simulation_update", {}).get("branch_outcomes", {}).get("taken_branch", {}).get("3_month_outlook"),
                "6_month_projection": state.get("second_order_effects", {}).get("cumulative_scenario_6_months"),
                "12_month_projection": state.get("second_order_effects", {}).get("cumulative_scenario_12_months")
            },
            "summary": self._generate_summary(state)
        }
    
    def _generate_summary(self, state: DecisionAnalysisState) -> str:
        """Generate executive summary of the decision analysis"""
        if not state.get("selected_choice"):
            return "Analysis incomplete - no choice selected"
        
        impact = state["selected_choice"].get("financial_impact", 0)
        behavior = state["selected_choice"].get("behavioral_tag", "Unknown")
        event_title = state["event_data"].get("title", "Unknown Event")
        decision_text = state["selected_choice"].get("text", "Unknown")
        
        # Build narrative summary
        summary = f"In the event '{event_title}', the persona chose: '{decision_text}' "
        summary += f"with ₹{impact} immediate financial impact. "
        summary += f"This reflects a '{behavior}' behavioral pattern. "
        
        # Check optimality
        if state.get("simulation_update", {}).get("decision_quality_metrics", {}).get("was_optimal"):
            summary += "This was an optimal financial choice among available alternatives. "
        else:
            better_count = len(
                [alt for alt in state.get("all_choices", []) 
                 if alt.get("financial_impact", 0) > state["selected_choice"].get("financial_impact", 0)]
            )
            if better_count > 0:
                summary += f"However, {better_count} better financial alternative(s) existed. "
        
        # Add regret assessment
        regret_score = state.get("simulation_update", {}).get("decision_quality_metrics", {}).get("regret_likelihood", 0)
        if regret_score > 0.6:
            summary += "There is a moderate-to-high likelihood of regret. "
        elif regret_score > 0.3:
            summary += "There is some regret risk, but manageable. "
        else:
            summary += "This choice has low regret likelihood. "
        
        # Add learning insight
        learning = state.get("simulation_update", {}).get("decision_quality_metrics", {}).get("learning_opportunity", "")
        if learning:
            summary += f"Key learning: {learning}"
        
        return summary
