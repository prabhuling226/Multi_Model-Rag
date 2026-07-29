from app.rag.embeddings.embedding_service import EmbeddingService
from app.rag.embeddings.similarity import Similarity
from app.models.chunk import Chunk


class Retriever:

    def __init__(self, db):
        self.db = db

    def retrieve(
        self,
        document_id: int,
        query: str,
        top_k: int = 5
    ):

        query_embedding = EmbeddingService.embed(query)

        chunks = (
            self.db.query(Chunk)
            .filter(
                Chunk.document_id == document_id
            )
            .all()
        )

        scored_chunks = []

        for chunk in chunks:

            score = Similarity.cosine(
                query_embedding,
                chunk.embedding
            )

            scored_chunks.append(
                (score, chunk)
            )

        scored_chunks.sort(
            key=lambda x: x[0],
            reverse=True
        )

        return [
            chunk
            for score, chunk in scored_chunks[:top_k]
        ]

    @staticmethod
    def build_context(chunks):

        context = ""

        for chunk in chunks:

            context += chunk.chunk_text
            context += "\n\n"

        return context