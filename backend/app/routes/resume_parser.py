from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume_service import parse_resume

router = APIRouter()

@router.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    if file.content_type not in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        raise HTTPException(status_code=400, detail="Only PDF or DOCX files are supported")

    parsed_data = parse_resume(file.file, file.content_type)

    if not parsed_data:
        raise HTTPException(status_code=500, detail="Error processing resume")

    return {
        "filename": file.filename,
        "skills": parsed_data["skills"],
        "experience": parsed_data["experience"]
    }
