from pathlib import Path

from docx import Document

from app.processors.base_processor import BaseProcessor
from app.processors.pdf.document_element import DocumentElement

class WordProcessor(BaseProcessor):

    async def process(
        self,
        file_path: Path
    ) -> dict:

        doc = Document(file_path)

        text = "\n".join(
            paragraph.text
            for paragraph in doc.paragraphs
        )

        element = DocumentElement(
            element_type="TEXT",
            page_number=1,
            content=text,
            metadata={}
        )

        return {
            "elements": [element]
        }