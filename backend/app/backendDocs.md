## Running the Backend

### Running the Service

- Sample resumes in backend/app/uploads/
- Navigate to the backend directory:
  ```bash
  cd backend/app
- Run:
  ```bash
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

