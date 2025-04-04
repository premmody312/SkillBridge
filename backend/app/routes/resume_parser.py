import os
import json
from fastapi import APIRouter, File, UploadFile, HTTPException, Header
from uploads.file_handler import extract_text_from_pdf
from services.resume_service import resume_extractor
from database import fs, parsed_resumes, users
from io import BytesIO

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/process")
async def process_resume(user_id: str = Header(None), pdf_doc: UploadFile = File(...)):
    """
    Upload a resume PDF, store it locally and in MongoDB, then extract info using Gemini.
    """
    if not user_id:
        raise HTTPException(status_code=400, detail="User-ID header is required")
    
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

        # Store resume ID in users collection
        await add_resume_to_user(user_id, resume_id)

        # Extract text from saved file (or directly from content)
        resume_text = extract_text_from_pdf(BytesIO(content))

        # AI-based parsing
        extracted_data = resume_extractor(resume_text)
        parsed_data = json.loads(extracted_data)
        
        # Store parsed resume in db
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

# Create a user entry (if not exists) and store resume ID
async def add_resume_to_user(user_id: str, resume_id: str):
    user = users.find_one({"_id": user_id})

    if user:
        # Append resume_id to existing list
        users.update_one({"_id": user_id}, {"$push": {"resume_ids": resume_id}})
    else:
        # Create new user document
        users.insert_one({"_id": user_id, "resume_ids": [resume_id]})
