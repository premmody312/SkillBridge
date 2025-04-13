from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import resume_parser, skill_analysis, database, chatbot, cover_letter, optimize_resume
from fastapi.responses import RedirectResponse
app = FastAPI(title="SkillBridge Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(resume_parser.router, prefix="/api/v1")
app.include_router(skill_analysis.router, prefix="/api/v1")
app.include_router(database.router, prefix="/api/v1")
app.include_router(chatbot.router, prefix="/api/v1")
app.include_router(cover_letter.router, prefix="/api/v1")
app.include_router(optimize_resume.router, prefix="/api/v1")

@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
