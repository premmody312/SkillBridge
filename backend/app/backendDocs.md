## Running the Backend

### Running the Service

- Make sure to keep your resume under backend/app/uploads/
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

#### Post Request -- Skill Gap Analysis
- URL
  ```bash
  http://localhost:8000/api/v1/skill-gap-analysis
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
