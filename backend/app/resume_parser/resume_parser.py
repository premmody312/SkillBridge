import google.generativeai as genai
import yaml

api_key = None
CONFIG_PATH = r"config.yaml"

with open(CONFIG_PATH) as file:
    data = yaml.load(file, Loader=yaml.FullLoader)
    api_key = data['GEMINI_API_KEY']

def ats_extractor(resume_data):

    prompt = f"""
    You are an AI bot designed to act as a professional for parsing resumes.
    Your job is to extract the following information from the given resume text:

    Resume Data: {resume_data}

    Please extract the following details:
    1. Full name
    2. Email ID
    3. GitHub portfolio
    4. LinkedIn ID
    5. Employment details
    6. Technical skills
    7. Soft skills

    Return the extracted information in valid JSON format only.
    """

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash') 

    response = model.generate_content(prompt)
    data = response.text.strip()

    #print(data)
    return data