import json
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from services.skill_analysis_service import missing_skill_extractor
from services.course_service import get_course_recommendations

class Skills(BaseModel):
    resume_data: dict
    job_description: str

router = APIRouter()

@router.post("/skill-gap-with-recommendations")
async def skill_gap_analysis(skill: Skills):
    resume_data = skill.resume_data
    job_description = skill.job_description

    extracted_technical_skills = set(resume_data.get("Technical Skills", []))
    extracted_soft_skills = set(resume_data.get("Soft Skills", []))

    required_skills = missing_skill_extractor(job_description)

    try:
        required_skills = json.loads(required_skills)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error parsing AI response.")

    required_technical_skills = set(required_skills.get("Technical Skills", []))
    required_soft_skills = set(required_skills.get("Soft Skills", []))

    # Skill gap analysis
    missing_technical_skills = required_technical_skills - extracted_technical_skills
    missing_soft_skills = required_soft_skills - extracted_soft_skills

    # Course Recommendations
    course_recommendations = get_course_recommendations(
    missing_technical_skills,
    job_description,
    list(missing_technical_skills),
    list(missing_soft_skills)
)

    return {
        "Missing Technical Skills": list(missing_technical_skills),
        "Missing Soft Skills": list(missing_soft_skills),
        "Recommendations": course_recommendations
    }
