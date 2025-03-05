### Running the backend

#### From SKILLBRIDGE/backend
#### > uvicorn app.main:app --reload

#### http://127.0.0.1:8000/docs (Swagger UI for testing)
#### http://127.0.0.1:8000/api/v1/upload-resume/ (Upload resumes)
#### use curl:
#### curl -X 'POST' \
####  'http://127.0.0.1:8000/api/v1/upload-resume/' \
####  -H 'accept: application/json' \
####  -H 'Content-Type: multipart/form-data' \
####  -F 'file=@resume.pdf'