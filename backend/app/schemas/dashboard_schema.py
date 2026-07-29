from datetime import datetime
from pydantic import BaseModel


class RecentDocument(BaseModel):
    id: int
    filename: str
    file_type: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


class RecentChat(BaseModel):
    id: int
    question: str
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardResponse(BaseModel):
    total_documents: int
    total_chats: int
    total_pdfs: int
    total_images: int
    uploads_this_month: int

    recent_documents: list[RecentDocument]
    recent_chats: list[RecentChat]