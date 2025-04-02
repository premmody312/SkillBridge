import os
import json
import uuid
from fastapi import APIRouter, File, UploadFile, HTTPException
from uploads.file_handler import extract_text_from_pdf
from services.resume_service import resume_extractor
from database import fs
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
        # Generate a unique resume ID
        resume_id = str(uuid.uuid4())

        # Save file locally
        file_path = os.path.join(UPLOAD_FOLDER, pdf_doc.filename)
        content = await pdf_doc.read()

        with open(file_path, "wb") as f:
            f.write(content)

        # Store in MongoDB GridFS
        fs.put(content, filename=pdf_doc.filename, resume_id=resume_id)

        # Extract text from saved file (or directly from content)
        resume_text = extract_text_from_pdf(BytesIO(content))

        # AI-based parsing
        extracted_data = resume_extractor(resume_text)

        return {
            "resume_id": resume_id,
            "parsed_data": json.loads(extracted_data)
        }

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
