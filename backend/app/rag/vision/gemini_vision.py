from PIL import Image
from google import genai

from app.config.settings import settings


class GeminiVision:

    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GOOGLE_API_KEY
        )

    def describe_image(
        self,
        image_path: str,
    ) -> str:

        try:
            image = Image.open(image_path)

            prompt = """
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

Explain everything in detail.

If text exists,
include it.

Produce a description suitable for semantic search.
"""

            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[
                    prompt,
                    image,
                ],
            )

            return response.text or ""

        except Exception as e:
            print(f"Gemini Vision Error: {e}")
            return ""