from pathlib import Path
from app.processors.base_processor import BaseProcessor
from app.processors.pdf.document_element import DocumentElement


class TxtProcessor(BaseProcessor):
    async def process(self, filepath: Path):
        content = ""
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
        except UnicodeDecodeError:
            with open(filepath, "r", encoding="latin-1") as f:
                content = f.read()

        element = DocumentElement(
            element_type="TEXT",
            content=content,
            page_number=1,
            metadata={"filename": filepath.name}
        )

        return {
            "elements": [element]
        }
