from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from database import fs, parsed_resumes, skill_analysis
import gridfs
import io
from bson import ObjectId

router = APIRouter()

@router.get("/getResumeById/{resume_id}")
async def get_resume(resume_id: str):
    """Fetches the parsed resume JSON using resume_id."""
    parsed_data = parsed_resumes.find_one({"resume_id": resume_id}, {"_id": 0, "parsed_data": 1})
    
    if not parsed_data:
        raise HTTPException(status_code=404, detail="Parsed resume not found")

    return JSONResponse(content={"resume_id": resume_id, "parsed_data": parsed_data["parsed_data"]})

@router.get("/download/{resume_id}")
async def download_resume(resume_id: str):
    """Downloads the stored resume PDF."""
    try:
        file_data = fs.get(ObjectId(resume_id))
        return StreamingResponse(io.BytesIO(file_data.read()), 
                                 media_type="application/pdf",
                                 headers={"Content-Disposition": f"attachment; filename={resume_id}_{file_data.filename}"})
    except gridfs.errors.NoFile:
        raise HTTPException(status_code=404, detail="Resume not found")


@router.get("/getSkillAnalysisById/{resume_id}")
async def get_skill_analysis(resume_id: str):
    """
    Fetches the stored skill analysis and course recommendations by resume_id.
    """
    skill_analysis_data = skill_analysis.find_one(
        {"resume_id": resume_id},
        {"_id": 0}
    )

    if not skill_analysis_data:
        raise HTTPException(status_code=404, detail="Skill analysis not found")

    return JSONResponse(content={
        "resume_id": resume_id,
        "missing_technical_skills": skill_analysis_data.get("missing_technical_skills", []),
        "missing_soft_skills": skill_analysis_data.get("missing_soft_skills", []),
        "course_recommendations": skill_analysis_data.get("course_recommendations", {})
    })
