import json
import google.generativeai as genai
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

# Load API key from env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

def get_course_recommendations(job_description: str, tech_skills: List[str],
                               soft_skills: List[str]) -> dict:
    """
    Use Gemini to return separate course recommendations for technical and soft skills.
    """
    prompt = f"""
    You are a helpful assistant.

    A candidate is applying for a role with the following job description:

    {job_description}

    They are missing the following skills:

    Technical Skills: {', '.join(tech_skills)}
    Soft Skills: {', '.join(soft_skills)}

    Recommend relevant online courses to help them upskill.

    Return the results structured like this JSON:

    {{
    "Technical Skills": [
        {{
        "skill": "...",
        "title": "...",
        "platform": "...",
        "url": "..."
        }}
    ],
    "Soft Skills": [
        {{
        "skill": "...",
        "title": "...",
        "platform": "...",
        "url": "..."
        }}
    ]
    }}

    Only return raw JSON. No markdown, no explanation.
    """

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()

        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "").replace("```", "").strip()

        return json.loads(response_text)

    except Exception as e:
        print(f"[ERROR] Gemini course recommendation failed: {e}")
        return {
            "Technical Skills": [],
            "Soft Skills": []
        }
