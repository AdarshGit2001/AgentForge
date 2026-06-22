from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class Workflow(Base):
    __tablename__ = "workflows"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    workflow_uuid: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    user_request_id: Mapped[int] = mapped_column(ForeignKey("user_requests.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="pending")
    current_agent: Mapped[str] = mapped_column(String(64), default="manager")
    total_cost_avax: Mapped[float] = mapped_column(Float, default=0.0)
    outputs: Mapped[str] = mapped_column(Text, default="{}")
    payments: Mapped[str] = mapped_column(Text, default="[]")
    error_message: Mapped[str] = mapped_column(Text, default="")
    start_time: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    user_request: Mapped["UserRequest"] = relationship("UserRequest", back_populates="workflows")
    executions: Mapped[list["AgentExecution"]] = relationship(
        "AgentExecution", back_populates="workflow", cascade="all, delete-orphan"
    )
    transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction", back_populates="workflow"
    )
