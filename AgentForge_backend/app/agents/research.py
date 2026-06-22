from typing import Any

from app.agents.base import BaseAgent
from app.utils.logging import get_logger

logger = get_logger(__name__)


class ResearchAgent(BaseAgent):
    role = "research"

    async def execute(self, context: dict[str, Any]) -> dict[str, Any]:
        prompt = context.get("prompt", "")
        service_name = context.get("service_name", "Startup Research")

        service = self.find_service_by_name(service_name)
        if not service:
            service = self.get_services()[0] if self.get_services() else None

        agent = self.get_agent_record()
        result = await self.ai_service.generate_research(prompt, service.name if service else service_name)

        logger.info("Research Agent completed service: %s", service.name if service else service_name)

        return {
            "agent_role": self.role,
            "agent_id": agent.id,
            "service_id": service.id if service else None,
            "service_name": service.name if service else service_name,
            "price_avax": service.price_avax if service else 0.03,
            "output": result,
        }
