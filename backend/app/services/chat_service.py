from sqlalchemy.orm import Session

from app.models.chat import Chat
from app.rag.retriver.retriver import Retriever
from app.services.gemini_services import GeminiService


class ChatService:

    def __init__(self, db: Session):
        self.db = db

    def ask(
        self,
        document_id: int,
        question: str,
        user_id: int = 1
    ):

        retriever = Retriever(self.db)

        chunks = retriever.retrieve(
            document_id=document_id,
            query=question,
            top_k=5
        )

        if not chunks:
            return {
                "answer": "No relevant information found in this document."
            }

        context = Retriever.build_context(chunks)

        answer = GeminiService.ask(
            context=context,
            question=question
        )

        chat = Chat(
            question=question,
            answer=answer,
            user_id=user_id,
            document_id=document_id
        )

        self.db.add(chat)
        self.db.commit()
        self.db.refresh(chat)

        return {
            "answer": answer
        }