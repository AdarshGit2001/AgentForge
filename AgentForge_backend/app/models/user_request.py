from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class UserRequest(Base):
    __tablename__ = "user_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    request_uuid: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    request_type: Mapped[str] = mapped_column(String(64), default="general")
    status: Mapped[str] = mapped_column(String(32), default="pending")
    result: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
    completed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    workflows: Mapped[list["Workflow"]] = relationship(
        "Workflow", back_populates="user_request"
    )
