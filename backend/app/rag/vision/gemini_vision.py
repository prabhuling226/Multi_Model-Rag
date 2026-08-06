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

            models_to_try = ["gemini-2.0-flash", "gemini-1.5-flash"]
            for model in models_to_try:
                try:
                    response = self.client.models.generate_content(
                        model=model,
                        contents=[
                            prompt,
                            image,
                        ],
                    )
                    if response and response.text:
                        return response.text.strip()
                except Exception as e:
                    print(f"Gemini Vision Error with {model}: {e}")

            return ""

        except Exception as e:
            print(f"Gemini Vision Error: {e}")
            return ""