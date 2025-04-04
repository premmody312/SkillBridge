# from fastapi import FastAPI
# from routes import resume_parser, skill_analysis, database

# app = FastAPI(title="SkillBridge Backend")

# # Routes
# app.include_router(resume_parser.router, prefix="/api/v1")
# app.include_router(skill_analysis.router, prefix="/api/v1")
# app.include_router(database.router, prefix="/api/v1")

# @app.get("/")
# async def root():
#     return {"message": "Welcome to SkillBridge API"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import resume_parser, skill_analysis, database

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

@app.get("/")
async def root():
    return {"message": "Welcome to SkillBridge API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
