import os
import pdfplumber
import spacy
from models.resume import Resume

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure uploads directory exists

# Load NLP model
nlp = spacy.load("en_core_web_sm")

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file."""
    with pdfplumber.open(file_path) as pdf:
        return "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])

def extract_resume_data(text: str) -> dict:
    """Extract education, skills, and experience from text."""
    doc = nlp(text)
    education, skills, experience = set(), set(), set()

    for ent in doc.ents:
        if ent.label_ == "ORG":  # Organizations may indicate universities
            education.add(ent.text)
        elif ent.label_ in ["PERSON", "GPE"]:  # Work experiences
            experience.add(ent.text)

    skill_keywords = {"python", "java", "fastapi", "mongodb", "docker", "aws"}
    skills.update({word for word in text.lower().split() if word in skill_keywords})

    return {
        "education": list(education),
        "skills": list(skills),
        "experience": list(experience)
    }

def save_resume(file_name: str, file_content: bytes) -> dict:
    """Save the resume file locally and extract details."""
    file_path = os.path.join(UPLOAD_DIR, file_name)
    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    # Extract text and parse
    text = extract_text_from_pdf(file_path)
    extracted_data = extract_resume_data(text)

    return Resume(
        file_name=file_name,
        education=extracted_data["education"],
        skills=extracted_data["skills"],
        experience=extracted_data["experience"]
    ).dict()

