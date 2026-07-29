import google.generativeai as genai

from app.config.settings import settings

genai.configure(
    api_key=settings.GOOGLE_API_KEY
)

model = genai.GenerativeModel(
    "gemini-3.6-flash"
)


class GeminiService:

    @staticmethod
    def ask(
        context: str,
        question: str
    ) -> str:

        prompt = f"""
You are an expert AI assistant for document question answering.

Instructions:
1. Answer ONLY using the provided context.
2. Do not make up facts.
3. If the answer is not present, reply exactly:
   "I couldn't find that information in the uploaded document."
4. Use Markdown formatting.
5. Use:
   - ## Headings
   - Bullet points
   - Numbered lists
   - Tables when comparing information
6. Keep answers concise but complete.
7. Summarize long paragraphs into readable sections.
8. Preserve important technical terms exactly as written.
9. Never mention information that is not present in the context.

Context:
--------------------
{context}
--------------------

Question:
{question}

Answer:
"""

        try:

            response = model.generate_content(prompt)

            return response.text.strip()

        except Exception as e:
            print(f"Gemini Error: {e}")
            return "Unable to generate a response at the moment."