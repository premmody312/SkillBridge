import google.generativeai as genai
import re
import os
from dotenv import load_dotenv

load_dotenv()

# Load API key from env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

def missing_skill_extractor(job_description: str) -> str:
    """
    Extract skills from the input job description.
    """
    # AI prompt to extract required skills from job description
    prompt = f"""
    Analyze the following job description and extract the required skills:
    
    Job Description: {job_description}

    Categorize the skills into:
      - Technical Skills
      - Soft Skills

    Provide the response in **plain JSON format without markdown or code blocks**.
    """

    response = model.generate_content(prompt)

    # Remove unwanted ```json ... ``` formatting using regex
    cleaned_response = re.sub(r"```json|```", "", response.text).strip()
    
    return cleaned_response
