from google import genai
from app.config.settings import settings

client = None
if hasattr(settings, "GOOGLE_API_KEY") and settings.GOOGLE_API_KEY:
    try:
        client = genai.Client(api_key=settings.GOOGLE_API_KEY)
    except Exception as err:
        print(f"GenAI Client Init Notice: {err}")


class GeminiService:

    @staticmethod
    def _fallback_extractive_summary(context: str, question: str) -> str:
        """Extractive context summarizer fallback when Gemini API hits 429 quota limits."""
        lines = [line.strip() for line in context.split("\n") if line.strip() and not line.startswith("---")]
        if not lines:
            return "I couldn't find relevant information in the document context."

        snippet_block = "\n".join(f"- {line}" for line in lines[:8])
        return (
            f"## Document Synthesis (Retrieved Context)\n\n"
            f"*Below is the extracted context matching your query '{question}':*\n\n"
            f"{snippet_block}\n\n"
            f"> *(Note: Gemini API free tier rate limit was active during this request. The response above is synthesized directly from your ingested document vector chunks.)*"
        )

    @classmethod
    def ask(
        cls,
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

Context:
--------------------
{context}
--------------------

Question:
{question}

Answer:
"""

        if client:
            models_to_try = [
                "gemini-2.0-flash",
                "gemini-2.0-flash-lite",
                "gemini-1.5-flash-latest",
                "gemini-1.5-flash",
                "gemini-1.5-pro",
            ]

            for model in models_to_try:
                try:
                    response = client.models.generate_content(
                        model=model,
                        contents=prompt,
                    )
                    if response and response.text:
                        return response.text.strip()
                except Exception as e:
                    print(f"Gemini API Notice for {model}: {e}")

        # Extractive fallback if quota is exhausted or API unavailable
        return cls._fallback_extractive_summary(context, question)