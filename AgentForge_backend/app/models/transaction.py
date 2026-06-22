from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    tx_hash: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    from_agent_id: Mapped[int] = mapped_column(ForeignKey("agents.id"), nullable=False)
    to_agent_id: Mapped[int] = mapped_column(ForeignKey("agents.id"), nullable=False)
    wallet_id: Mapped[int] = mapped_column(ForeignKey("wallets.id"), nullable=True)
    service_id: Mapped[int] = mapped_column(ForeignKey("services.id"), nullable=True)
    workflow_id: Mapped[int] = mapped_column(ForeignKey("workflows.id"), nullable=True)
    amount_avax: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="completed")
    description: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    from_agent: Mapped["Agent"] = relationship(
        "Agent", foreign_keys=[from_agent_id], back_populates="sent_transactions"
    )
    to_agent: Mapped["Agent"] = relationship(
        "Agent", foreign_keys=[to_agent_id], back_populates="received_transactions"
    )
    wallet: Mapped["Wallet"] = relationship("Wallet", back_populates="transactions")
    service: Mapped["Service"] = relationship("Service")
    workflow: Mapped["Workflow"] = relationship("Workflow", back_populates="transactions")
