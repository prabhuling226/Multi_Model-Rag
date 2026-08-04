import google.generativeai as genai

from app.config.settings import settings

genai.configure(api_key=settings.GOOGLE_API_KEY)


class EmbeddingService:

    @staticmethod
    def embed_document(text: str):

        response = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document"
        )

        return response["embedding"]

    @staticmethod
    def embed_query(text: str):

        response = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_query"
        )

        return response["embedding"]