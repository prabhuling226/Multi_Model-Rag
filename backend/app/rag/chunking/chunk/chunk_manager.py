
from .chunk import Chunk

class ChunkManager:

    def create_chunks(self, elements):

        chunks = []

        for element in elements:

            if element.element_type == "TEXT":

                chunks.extend(
                    self._text_chunks(element)
                )

            elif element.element_type == "TABLE":

                chunks.append(
                    self._table_chunk(element)
                )

            elif element.element_type == "IMAGE":

                chunks.append(
                    self._image_chunk(element)
                )

        return chunks

    def _text_chunks(self, element):

        SIZE = 500
        OVERLAP = 100

        text = element.content

        chunks = []

        start = 0

        while start < len(text):

            end = start + SIZE

            chunks.append(

                Chunk(

                    content=text[start:end],

                    chunk_type="TEXT",

                    page_number=element.page_number,

                    metadata=element.metadata

                )

            )

            start += SIZE - OVERLAP

        return chunks

    def _table_chunk(self, element):

        return Chunk(

            content=element.content,

            chunk_type="TABLE",

            page_number=element.page_number,

            metadata=element.metadata

        )

    def _image_chunk(self, element):

        description = ""

        if "caption" in element.metadata:

            description += element.metadata["caption"]

        if "ocr" in element.metadata:

            description += "\n"

            description += element.metadata["ocr"]

        return Chunk(

            content=description,

            chunk_type="IMAGE",

            page_number=element.page_number,

            metadata=element.metadata

        )