from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ChatRequest(BaseModel):
    document_id: int | None = None
    question: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict] = []


class ChatHistoryResponse(BaseModel):
    id: int
    question: str
    answer: str
    document_id: int | None = None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )