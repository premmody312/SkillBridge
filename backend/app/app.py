from fastapi import FastAPI
from routes import resume_parser, skill_analysis

app = FastAPI(title="SkillBridge Backend")

# Routes
app.include_router(resume_parser.router, prefix="/api/v1")
app.include_router(skill_analysis.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to SkillBridge API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
