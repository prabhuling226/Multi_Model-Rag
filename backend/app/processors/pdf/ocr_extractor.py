from paddleocr import PaddleOCR


class OCRExtractor:

    def __init__(self):

        self.ocr = PaddleOCR(

            use_angle_cls=True,

            lang="en"

        )

    def read(self, image_path):

        result = self.ocr.ocr(

            image_path,

            cls=True

        )

        text = []

        for line in result[0]:

            text.append(

                line[1][0]

            )

        return "\n".join(text)