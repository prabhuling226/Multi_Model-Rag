from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.document import Document
from app.models.chat import Chat
from app.models.user import User


class DashboardService:

    @staticmethod
    def get_dashboard(db: Session, current_user: User):

        current_month = datetime.utcnow().month
        current_year = datetime.utcnow().year

        total_documents = (
            db.query(Document)
            .filter(Document.owner_id == current_user.id)
            .count()
        )

        total_chats = (
            db.query(Chat)
            .filter(Chat.user_id == current_user.id)
            .count()
        )

        total_pdfs = (
            db.query(Document)
            .filter(
                Document.owner_id == current_user.id,
                func.lower(Document.file_type) == "pdf"
            )
            .count()
        )

        total_images = (
            db.query(Document)
            .filter(
                Document.owner_id == current_user.id,
                Document.file_type.in_([
                    "jpg",
                    "jpeg",
                    "png",
                    "gif",
                    "webp"
                ])
            )
            .count()
        )

        uploads_this_month = (
            db.query(Document)
            .filter(
                Document.owner_id == current_user.id,
                func.extract("month", Document.uploaded_at) == current_month,
                func.extract("year", Document.uploaded_at) == current_year
            )
            .count()
        )

        recent_documents = (
            db.query(Document)
            .filter(Document.owner_id == current_user.id)
            .order_by(Document.uploaded_at.desc())
            .limit(5)
            .all()
        )

        recent_chats = (
            db.query(Chat)
            .filter(Chat.user_id == current_user.id)
            .order_by(Chat.created_at.desc())
            .limit(5)
            .all()
        )

        return {
            "total_documents": total_documents,
            "total_chats": total_chats,
            "total_pdfs": total_pdfs,
            "total_images": total_images,
            "uploads_this_month": uploads_this_month,
            "recent_documents": recent_documents,
            "recent_chats": recent_chats,
        }