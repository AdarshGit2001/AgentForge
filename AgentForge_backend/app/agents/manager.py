from typing import Any

from app.agents.base import BaseAgent
from app.utils.logging import get_logger

logger = get_logger(__name__)


class ManagerAgent(BaseAgent):
    role = "manager"

    SERVICE_PLAN = {
        "startup_plan": [
            {"role": "research", "service": "Startup Research"},
            {"role": "design", "service": "Branding Package"},
            {"role": "developer", "service": "MVP Architecture"},
        ],
        "logo_generation": [
            {"role": "design", "service": "Logo Design"},
        ],
        "mvp_plan": [
            {"role": "developer", "service": "Landing Page Plan"},
            {"role": "developer", "service": "MVP Architecture"},
        ],
        "general": [
            {"role": "research", "service": "Basic Market Research"},
            {"role": "design", "service": "Logo Design"},
            {"role": "developer", "service": "Landing Page Plan"},
        ],
    }

    async def execute(self, context: dict[str, Any]) -> dict[str, Any]:
        prompt = context.get("prompt", "")
        request_type = context.get("request_type", "general")

        plan = self.SERVICE_PLAN.get(request_type, self.SERVICE_PLAN["general"])
        manager = self.get_agent_record()

        selected_services = []
        total_cost = 0.0

        from app.models import Agent, Service

        for item in plan:
            agent = self.db.query(Agent).filter(Agent.role == item["role"]).first()
            if not agent:
                continue

            service = (
                self.db.query(Service)
                .filter(Service.agent_id == agent.id, Service.name == item["service"])
                .first()
            )
            if service:
                selected_services.append(
                    {
                        "agent_id": agent.id,
                        "agent_role": agent.role,
                        "agent_name": agent.name,
                        "service_id": service.id,
                        "service_name": service.name,
                        "price_avax": service.price_avax,
                    }
                )
                total_cost += service.price_avax

        logger.info(
            "Manager analyzed request '%s' | type=%s | services=%s | total=%s AVAX",
            prompt[:80],
            request_type,
            len(selected_services),
            total_cost,
        )

        return {
            "agent_role": self.role,
            "agent_id": manager.id,
            "prompt": prompt,
            "request_type": request_type,
            "selected_services": selected_services,
            "total_cost_avax": total_cost,
            "decision": f"Selected {len(selected_services)} services for workflow execution",
        }

    def analyze_request(self, prompt: str, request_type: str = "general") -> dict[str, Any]:
        plan = self.SERVICE_PLAN.get(request_type, self.SERVICE_PLAN["general"])
        from app.models import Agent, Service

        selected_services = []
        total_cost = 0.0

        for item in plan:
            agent = self.db.query(Agent).filter(Agent.role == item["role"]).first()
            if not agent:
                continue
            service = (
                self.db.query(Service)
                .filter(Service.agent_id == agent.id, Service.name == item["service"])
                .first()
            )
            if service:
                selected_services.append(
                    {
                        "agent_id": agent.id,
                        "agent_role": agent.role,
                        "agent_name": agent.name,
                        "service_id": service.id,
                        "service_name": service.name,
                        "price_avax": service.price_avax,
                    }
                )
                total_cost += service.price_avax

        return {
            "selected_services": selected_services,
            "total_cost_avax": total_cost,
        }
