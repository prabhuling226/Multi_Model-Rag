import pdfplumber

from app.processors.pdf.document_element import DocumentElement


class TextExtractor:

    def extract(self, pdf):

        elements = []

        for page_number, page in enumerate(pdf.pages, start=1):

            text = page.extract_text()

            if not text:
                continue

            elements.append(

                DocumentElement(

                    element_type="TEXT",

                    page_number=page_number,

                    content=text,

                    metadata={}

                )

            )

        return elements