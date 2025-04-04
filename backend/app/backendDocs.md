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
- Body Parameters -> form-data
  ```bash
  Key: pdf_doc | Value: your pdf (from local)

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
    "resume_data": {
       "Technical Skills": [], // Enter comma separated skills
       "Soft Skills": [], // Enter comma separated skills
  },
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
  http://localhost:8000/api/v1/download/{resumeId} 
- Example
  ```bash
  http://localhost:8000/api/v1/download/67edaa32cf6ea1dece401439 

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