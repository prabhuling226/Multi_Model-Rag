from app.processors.pdf.document_element import DocumentElement


class TableExtractor:

    def extract(self, pdf):

        tables = []

        for page_number, page in enumerate(pdf.pages, start=1):

            extracted_tables = page.extract_tables()

            for table in extracted_tables:

                markdown = self.to_markdown(table)

                tables.append(

                    DocumentElement(

                        element_type="TABLE",

                        page_number=page_number,

                        content=markdown,

                        metadata={}

                    )

                )

        return tables

    def to_markdown(self, table):

        if not table:

            return ""

        header = table[0]

        rows = table[1:]

        markdown = "| " + " | ".join(header) + " |\n"

        markdown += "|"

        markdown += "|".join(["---"] * len(header))

        markdown += "|\n"

        for row in rows:

            markdown += "| " + " | ".join(

                str(cell or "")

                for cell in row

            )

            markdown += " |\n"

        return markdown