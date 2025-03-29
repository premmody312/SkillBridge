from fastapi import APIRouter, File, UploadFile
from services.resume_service import save_resume
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/upload/")
async def upload_resume(file: UploadFile = File(...)):
    """Upload a resume PDF and extract information."""
    if not file.filename.endswith(".pdf"):
        return JSONResponse(content={"error": "Only PDF files are supported"}, status_code=400)

    extracted_data = save_resume(file.filename, await file.read())
    return extracted_data

