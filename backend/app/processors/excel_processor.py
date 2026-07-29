from pathlib import Path

import pandas as pd

from app.processors.base_processor import BaseProcessor
from app.processors.pdf.document_element import DocumentElement

class ExcelProcessor(BaseProcessor):

    async def process(
        self,
        file_path: Path
    ) -> dict:

        sheets = pd.read_excel(
            file_path,
            sheet_name=None
        )

        text = ""

        for name, df in sheets.items():

            text += f"\nSheet: {name}\n"

            text += df.to_string()

        element = DocumentElement(
            element_type="TABLE",
            page_number=1,
            content=text,
            metadata={ "sheet_count": len(sheets)}
        )

        return {
            "elements": [element]
        }