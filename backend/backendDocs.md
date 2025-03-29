### Running the backend

#### From SKILLBRIDGE/backend/app
#### > uvicorn main:app --reload

#### http://127.0.0.1:8000/docs (Swagger UI for testing)
#### http://127.0.0.1:8000/api/v1/upload-resume/ (Upload resumes)
#### use curl:
#### curl -X 'POST' 'http://127.0.0.1:8000/api/upload/' \
#### -H 'accept: application/json' \
#### -H 'Content-Type: multipart/form-data' \
#### -F 'file=@uploads/resume.pdf'




