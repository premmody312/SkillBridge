# FLASK APP - Run the app using flask --app app.py run
import os, sys
from flask import Flask, request, render_template
import PyPDF2 as pdf
from resume_parser import ats_extractor

sys.path.insert(0, os.path.abspath(os.getcwd()))


# UPLOAD_PATH = r"__DATA__"
# app = Flask(__name__)


# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route("/process", methods=["POST"])
# def ats():
#     doc = request.files['pdf_doc']
#     doc.save(os.path.join(UPLOAD_PATH, "file.pdf"))
#     doc_path = os.path.join(UPLOAD_PATH, "file.pdf")
#     data = _read_file_from_path(doc_path)
#     data = ats_extractor(data)

#     return render_template('index.html', data = json.loads(data))

def input_pdf_text(uploaded_file):
    reader=pdf.PdfReader(uploaded_file)
    text=""
    for page in range(len(reader.pages)):
        page=reader.pages[page]
        text+=str(page.extract_text())
    return text


# if __name__ == "__main__":
#     app.run(port=8000, debug=True)

data = input_pdf_text('Sashank_Agarwal_resume.pdf')
data = ats_extractor(data)
print(data)
