from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from database import parsed_resumes
from services.resume_optimizer_service import analyze_resume

router = APIRouter()

class ResumeOptimizeRequest(BaseModel):
    resume_id: str

@router.post("/optimize-resume")
async def optimize_resume(data: ResumeOptimizeRequest):
    resume = parsed_resumes.find_one({"resume_id": data.resume_id}, {"_id": 0, "parsed_data": 1})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    try:
        result = analyze_resume(resume["parsed_data"])
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
