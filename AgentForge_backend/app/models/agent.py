from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class Agent(Base):
    __tablename__ = "agents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    agent_uuid: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    role: Mapped[str] = mapped_column(String(64), nullable=False)
    wallet_address: Mapped[str] = mapped_column(String(128), nullable=True)
    balance: Mapped[float] = mapped_column(Float, default=0.0)
    reputation_score: Mapped[int] = mapped_column(Integer, default=0)
    description: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    services: Mapped[list["Service"]] = relationship(
        "Service", back_populates="agent", cascade="all, delete-orphan"
    )
    wallet: Mapped["Wallet"] = relationship(
        "Wallet", back_populates="agent", uselist=False, cascade="all, delete-orphan"
    )
    sent_transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction",
        foreign_keys="Transaction.from_agent_id",
        back_populates="from_agent",
    )
    received_transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction",
        foreign_keys="Transaction.to_agent_id",
        back_populates="to_agent",
    )
    executions: Mapped[list["AgentExecution"]] = relationship(
        "AgentExecution", back_populates="agent"
    )
