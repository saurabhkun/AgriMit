import os
import datetime
from groq import Groq, GroqError
from dotenv import load_dotenv

load_dotenv()

def generate_recovery_plan(disease: str, crop: str, lat: float, lon: float, lang: str = "English") -> str:
    """
    Generates a localized, professional recovery plan using Groq API.
    Now includes dynamic language and time-context.
    """
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return "Error: GROQ_API_KEY environment variable is not set."

    # Get current time for "Ideal Spraying Window" context
    current_time = datetime.datetime.now().strftime("%I:%M %p")

    try:
        client = Groq(api_key=api_key)

        if disease.lower() == "healthy":
            prompt = (
                f"You are an expert agronomist for AgriMit. The '{crop}' crop at {lat}° N, {lon}° E "
                f"is HEALTHY. Provide a 3-point maintenance plan and a preventive note about "
                f"coastal humidity in Mangalore. Current time is {current_time}. "
                f"RESPONSE MUST BE IN {lang}."
            )
        else:
            prompt = (
                f"You are an expert agronomist for AgriMit. Create a professional recovery plan for a '{crop}' "
                f"suffering from '{disease}' at coordinates {lat}° N, {lon}° E (Mangalore area). "
                f"Current local time: {current_time}.\n\n"
                f"Your response MUST be in {lang} and include:\n"
                f"1. 5 actionable recovery steps (Organic & Chemical).\n"
                f"2. 'Estimated Recovery Time'.\n"
                f"3. 'Preventive Note' regarding coastal humidity and current time context (e.g., spraying windows).\n\n"
                f"Format with clear Markdown bolding and bullet points."
            )

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a professional agricultural expert system for Mist Agri Corps Ltd."},
                {"role": "user", "content": prompt},
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            max_tokens=1024,
        )

        return response.choices[0].message.content

    except GroqError as e:
        return f"Groq API Error: {e}"
    except Exception as e:
        return f"Unexpected error: {e}"