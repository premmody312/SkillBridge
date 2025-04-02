import os
import json
from fastapi import APIRouter, File, UploadFile, HTTPException
from uploads.file_handler import extract_text_from_pdf
from services.resume_service import resume_extractor
from database import fs, parsed_resumes
from io import BytesIO

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/process")
async def process_resume(pdf_doc: UploadFile = File(...)):
    """
    Upload a resume PDF, store it locally and in MongoDB, then extract info using Gemini.
    """
    try:
        # Save file locally
        file_path = os.path.join(UPLOAD_FOLDER, pdf_doc.filename)
        content = await pdf_doc.read()

        with open(file_path, "wb") as f:
            f.write(content)

        # Seek to start of file again
        pdf_doc.file.seek(0)
        # Store in MongoDB GridFS
        resume_id = await store_resume(pdf_doc)

        # Extract text from saved file (or directly from content)
        resume_text = extract_text_from_pdf(BytesIO(content))

        # AI-based parsing
        extracted_data = resume_extractor(resume_text)
        parsed_data = json.loads(extracted_data)
        # Store parsed JSON
        parsed_resumes.insert_one({"resume_id": resume_id, "parsed_data": parsed_data})

        return {
            "resume_id": resume_id,
            "parsed_data": parsed_data
        }

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def store_resume(file: UploadFile) -> str:
    """Stores resume PDF in MongoDB and returns its file ID."""
    resume_id = fs.put(file.file, filename=file.filename)
    return str(resume_id)
