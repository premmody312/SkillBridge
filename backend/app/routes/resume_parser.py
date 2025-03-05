from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.services.resume_service import parse_resume

router = APIRouter()

@router.post("/upload-resume/")
async def upload_resume(
    file: UploadFile = File(...), 
    user_id: str = Form(...)
):
    if file.content_type not in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        raise HTTPException(status_code=400, detail="XXX")

    parsed_data = await parse_resume(file.file, file.filename, user_id, file.content_type)

    if not parsed_data:
        raise HTTPException(status_code=500, detail="Error processing resume")

    return {"filename": file.filename, "parsed_resume": parsed_data}
