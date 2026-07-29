import os

from app.models.document import Document
from app.models.chat import Chat
from app.models.chunk import Chunk
from fastapi import HTTPException


class DocumentService:

    ...
    def __init__(self, db):
        self.db = db

    def delete_document(self, document_id: int, user_id: int):

        document = (
            self.db.query(Document)
            .filter(
                Document.id == document_id,
                Document.owner_id == user_id
            )
            .first()
        )

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Document not found"
            )

        if os.path.exists(document.file_path):
            os.remove(document.file_path)

        self.db.query(Chat).filter(
            Chat.document_id == document.id
        ).delete()

        self.db.query(Chunk).filter(
            Chunk.document_id == document.id
        ).delete()

        self.db.delete(document)

        self.db.commit()

        return {
            "message": "Document deleted successfully"
        }