from fastapi import APIRouter
from pydantic import BaseModel
from services.chatbot_service import chatbot_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    chat_history: list[dict] = []

@router.post("/chatbot")
async def chat(request: ChatRequest):
    reply = chatbot_response(request.message, request.chat_history)
    return {"reply": reply}
