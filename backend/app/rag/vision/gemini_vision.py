import google.generativeai as genai
from PIL import Image

from app.config.settings import settings


class GeminiVision:

    def __init__(self):

        genai.configure(
            api_key=settings.GOOGLE_API_KEY
        )

        self.model = genai.GenerativeModel(
            "gemini-2.5-flash"
        )

    def describe_image(
        self,
        image_path: str,
    ) -> str:

        try:

            image = Image.open(image_path)

            response = self.model.generate_content(
                [
                    """
                    Analyze this image extracted from a document.

                    If it contains:
                    - graph
                    - chart
                    - flowchart
                    - architecture
                    - screenshot
                    - logo
                    - table
                    - formula

                    explain everything in detail.

                    If text exists,
                    include it.

                    Produce a description suitable
                    for semantic search.
                    """,
                    image,
                ]
            )

            return response.text

        except Exception as e:

            print(f"Gemini Vision Error: {e}")

            return ""