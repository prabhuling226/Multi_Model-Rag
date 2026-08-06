from sqlalchemy.orm import Session

from app.models.chat import Chat
from app.rag.retriver.retriver import Retriever
from app.services.gemini_services import GeminiService


class ChatService:

    def __init__(self, db: Session):
        self.db = db

    def ask(
        self,
        question: str,
        document_id: int | None = None,
        user_id: int = 1
    ):
        retriever = Retriever(self.db)

        chunks = retriever.retrieve(
            query=question,
            document_id=document_id,
            user_id=user_id,
            top_k=5
        )

        sources = [
            {
                "chunk_id": chunk.id,
                "document_id": chunk.document_id,
                "document_name": chunk.document.filename if chunk.document else f"Doc #{chunk.document_id}",
                "page_number": chunk.page_number,
                "snippet": chunk.chunk_text[:180] + ("..." if len(chunk.chunk_text) > 180 else ""),
            }
            for chunk in chunks
        ]

        if not chunks:
            answer = "I couldn't find any relevant information in your uploaded documents. Please upload documents related to your query."
            return {
                "answer": answer,
                "sources": []
            }

        context = Retriever.build_context(chunks)

        answer = GeminiService.ask(
            context=context,
            question=question
        )

        try:
            chat = Chat(
                question=question,
                answer=answer,
                user_id=user_id,
                document_id=document_id
            )
            self.db.add(chat)
            self.db.commit()
            self.db.refresh(chat)
        except Exception as err:
            self.db.rollback()
            print(f"Failed to save chat history: {err}")

        return {
            "answer": answer,
            "sources": sources
        }

    def get_history(self, user_id: int, document_id: int | None = None):
        query = self.db.query(Chat).filter(Chat.user_id == user_id)
        if document_id is not None:
            query = query.filter(Chat.document_id == document_id)

        history = query.order_by(Chat.created_at.desc()).limit(50).all()
        return [
            {
                "id": chat.id,
                "question": chat.question,
                "answer": chat.answer,
                "document_id": chat.document_id,
                "created_at": chat.created_at.isoformat() if chat.created_at else None
            }
            for chat in history
        ]