import PyPDF2

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts text from a given PDF file.
    """
    with open(file_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text = "".join(page.extract_text() for page in reader.pages if page.extract_text())
    return text
