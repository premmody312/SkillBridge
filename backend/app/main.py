from fastapi import FastAPI
from routes import resume_parser

app = FastAPI(title="SkillBridge Backend")

# Routes
app.include_router(resume_parser.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to SkillBridge API"}
