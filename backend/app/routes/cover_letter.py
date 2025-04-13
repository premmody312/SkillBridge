from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from services.cover_letter_service import generate_cover_letter_response
from database import parsed_resumes

router = APIRouter()

class CoverLetterRequest(BaseModel):
    resume_id: str
    job_description: str

@router.post("/generate-cover-letter")
async def generate(data: CoverLetterRequest):
    resume = parsed_resumes.find_one({"resume_id": data.resume_id}, {"_id": 0, "parsed_data": 1})
    if not resume:
        raise HTTPException(status_code=404, detail="Parsed resume not found")
    
    resume_data = resume["parsed_data"]

    # 2. Pass resume data and job description to Gemini for cover letter generation
    try:
        letter = generate_cover_letter_response(data.job_description, resume_data)
        return JSONResponse(content={"cover_letter": letter})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
