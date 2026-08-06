from app.rag.embeddings.embedding_service import EmbeddingService
from app.rag.embeddings.similarity import Similarity
from app.models.chunk import Chunk
from app.models.document import Document


class Retriever:

    def __init__(self, db):
        self.db = db

    def retrieve(
        self,
        query: str,
        document_id: int | None = None,
        user_id: int | None = None,
        top_k: int = 5
    ):
        try:
            query_embedding = EmbeddingService.embed_query(query)
        except Exception as err:
            print(f"Query embedding failed: {err}")
            query_embedding = None

        query_builder = self.db.query(Chunk)

        if document_id is not None:
            query_builder = query_builder.filter(Chunk.document_id == document_id)
        elif user_id is not None:
            query_builder = query_builder.join(Document).filter(Document.owner_id == user_id)

        chunks = query_builder.all()

        if not chunks:
            return []

        if query_embedding is not None:
            scored_chunks = []
            for chunk in chunks:
                if chunk.embedding and len(chunk.embedding) > 0:
                    score = Similarity.cosine(query_embedding, chunk.embedding)
                else:
                    score = 0.0
                scored_chunks.append((score, chunk))

            scored_chunks.sort(key=lambda x: x[0], reverse=True)
            return [chunk for score, chunk in scored_chunks[:top_k]]
        else:
            # Fallback simple keyword match
            keywords = query.lower().split()
            scored_chunks = []
            for chunk in chunks:
                text_lower = chunk.chunk_text.lower()
                matches = sum(1 for kw in keywords if kw in text_lower)
                scored_chunks.append((matches, chunk))

            scored_chunks.sort(key=lambda x: x[0], reverse=True)
            return [chunk for score, chunk in scored_chunks[:top_k] if score > 0] or chunks[:top_k]

    @staticmethod
    def build_context(chunks):
        context_blocks = []
        for idx, chunk in enumerate(chunks, 1):
            doc_info = f"[Chunk {idx} - Page {chunk.page_number or 1}]"
            context_blocks.append(f"{doc_info}\n{chunk.chunk_text}")

        return "\n\n---\n\n".join(context_blocks)