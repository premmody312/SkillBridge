import fitz  # PyMuPDF for PDF text extraction
import docx2txt  # DOCX extraction
import spacy
import re

# Load spaCy NLP model
nlp = spacy.load("en_core_web_sm")

# Predefined set of technical skills (to improve extraction)
TECH_SKILLS = {
    "python", "java", "c", "c++", "javascript", "sql", "mysql", "oracle", "html",
    "css", "react", "node.js", "mongodb", "postgresql", "django", "flask",
    "git", "docker", "kubernetes", "aws", "azure", "gcp", "tensorflow", "pytorch"
}

# Extract text from PDF
def extract_text_from_pdf(file) -> str:
    doc = fitz.open(stream=file.read(), filetype="pdf")
    return "\n".join(page.get_text("text") for page in doc)

# Extract text from DOCX
def extract_text_from_docx(file) -> str:
    return docx2txt.process(file)

# Extract skills from text
def extract_skills(text):
    skills_found = set()
    words = re.findall(r"\b\w+\b", text.lower())  # Tokenize words
    for word in words:
        if word in TECH_SKILLS:
            skills_found.add(word)
    return list(skills_found)

# Extract experience based on job descriptions
def extract_experience(text):
    experience_sections = []
    lines = text.split("\n")

    for i, line in enumerate(lines):
        if "experience" in line.lower():  # Look for the "EXPERIENCE" section
            experience_sections.append(line.strip())
            for j in range(i+1, min(i+6, len(lines))):  # Grab next few lines
                if lines[j].strip():
                    experience_sections.append(lines[j].strip())
                else:
                    break  # Stop if there's a blank line

    return experience_sections

# Parse resume to extract structured data
def parse_resume(file, filename, content_type):
    if content_type == "application/pdf":
        text = extract_text_from_pdf(file)
    elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        text = extract_text_from_docx(file)
    else:
        return None

    skills = extract_skills(text)
    experience = extract_experience(text)

    return {
        "filename": filename,
        "skills": skills,
        "experience": experience
    }
