from PIL import Image
from google import genai
from app.config.settings import settings


class GeminiVision:

    def __init__(self):
        self.client = None
        if hasattr(settings, "GOOGLE_API_KEY") and settings.GOOGLE_API_KEY:
            try:
                self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)
            except Exception as e:
                print(f"Gemini Vision Init Notice: {e}")

    def describe_image(
        self,
        image_path: str,
    ) -> str:

        if not self.client:
            return ""

        try:
            image = Image.open(image_path)

            prompt = """
Analyze this image extracted from a document.
Describe chart, graph, diagram, table, or text present for semantic search.
"""

            models_to_try = [
                "gemini-2.0-flash",
                "gemini-2.0-flash-lite",
                "gemini-1.5-flash-latest",
                "gemini-1.5-flash",
            ]

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
                    print(f"Gemini Vision Notice for {model}: {e}")

            return ""

        except Exception as e:
            print(f"Gemini Vision Error: {e}")
            return ""