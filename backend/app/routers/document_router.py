from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.document import Document
from app.services.document_service import DocumentService

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)

@router.post("/upload")
async def upload_documents(
    files: list[UploadFile] = File(...)
):
    print("UPLOAD ROUTE HIT")

    return {
        "success": True,
        "files": [file.filename for file in files]
    }

@router.get("/")
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    documents = (
        db.query(Document)
        .filter(Document.owner_id == current_user.id)
        .order_by(Document.id.desc())
        .all()
    )

    return documents

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DocumentService(db)

    return service.delete_document(
        document_id=document_id,
        user_id=current_user.id,
    )