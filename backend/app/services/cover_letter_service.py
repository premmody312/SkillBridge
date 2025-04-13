import os
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_cover_letter_response(job_description: str, resume_data: dict) -> str:
    prompt = f"""
    You are a professional AI assistant writing tailored cover letters.

    Use the following:
    Resume Data: {resume_data}
    Job Description: {job_description}

    Generate a formal, concise, enthusiastic cover letter relevant to the role.
    Include applicant's relevant strengths and soft skills. Write as if it's being sent to a recruiter.
    """

    response = model.generate_content(prompt)
    return response.text.strip()
