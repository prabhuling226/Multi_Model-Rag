from pathlib import Path

from app.processors.base_processor import BaseProcessor


from app.processors.base_processor import BaseProcessor
from app.processors.pdf.document_element import DocumentElement
from app.processors.pdf.ocr_extractor import OCRExtractor
from app.rag.vision.gemini_vision import GeminiVision

class ImageProcessor(BaseProcessor):

    async def process(
        self,
        file_path: Path
    ) -> dict:

        return {
            "text": "",
            "tables": [],
            "images": [str(file_path)],
            "metadata": {}
        }  



class ImageProcessor(BaseProcessor):

    async def process(
        self,
        file_path: Path
    ):

        ocr = OCRExtractor()

        vision = GeminiVision()

        element = DocumentElement(

            element_type="IMAGE",

            page_number=1,

            content=str(file_path),

            metadata={}

        )

        # OCR

        try:

            element.metadata["ocr"] = ocr.read(
                str(file_path)
            )

        except Exception:

            element.metadata["ocr"] = ""

        # Gemini Vision

        try:

            element.metadata["caption"] = vision.describe_image(
                str(file_path)
            )

        except Exception:

            element.metadata["caption"] = ""

        return {

            "elements": [element]

        }