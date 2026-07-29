import fitz

from pathlib import Path


from app.processors.pdf.document_element import DocumentElement

class ImageExtractor:

    def extract(

        self,

        pdf_path: Path,

        output_folder: Path,

    ):

        output_folder.mkdir(

            parents=True,

            exist_ok=True

        )

        document = fitz.open(pdf_path)

        elements = []

        for page_number in range(len(document)):

            page = document[page_number]

            images = page.get_images(full=True)

            for image_index, image in enumerate(images):

                xref = image[0]

                pix = fitz.Pixmap(document, xref)

                filename = output_folder / (

                    f"page_{page_number+1}_{image_index}.png"

                )

                pix.save(filename)

                pix = None

                elements.append(

                    DocumentElement(

                        element_type="IMAGE",

                        page_number=page_number + 1,

                        content=str(filename),

                        metadata={}

                    )

                )

        return elements