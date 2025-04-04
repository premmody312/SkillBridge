import os
from pymongo import MongoClient
import gridfs
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["skillbridge"]
fs = gridfs.GridFS(db)  # For storing resume PDFs
parsed_resumes = db["parsed_resumes"] # Collection for parsed resume data
skill_analysis = db["skill_analysis"] # Collection for skill analysis and course recommendation
users = db["users"] # Collection for user and list of resumes associated
