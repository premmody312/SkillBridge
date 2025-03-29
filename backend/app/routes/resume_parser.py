import os
import json
from fastapi import APIRouter, File, UploadFile, HTTPException
from uploads.file_handler import extract_text_from_pdf
from services.resume_service import resume_extractor

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/process")
async def process_resume(pdf_doc: UploadFile = File(...)):
    """
    Upload a resume PDF and extract relevant details using AI.
    """
    file_path = os.path.join(UPLOAD_FOLDER, pdf_doc.filename)

    # Save the uploaded file
    with open(file_path, "wb") as buffer:
        buffer.write(await pdf_doc.read())

    # Extract text from PDF
    resume_text = extract_text_from_pdf(file_path)
    extracted_data = resume_extractor(resume_text)

    # Convert extracted JSON response
    try:
        return json.loads(extracted_data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
