from pathlib import Path
import shutil
import uuid

from app.processors.processor_factory import ProcessorFactory
from app.rag.chunking.chunk.chunk_manager import ChunkManager
from app.rag.embeddings.embedding_service import EmbeddingService

from app.models.document import Document
from app.models.chunk import Chunk


class UploadService:

    def __init__(self, db):
        self.db = db

    async def upload_files(
        self,
        files,
        owner_id: int
    ):
        uploaded_documents = []

        upload_dir = Path("uploads")
        upload_dir.mkdir(exist_ok=True, parents=True)

        for file in files:
            # Ensure unique filename on disk
            safe_filename = f"{uuid.uuid4().hex[:8]}_{file.filename}"
            filepath = upload_dir / safe_filename

            with open(filepath, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            document = Document(
                filename=file.filename,
                file_type=filepath.suffix.lower(),
                file_path=str(filepath),
                owner_id=owner_id
            )

            self.db.add(document)
            self.db.commit()
            self.db.refresh(document)

            try:
                processor = ProcessorFactory.get_processor(filepath)
                result = await processor.process(filepath)
                elements = result.get("elements", [])
                chunks = ChunkManager().create_chunks(elements)

                for chunk in chunks:
                    chunk_content = getattr(chunk, "content", "") or ""
                    if not chunk_content.strip():
                        continue

                    try:
                        embedding = EmbeddingService.embed_document(chunk_content)
                    except Exception as emb_err:
                        print(f"Embedding generation error: {emb_err}")
                        # Fallback zero-vector (768 dim for text-embedding-004)
                        embedding = [0.0] * 768

                    db_chunk = Chunk(
                        document_id=document.id,
                        chunk_text=chunk_content,
                        content_type=getattr(chunk, "chunk_type", "TEXT"),
                        page_number=getattr(chunk, "page_number", 1),
                        chunk_metadata=getattr(chunk, "metadata", {}),
                        embedding=embedding
                    )

                    self.db.add(db_chunk)

                self.db.commit()
            except Exception as proc_err:
                print(f"Document processing error for {file.filename}: {proc_err}")

            uploaded_documents.append({
                "id": document.id,
                "filename": document.filename,
                "file_type": document.file_type,
                "uploaded_at": document.uploaded_at.isoformat() if document.uploaded_at else None
            })

        return {
            "success": True,
            "message": "Upload Successful",
            "count": len(uploaded_documents),
            "documents": uploaded_documents
        }