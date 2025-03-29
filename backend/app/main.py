from fastapi import FastAPI
from routes.resume_parser import router

app = FastAPI()
app.include_router(router, prefix="/api")

@app.get("/")
def home():
    return {"message": "Resume Parser API is running!"}
