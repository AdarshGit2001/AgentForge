import json
from typing import Any, TypedDict

from langgraph.graph import END, StateGraph
from sqlalchemy.orm import Session

from app.agents.design import DesignAgent
from app.agents.developer import DeveloperAgent
from app.agents.manager import ManagerAgent
from app.agents.research import ResearchAgent
from app.models import Agent
from app.services.reputation_service import ReputationService
from app.services.wallet_service import WalletService
from app.utils.logging import get_logger

logger = get_logger(__name__)


class WorkflowState(TypedDict, total=False):
    prompt: str
    request_type: str
    workflow_id: int
    company_name: str
    industry: str
    product_name: str
    description: str
    manager_plan: dict[str, Any]
    research_output: dict[str, Any]
    design_output: dict[str, Any]
    developer_output: dict[str, Any]
    payments: list[dict[str, Any]]
    total_cost_avax: float
    current_step: str
    error: str


class LangGraphOrchestrator:
    """LangGraph-based multi-agent orchestration pipeline."""

    def __init__(self, db: Session):
        self.db = db
        self.wallet_service = WalletService(db)
        self.reputation_service = ReputationService(db)
        self.graph = self._build_graph()

    def _get_manager_agent(self) -> Agent:
        agent = self.db.query(Agent).filter(Agent.role == "manager").first()
        if not agent:
            raise ValueError("Manager agent not found")
        return agent

    async def _manager_node(self, state: WorkflowState) -> WorkflowState:
        logger.info("LangGraph: Manager node executing")
        manager = ManagerAgent(self.db)
        result = await manager.execute(
            {
                "prompt": state.get("prompt", ""),
                "request_type": state.get("request_type", "startup_plan"),
            }
        )
        state["manager_plan"] = result
        state["current_step"] = "research"
        state["payments"] = state.get("payments", [])
        state["total_cost_avax"] = state.get("total_cost_avax", 0.0)
        return state

    async def _research_node(self, state: WorkflowState) -> WorkflowState:
        logger.info("LangGraph: Research node executing")
        plan = state.get("manager_plan", {})
        services = plan.get("selected_services", [])
        research_services = [s for s in services if s["agent_role"] == "research"]

        if not research_services:
            state["current_step"] = "design"
            return state

        manager_agent = self._get_manager_agent()
        research = ResearchAgent(self.db)
        outputs = []

        for service_item in research_services:
            payment = self.wallet_service.send_payment(
                from_agent_id=manager_agent.id,
                to_agent_id=service_item["agent_id"],
                amount_avax=service_item["price_avax"],
                description=f"Payment for {service_item['service_name']}",
                service_id=service_item["service_id"],
                workflow_id=state.get("workflow_id"),
            )
            state["payments"].append(
                {
                    "tx_hash": payment.tx_hash,
                    "service_name": service_item["service_name"],
                    "amount_avax": payment.amount_avax,
                    "agent_role": "research",
                }
            )
            state["total_cost_avax"] += payment.amount_avax

            result = await research.execute(
                {
                    "prompt": state.get("prompt", ""),
                    "service_name": service_item["service_name"],
                }
            )
            outputs.append(result)
            self.reputation_service.record_success(
                service_item["agent_id"],
                f"LangGraph: {service_item['service_name']}",
            )

        state["research_output"] = {"results": outputs}
        state["current_step"] = "design"
        return state

    async def _design_node(self, state: WorkflowState) -> WorkflowState:
        logger.info("LangGraph: Design node executing")
        plan = state.get("manager_plan", {})
        services = plan.get("selected_services", [])
        design_services = [s for s in services if s["agent_role"] == "design"]

        if not design_services:
            state["current_step"] = "developer"
            return state

        manager_agent = self._get_manager_agent()
        design = DesignAgent(self.db)
        outputs = []

        for service_item in design_services:
            payment = self.wallet_service.send_payment(
                from_agent_id=manager_agent.id,
                to_agent_id=service_item["agent_id"],
                amount_avax=service_item["price_avax"],
                description=f"Payment for {service_item['service_name']}",
                service_id=service_item["service_id"],
                workflow_id=state.get("workflow_id"),
            )
            state["payments"].append(
                {
                    "tx_hash": payment.tx_hash,
                    "service_name": service_item["service_name"],
                    "amount_avax": payment.amount_avax,
                    "agent_role": "design",
                }
            )
            state["total_cost_avax"] += payment.amount_avax

            result = await design.execute(
                {
                    "company_name": state.get("company_name", "AgentForge"),
                    "industry": state.get("industry", "AI Agents"),
                    "service_name": service_item["service_name"],
                }
            )
            outputs.append(result)
            self.reputation_service.record_success(
                service_item["agent_id"],
                f"LangGraph: {service_item['service_name']}",
            )

        state["design_output"] = {"results": outputs}
        state["current_step"] = "developer"
        return state

    async def _developer_node(self, state: WorkflowState) -> WorkflowState:
        logger.info("LangGraph: Developer node executing")
        plan = state.get("manager_plan", {})
        services = plan.get("selected_services", [])
        dev_services = [s for s in services if s["agent_role"] == "developer"]

        if not dev_services:
            state["current_step"] = "completed"
            return state

        manager_agent = self._get_manager_agent()
        developer = DeveloperAgent(self.db)
        outputs = []

        for service_item in dev_services:
            payment = self.wallet_service.send_payment(
                from_agent_id=manager_agent.id,
                to_agent_id=service_item["agent_id"],
                amount_avax=service_item["price_avax"],
                description=f"Payment for {service_item['service_name']}",
                service_id=service_item["service_id"],
                workflow_id=state.get("workflow_id"),
            )
            state["payments"].append(
                {
                    "tx_hash": payment.tx_hash,
                    "service_name": service_item["service_name"],
                    "amount_avax": payment.amount_avax,
                    "agent_role": "developer",
                }
            )
            state["total_cost_avax"] += payment.amount_avax

            result = await developer.execute(
                {
                    "product_name": state.get("product_name", state.get("prompt", "AgentForge")),
                    "description": state.get("description", state.get("prompt", "")),
                    "service_name": service_item["service_name"],
                }
            )
            outputs.append(result)
            self.reputation_service.record_success(
                service_item["agent_id"],
                f"LangGraph: {service_item['service_name']}",
            )

        state["developer_output"] = {"results": outputs}
        state["current_step"] = "completed"
        return state

    def _build_graph(self):
        graph = StateGraph(WorkflowState)
        graph.add_node("manager", self._manager_node)
        graph.add_node("research", self._research_node)
        graph.add_node("design", self._design_node)
        graph.add_node("developer", self._developer_node)

        graph.set_entry_point("manager")
        graph.add_edge("manager", "research")
        graph.add_edge("research", "design")
        graph.add_edge("design", "developer")
        graph.add_edge("developer", END)

        return graph.compile()

    async def run(self, initial_state: WorkflowState) -> WorkflowState:
        logger.info(
            "LangGraph workflow starting | type=%s | workflow_id=%s",
            initial_state.get("request_type"),
            initial_state.get("workflow_id"),
        )
        result = await self.graph.ainvoke(initial_state)
        logger.info(
            "LangGraph workflow completed | total_cost=%s AVAX | payments=%s",
            result.get("total_cost_avax", 0),
            len(result.get("payments", [])),
        )
        return result
