from fastapi import APIRouter
from pydantic import BaseModel
from services.chatbot_service import chatbot_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    resume_data: dict | None = None
    chat_history: list[dict] = []

@router.post("/chatbot")
async def chat(request: ChatRequest):
    reply = chatbot_response(request.message, request.resume_data, request.chat_history)
    return {"reply": reply}
