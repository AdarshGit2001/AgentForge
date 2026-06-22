from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class Wallet(Base):
    __tablename__ = "wallets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    agent_id: Mapped[int] = mapped_column(ForeignKey("agents.id"), unique=True, nullable=False)
    address: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    private_key: Mapped[str] = mapped_column(Text, nullable=False)
    balance: Mapped[float] = mapped_column(Float, default=0.0)
    network: Mapped[str] = mapped_column(String(64), default="avalanche-fuji")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    agent: Mapped["Agent"] = relationship("Agent", back_populates="wallet")
    transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction", back_populates="wallet"
    )
