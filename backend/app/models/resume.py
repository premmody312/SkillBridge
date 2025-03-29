from pydantic import BaseModel
from typing import List

class Resume(BaseModel):
    file_name: str
    education: List[str]
    skills: List[str]
    experience: List[str]

