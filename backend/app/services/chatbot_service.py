import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def chatbot_response(message: str, resume_data: dict | None = None, chat_history: list[dict] = []) -> str:
    history_block = ""
    for i in range(0, len(chat_history) - 1, 2):
        if chat_history[i]["type"] == "user" and chat_history[i+1]["type"] == "bot":
            history_block += f"\nQ: {chat_history[i]['text']}\nA: {chat_history[i+1]['text']}"

    resume_context = f"\n\nResume Data:\n{resume_data}" if resume_data else "\n\nNo resume data provided."

    prompt = f"""
You are SkillBridge AI — a career assistant and resume expert.

Your job is to help the user with:
- Resume optimization
- Resume scoring
- Cover letter generation
- Career guidance

If resume data is provided, **you must assume it's the latest uploaded version** and use it for any resume-related requests. Never ask the user to upload again.

Use the following conversation history for context:
{history_block or "None so far."}

Current resume status: {"Uploaded ✅" if resume_data else "Not uploaded ❌"}
{resume_context}

Now respond to this:
Q: {message}
A:
"""

    response = model.generate_content(prompt)
    return response.text.strip()
