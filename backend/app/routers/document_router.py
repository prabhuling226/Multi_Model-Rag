from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    HTTPException,
    status,
)
from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
)
from sqlalchemy.orm import Session
import os

from app.config.database import get_db
from app.services.upload_service import UploadService
from app.services.document_service import DocumentService
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.document import Document

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


# ==========================
# Upload Documents
# ==========================
@router.post("/upload")
async def upload_documents(
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    print("========== UPLOAD ROUTE HIT ==========")
    print([file.filename for file in files])

    service = UploadService(db)

    return await service.upload_files(
        files=files,
        owner_id=current_user.id,
    )


# ==========================
# Get User Documents
# ==========================
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


# ==========================
# Delete Document
# ==========================
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