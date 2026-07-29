from fastapi import APIRouter, Depends
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
        document_id=request.document_id,
        question=request.question,
        user_id=current_user.id
    )