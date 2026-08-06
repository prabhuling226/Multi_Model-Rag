import hashlib
import numpy as np
from google import genai
from app.config.settings import settings

client = None
if hasattr(settings, "GOOGLE_API_KEY") and settings.GOOGLE_API_KEY:
    try:
        client = genai.Client(api_key=settings.GOOGLE_API_KEY)
    except Exception as e:
        print(f"GenAI Client Init Notice: {e}")


class EmbeddingService:

    @staticmethod
    def _local_hash_embedding(text: str, dim: int = 768) -> list[float]:
        """Deterministic 768-dim vector fallback based on character & word hashing."""
        vec = np.zeros(dim, dtype=float)
        words = text.lower().split()
        if not words:
            return vec.tolist()

        for idx, word in enumerate(words):
            hash_val = int(hashlib.md5(word.encode("utf-8")).hexdigest(), 16)
            position = hash_val % dim
            val = ((hash_val >> 16) % 1000) / 1000.0
            vec[position] += val

        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()

    @classmethod
    def embed_document(cls, text: str) -> list[float]:
        if client:
            models_to_try = ["text-embedding-004", "embedding-001"]
            for model in models_to_try:
                try:
                    response = client.models.embed_content(
                        model=model,
                        contents=text,
                    )
                    if response and hasattr(response, "embeddings") and response.embeddings:
                        return response.embeddings[0].values
                except Exception as err:
                    print(f"Embedding API error with {model}: {err}")

        # Local fallback if API key quota exhausted or model not available
        return cls._local_hash_embedding(text)

    @classmethod
    def embed_query(cls, text: str) -> list[float]:
        return cls.embed_document(text)