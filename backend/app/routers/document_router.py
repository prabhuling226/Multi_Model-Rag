from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
)

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import os

from app.config.database import get_db
from app.services.upload_service import UploadService
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.document import Document

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@router.post("/upload")
async def upload_documents(
    files: list[UploadFile],
    db: Session = Depends(get_db),
):
    service = UploadService(db)

    return await service.upload_files(
        files=files,
        owner_id=1
    )


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
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.owner_id == current_user.id
        )
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    # Delete file from disk if it exists
    if document.file_path and os.path.exists(document.file_path):
        os.remove(document.file_path)

    # Delete from database
    db.delete(document)
    db.commit()

    return {"message": "Document deleted successfully"}
from app.services.document_service import DocumentService

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