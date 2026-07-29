from pathlib import Path

import pdfplumber

from app.processors.base_processor import BaseProcessor
from app.processors.pdf.text_extractor import TextExtractor
from app.processors.pdf.table_extractor import TableExtractor
from app.processors.pdf.image_extractor import ImageExtractor
from app.rag.vision.gemini_vision import GeminiVision


class PDFProcessor(BaseProcessor):

    async def process(
        self,
        pdf_path: Path,
    ):

        image_folder = Path("uploads/images")
        image_folder.mkdir(
            parents=True,
            exist_ok=True,
        )

        with pdfplumber.open(pdf_path) as pdf:

            text = TextExtractor().extract(pdf)

            tables = TableExtractor().extract(pdf)

        images = ImageExtractor().extract(
            pdf_path,
            image_folder,
        )

        vision = GeminiVision()

        for image in images:

            image.metadata["ocr"] = ""

            try:
                image.metadata["caption"] = vision.describe_image(
                    image.content
                )
            except Exception:
                image.metadata["caption"] = ""

        elements = []

        elements.extend(text)
        elements.extend(tables)
        elements.extend(images)

        return {
            "elements": elements
        }