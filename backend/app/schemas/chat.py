from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ChatRequest(BaseModel):

    document_id: int

    question: str


class ChatResponse(BaseModel):

    answer: str


class ChatHistoryResponse(BaseModel):

    id: int

    question: str

    answer: str

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )