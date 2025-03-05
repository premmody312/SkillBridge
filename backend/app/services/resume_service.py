import fitz  # PyMuPDF
import docx2txt
import spacy
from app.database import db

nlp = spacy.load("en_core_web_sm")

async def extract_text(file, content_type: str):
    if content_type == "application/pdf":
        doc = fitz.open(stream=file.read(), filetype="pdf")
        return " ".join([page.get_text("text") for page in doc])
    elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return docx2txt.process(file)
    else:
        return None

async def parse_resume(file, filename, user_id, content_type):
    text = await extract_text(file, content_type)
    if not text:
        return None

    doc = nlp(text)
    skills, education, experience = [], [], []

    for ent in doc.ents:
        if ent.label_ in ["SKILL", "TECHNOLOGY"]:
            skills.append(ent.text)
        elif ent.label_ in ["ORG", "EDUCATION"]:
            education.append(ent.text)
        elif ent.label_ in ["DATE", "WORK_OF_ART"]:
            experience.append(ent.text)

    resume_data = {
        "user_id": user_id,
        "filename": filename,
        "skills": list(set(skills)),
        "education": list(set(education)),
        "experience": list(set(experience)),
        "parsed_text": text
    }

    result = await db.resumes.insert_one(resume_data)
    return resume_data
