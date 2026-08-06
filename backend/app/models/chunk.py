from sqlalchemy import (
    Integer,
    Text,
    ForeignKey,
    JSON,
    String,
)

from sqlalchemy.orm import (
    mapped_column,
    relationship,
    Mapped,
)

from app.config.database import Base


class Chunk(Base):
    __tablename__ = "chunks"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    content_type: Mapped[str] = mapped_column(
        String(30),
        default="TEXT"
    )

    page_number: Mapped[int | None] = mapped_column(
        nullable=True
    )

    section: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    chunk_text: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    # Renamed from 'metadata' because it's a reserved SQLAlchemy attribute
    chunk_metadata: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True
    )

    embedding: Mapped[list] = mapped_column(
        JSON,
        nullable=False
    )

    document_id: Mapped[int] = mapped_column(
        ForeignKey("documents.id"),
        index=True
    )

    document = relationship(
        "Document",
        back_populates="chunks"
    )