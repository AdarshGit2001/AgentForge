from typing import Any

from app.agents.base import BaseAgent
from app.utils.logging import get_logger

logger = get_logger(__name__)


class DesignAgent(BaseAgent):
    role = "design"

    async def execute(self, context: dict[str, Any]) -> dict[str, Any]:
        company_name = context.get("company_name", "AgentForge")
        industry = context.get("industry", "AI Agents")
        service_name = context.get("service_name", "Logo Design")

        service = self.find_service_by_name(service_name)
        if not service:
            service = self.get_services()[0] if self.get_services() else None

        agent = self.get_agent_record()
        result = await self.ai_service.generate_branding(
            company_name=company_name,
            industry=industry,
            service_name=service.name if service else service_name,
        )

        logger.info("Design Agent completed service: %s", service.name if service else service_name)

        return {
            "agent_role": self.role,
            "agent_id": agent.id,
            "service_id": service.id if service else None,
            "service_name": service.name if service else service_name,
            "price_avax": service.price_avax if service else 0.02,
            "output": result,
        }
