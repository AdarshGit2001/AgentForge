from sqlalchemy.orm import Session

from app.models import Agent
from app.utils.logging import get_logger

logger = get_logger(__name__)


class ReputationService:
    def __init__(self, db: Session):
        self.db = db

    def record_success(self, agent_id: int, reason: str = "") -> int:
        agent = self.db.query(Agent).filter(Agent.id == agent_id).first()
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")

        agent.reputation_score += 1
        self.db.commit()
        logger.info(
            "Reputation +1 for agent %s (%s). New score: %s. Reason: %s",
            agent_id,
            agent.name,
            agent.reputation_score,
            reason or "successful service",
        )
        return agent.reputation_score

    def record_failure(self, agent_id: int, reason: str = "") -> int:
        agent = self.db.query(Agent).filter(Agent.id == agent_id).first()
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")

        agent.reputation_score -= 1
        self.db.commit()
        logger.info(
            "Reputation -1 for agent %s (%s). New score: %s. Reason: %s",
            agent_id,
            agent.name,
            agent.reputation_score,
            reason or "failed service",
        )
        return agent.reputation_score

    def get_reputation(self, agent_id: int) -> int:
        agent = self.db.query(Agent).filter(Agent.id == agent_id).first()
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        return agent.reputation_score
