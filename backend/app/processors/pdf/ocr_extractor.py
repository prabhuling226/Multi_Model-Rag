try:
    from paddleocr import PaddleOCR
except ImportError:
    PaddleOCR = None


class OCRExtractor:

    def __init__(self):

        if PaddleOCR is None:
            raise RuntimeError(
                "PaddleOCR is not installed."
            )

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

        if result and result[0]:
            for line in result[0]:
                text.append(line[1][0])

        return "\n".join(text)