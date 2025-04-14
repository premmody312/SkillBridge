## Running the Backend

### Running the Service

- Sample resumes in backend/app/uploads/
- Navigate to the backend directory:
  ```bash
  cd backend/app
- Run:
  ```bash
  pip install -r requirements.txt -> installs all necessary packages for the backend to run
  
  python app.py
### Testing
#### Post Request -- Resume Parse
- URL
  ```bash
  http://localhost:8000/api/v1/process
- Header
  ```bash
  user-id: '' // user-id of currently logged in user
- Body Parameters -> form-data
  ```bash
  Key: pdf_doc | Value: your pdf

#### Post Request -- Skill Gap Analysis & Course Recommendation
- URL
  ```bash
  http://localhost:8000/api/v1/skill-gap-with-recommendations 
- Header
  ```bash
  Content-type: application/json
- Body Parameters -> raw
  ```bash
  {
    "resume_id": "", // resume_id of the resume to analyze
    "job_description": "" // Enter description as plain text
  }

#### Get Request -- getResumeById
- Here, resumeId is the chunk id stored in fs.chunks in the skillbridge database
- URL
  ```bash
  http://localhost:8000/api/v1/getResumeById/{resumeId} 
- Example
  ```bash
  http://localhost:8000/api/v1/getResumeById/67edaa32cf6ea1dece401439 

#### Get Request -- download resume by id
- To display the resume by Id
- URL
  ```bash
  http://localhost:8000/api/v1/downloadResumeById/{resumeId} 
- Example
  ```bash
  http://localhost:8000/api/v1/downloadResumeById/67edaa32cf6ea1dece401439 

#### Get Request -- get skill analysis and course recommendation by resume id
- Display the results of missing skills (tech/non-tech) and course recommendations by resume id
- URL
  ```bash
  http://localhost:8000/api/v1/getSkillAnalysisById/{resumeId} 
- Example
  ```bash
  http://localhost:8000/api/v1/getSkillAnalysisById/67ed86acee875d734d400326 

#### Get Request -- Get all Resumes for a user, by user id 
- URL
  ```bash
  http://localhost:8000/api/v1/getAllResumeByUserId 
- Header
  ```bash
  user-id: {} // We will be receiving user id as a header
- Example
  ```bash
  http://localhost:8000/api/v1/getAllResumeById
  Header:
    user-id: 123456789

#### Delete Request -- Deletes the resume pdf for a given reusme_id 
- Deletes from following collections:
  ```bash
  GridFS file + chunks
  Parsed resume
  Skill analysis
  Resume_ids array in Users collection
- URL
  ```bash
  http://localhost:8000/api/v1/deleteResume/{resume_id}
- Header
  ```bash
  user-id: {} // user-id to remove from users collection
- Example
  ```bash
  http://localhost:8000/api/v1/deleteResume/67f18c459ab56ddc72fc2dba
  Header:
    user-id: user_2vCeDUx2obuFz0WEC5znYgH0ZLx

### Post Request -- Chat with AI Career Coach (Chatbot)
- URL
  ```bash
  http://localhost:8000/api/v1/chatbot
- Header
  ```bash
  Content-type: application/json
- Body Parameters -> raw
  ```bash
  {
    "message": "",  // The message or query user is asking the bot
    "chat_history": []  // An array of previous messages (optional for context)
  }

### Post Request -- Generate Cover Letter
- URL
  ```bash
  http://localhost:8000/api/v1/generate-cover-letter
- Header
  ```bash
  Content-type: application/json
- Body Parameters -> raw
  ```bash
  {
    "resume_id": "",  // Resume ID stored in GridFS
    "job_description": "" // Job description as plain text
  }

### Post Request -- Optimize Resume for Job Role
- URL
  ```bash
  http://localhost:8000/api/v1/optimize-resume
- Header
  ```bash
  Content-type: application/json
- Body Parameters -> raw
  ```bash
  {
    "resume_id": "" // Resume ID for which optimization is needed
  }
