import os
import re
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

def analyze_resume(resume_data: dict) -> dict:
    prompt = f"""
    You are a career coach and resume expert.

    Analyze the following resume and give markdown-formatted feedback in **five clearly separated sections** and assume that the resume is not in json:

    ---

    ### 1. Strong Action Verbs
    - Create a markdown table with columns: Weak Verb | Strong Verb | Example.

    ---

    ### 2. Measurable Results or Quantifiers
    - Use bullet points.
    - Mention where quantifiers are missing and suggest metrics.

    ---

    ### 3. Resume Formatting and Clarity
    - Bullet-point format recommendations for layout, structure, etc.

    ---

    ### 4. Spelling and Grammar
    - Use bullet points to mention issues or say “No issues found.”

    ---

    ### 5. Overall Feedback
    - Provide a brief summary.
    - End with a clearly formatted JSON block with scores out of 10:
    ```json
    {{
    "verbs": <score>,
    "quantifiers": <score>,
    "formatting": <score>,
    "grammar": <score>,
    "overall": <score>
    }}
    Resume: {resume_data} """

    response = model.generate_content(prompt)
    full_markdown = response.text.strip()

    def extract_section(title: str, alternate_title: str = "") -> str:
        # Regex to match numbered or alternate markdown titles
        numbered_pattern = rf"###\s*\d+\.?\s*{re.escape(title)}"
        alternate_pattern = rf"###\s*{re.escape(alternate_title)}"
        combined_pattern = rf"(?:{numbered_pattern}|{alternate_pattern})\s*\n(.+?)(?=\n###|\Z)"

        match = re.search(combined_pattern, full_markdown, re.DOTALL | re.IGNORECASE)
        if not match:
            return ""

        content = match.group(1).strip()

        # Remove the first line if it's a duplicate of title or alternate_title
        lines = content.splitlines()
        if lines:
            first_line_lower = lines[0].strip().lower()
            if first_line_lower in [title.lower(), alternate_title.lower()]:
                content = "\n".join(lines[1:]).strip()

        return content



    def extract_score_json(markdown: str) -> dict:
        match = re.search(r"```json\s*({.*?})\s*```", markdown, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                return {}
        return {}

    scores = extract_score_json(full_markdown)

    overall_raw = extract_section("5. Overall Feedback")
    overall_cleaned = re.sub(r"```json\s*{[^}]+}\s*```", "", overall_raw, flags=re.DOTALL)

    return {
    "action_verbs": f"### Strong Action Verbs\n\n{extract_section('Action Verbs', 'Strong Action Verbs')}",
    "quantifiers": f"### Measurable Results or Quantifiers\n\n{extract_section('Quantifiers', 'Measurable Results or Quantifiers')}",
    "formatting": f"### Resume Formatting and Clarity\n\n{extract_section('Formatting', 'Resume Formatting and Clarity')}",
    "grammar": f"### Spelling and Grammar\n\n{extract_section('Spelling & Grammar', 'Spelling and Grammar')}",
    "overall_feedback": f"### Overall Feedback\n\n{extract_section('Overall Feedback', 'Overall Feedback')}",
    "scores": {
        "verbs": scores.get("verbs", 0.0),
        "quantifiers": scores.get("quantifiers", 0.0),
        "formatting": scores.get("formatting", 0.0),
        "grammar": scores.get("grammar", 0.0),
        "overall": scores.get("overall", 0.0),
    }
    }

