from typing import Any

from app.agents.base import BaseAgent
from app.utils.logging import get_logger

logger = get_logger(__name__)


class DeveloperAgent(BaseAgent):
    role = "developer"

    async def execute(self, context: dict[str, Any]) -> dict[str, Any]:
        product_name = context.get("product_name", context.get("prompt", "AgentForge MVP"))
        description = context.get("description", context.get("prompt", "Autonomous agent economy"))
        service_name = context.get("service_name", "MVP Architecture")

        service = self.find_service_by_name(service_name)
        if not service:
            service = self.get_services()[0] if self.get_services() else None

        agent = self.get_agent_record()
        result = await self.ai_service.generate_mvp_plan(
            product_name=product_name,
            description=description,
            service_name=service.name if service else service_name,
        )

        logger.info(
            "Developer Agent completed service: %s",
            service.name if service else service_name,
        )

        return {
            "agent_role": self.role,
            "agent_id": agent.id,
            "service_id": service.id if service else None,
            "service_name": service.name if service else service_name,
            "price_avax": service.price_avax if service else 0.06,
            "output": result,
        }
