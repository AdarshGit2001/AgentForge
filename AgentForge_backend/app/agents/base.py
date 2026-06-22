from abc import ABC, abstractmethod
from typing import Any

from sqlalchemy.orm import Session

from app.models import Agent, Service
from app.services.ai_service import AIService
from app.services.reputation_service import ReputationService
from app.services.wallet_service import WalletService
from app.utils.logging import get_logger

logger = get_logger(__name__)


class BaseAgent(ABC):
    role: str = "base"

    def __init__(self, db: Session):
        self.db = db
        self.ai_service = AIService()
        self.wallet_service = WalletService(db)
        self.reputation_service = ReputationService(db)

    def get_agent_record(self) -> Agent:
        agent = self.db.query(Agent).filter(Agent.role == self.role).first()
        if not agent:
            raise ValueError(f"Agent with role '{self.role}' not found")
        return agent

    def get_services(self) -> list[Service]:
        agent = self.get_agent_record()
        return (
            self.db.query(Service)
            .filter(Service.agent_id == agent.id, Service.is_active == 1)
            .all()
        )

    def find_service_by_name(self, service_name: str) -> Service | None:
        agent = self.get_agent_record()
        return (
            self.db.query(Service)
            .filter(
                Service.agent_id == agent.id,
                Service.name.ilike(f"%{service_name}%"),
                Service.is_active == 1,
            )
            .first()
        )

    @abstractmethod
    async def execute(self, context: dict[str, Any]) -> dict[str, Any]:
        pass
