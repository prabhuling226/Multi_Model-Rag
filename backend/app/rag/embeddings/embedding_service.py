from google import genai

from app.config.settings import settings

client = genai.Client(api_key=settings.GOOGLE_API_KEY)


class EmbeddingService:

    @staticmethod
    def embed_document(text: str):
        response = client.models.embed_content(
            model="text-embedding-004",
            contents=text,
        )
        return response.embeddings[0].values

    @staticmethod
    def embed_query(text: str):
        response = client.models.embed_content(
            model="text-embedding-004",
            contents=text,
        )
        return response.embeddings[0].values