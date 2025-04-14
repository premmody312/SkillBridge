import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def chatbot_response(message: str, chat_history: list[dict] = []) -> str:
    history_block = ""
    for i in range(0, len(chat_history) - 1, 2):
        if chat_history[i]["type"] == "user" and chat_history[i + 1]["type"] == "bot":
            history_block += f"\nQ: {chat_history[i]['text']}\nA: {chat_history[i+1]['text']}"

    prompt = f"""
You are SkillBridge AI — a helpful assistant for career preparation.

Your job is ONLY to answer:
1. Technical interview questions (e.g., SQL, data structures, system design)
2. Non-technical interview questions (e.g., behavioral, communication)
3. Role-based questions (e.g., 'What does a DevOps Engineer do?')
4. Career guidance only related to interview expectations or preparation

Do NOT help with:
- Resumes
- Cover letters
- Salary negotiations
- Job applications
- Any other non-interview topics

Conversation history:
{history_block or "None so far."}

User question:
Q: {message}
A:
"""

    response = model.generate_content(prompt)
    return response.text.replace("**", "").strip()
