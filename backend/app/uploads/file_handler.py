from PyPDF2 import PdfReader

def extract_text_from_pdf(file) -> str:
    """
    Extracts text from PDF. Accepts file path or BytesIO.
    """
    reader = PdfReader(file)
    text = "".join(page.extract_text() for page in reader.pages if page.extract_text())
    return text
