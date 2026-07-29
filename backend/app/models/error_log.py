from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text

from sqlalchemy.orm import Mapped, mapped_column

from app.config.database import Base


class ErrorLog(Base):
    __tablename__ = "error_logs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    endpoint: Mapped[str] = mapped_column(
        String(255)
    )

    method: Mapped[str] = mapped_column(
        String(20)
    )

    error_message: Mapped[str] = mapped_column(
        Text
    )

    stack_trace: Mapped[str] = mapped_column(
        Text
    )

    user_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )