from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.chat import ChatRequest
from app.services.chat_service import ChatService
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post("/")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ChatService(db)

    return service.ask(
        question=request.question,
        document_id=request.document_id,
        user_id=current_user.id
    )


@router.get("/history")
def get_chat_history(
    document_id: int | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ChatService(db)
    return service.get_history(user_id=current_user.id, document_id=document_id)