from pathlib import Path

from app.processors.excel_processor import ExcelProcessor
from app.processors.image_processor import ImageProcessor
from app.processors.pdf.pdf_processor import PDFProcessor
from app.processors.ppt_processor import PPTProcessor
from app.processors.word_processor import WordProcessor
from app.processors.txt_processor import TxtProcessor


class ProcessorFactory:

    processors = {
        ".pdf": PDFProcessor,
        ".png": ImageProcessor,
        ".jpg": ImageProcessor,
        ".jpeg": ImageProcessor,
        ".docx": WordProcessor,
        ".xlsx": ExcelProcessor,
        ".xls": ExcelProcessor,
        ".pptx": PPTProcessor,
        ".txt": TxtProcessor,
        ".md": TxtProcessor,
    }

    @classmethod
    def get_processor(cls, filename: str):

        extension = Path(filename).suffix.lower()

        processor = cls.processors.get(extension)

        if processor is None:
            raise ValueError(
                f"Unsupported file type: {extension}"
            )

        return processor()