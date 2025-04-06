import json
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from services.skill_analysis_service import missing_skill_extractor
from services.course_service import get_course_recommendations
from database import parsed_resumes, skill_analysis

class Skills(BaseModel):
    resume_id: str
    job_description: str

router = APIRouter()

@router.post("/skill-gap-with-recommendations")
async def skill_gap_analysis(skill: Skills):
    resume_id = skill.resume_id
    job_description = skill.job_description

    # Get resume data using resume_id from mongodb
    resume_data = getResume(resume_id)

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
        job_description,
        list(missing_technical_skills),
        list(missing_soft_skills)
    )

    # Store skill analysis and course recommendation in db
    skill_analysis.insert_one({"resume_id": resume_id,
                               "job_description": job_description,  
                               "missing_technical_skills": list(missing_technical_skills),
                               "missing_soft_skills": list(missing_soft_skills),
                               "course_recommendations": course_recommendations})

    return {
        "Missing Technical Skills": list(missing_technical_skills),
        "Missing Soft Skills": list(missing_soft_skills),
        "Recommendations": course_recommendations,
    }

def getResume(resume_id: str):
    """Fetches the parsed resume JSON using resume_id."""
    parsed_data = parsed_resumes.find_one({"resume_id": resume_id}, {"_id": 0, "parsed_data": 1})
    
    if not parsed_data:
        raise HTTPException(status_code=404, detail="Parsed resume not found")

    return parsed_data["parsed_data"]
