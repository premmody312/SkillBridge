## Running the Backend

### Running the Service


- Make sure to keep your resume under backend/app/uploads/
- Navigate to the backend directory:
  ```bash
  cd backend/app
- Run:
  ```bash
  python main.py
### Testing
#### Post Request 
- URL
  ```bash
  http://localhost:8000/api/v1/process
- Body Parameters -> form-data
  ```bash
  Key: pdf_doc | Value: your pdf (from local)

