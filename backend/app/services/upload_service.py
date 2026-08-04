from pathlib import Path
import shutil

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
        upload_dir.mkdir(exist_ok=True)

        for file in files:

            filepath = upload_dir / file.filename

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

            processor = ProcessorFactory.get_processor(filepath)

            result = await processor.process(filepath)

            elements = result["elements"]

            chunks = ChunkManager().create_chunks(elements)

            for chunk in chunks:

                embedding = EmbeddingService.embed_document(
                    chunk.content
                )

                db_chunk = Chunk(
                    document_id=document.id,
                    chunk_text=chunk.content,
                    content_type=chunk.chunk_type,
                    page_number=chunk.page_number,
                    chunk_metadata=chunk.metadata,
                    embedding=embedding
                )

                self.db.add(db_chunk)

            self.db.commit()

            uploaded_documents.append(document)

        return {
            "message": "Upload Successful",
            "documents": len(uploaded_documents)
        }