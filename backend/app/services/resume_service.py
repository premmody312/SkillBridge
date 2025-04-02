import google.generativeai as genai
import re
import os
from dotenv import load_dotenv

load_dotenv()

# Load API key from env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

def resume_extractor(resume_text: str) -> str:
    """
    Extracts structured resume details using Google Gemini AI.
    """
    prompt = f"""
    You are an AI bot designed to parse resumes.
    Extract the following details from the given text:

    Resume Data: {resume_text}

    Extract:
    1. Full Name
    2. Email ID
    3. GitHub Portfolio
    4. LinkedIn ID
    5. Employment Details
    6. Technical Skills
    7. Soft Skills

    Return the output in valid JSON format.
    """

    response = model.generate_content(prompt)

    # Remove unwanted ```json ... ``` formatting using regex
    cleaned_response = re.sub(r"```json|```", "", response.text).strip()
    
    return cleaned_response
