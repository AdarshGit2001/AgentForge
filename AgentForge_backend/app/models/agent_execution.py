from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class AgentExecution(Base):
    __tablename__ = "agent_executions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    workflow_id: Mapped[int] = mapped_column(ForeignKey("workflows.id"), nullable=False)
    agent_id: Mapped[int] = mapped_column(ForeignKey("agents.id"), nullable=False)
    service_id: Mapped[int] = mapped_column(ForeignKey("services.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="pending")
    input_data: Mapped[str] = mapped_column(Text, default="")
    output_data: Mapped[str] = mapped_column(Text, default="")
    payment_tx_hash: Mapped[str] = mapped_column(String(128), default="")
    started_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
    completed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    workflow: Mapped["Workflow"] = relationship("Workflow", back_populates="executions")
    agent: Mapped["Agent"] = relationship("Agent", back_populates="executions")
    service: Mapped["Service"] = relationship("Service")
