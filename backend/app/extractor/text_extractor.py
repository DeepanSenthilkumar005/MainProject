from pathlib import Path
from PyPDF2 import PdfReader
from docx import Document

def extract_text_from_txt(file_path: Path) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def extract_text_from_pdf(file_path: Path) -> str:
    reader = PdfReader(file_path)
    return "".join([page.extract_text() or "" for page in reader.pages])

def extract_text_from_docx(file_path: Path) -> str:
    doc = Document(file_path)
    return "\n".join([p.text for p in doc.paragraphs])

def extract_text(file_path: Path) -> str:
    ext = file_path.suffix.lower()
    if ext == ".txt":
        return extract_text_from_txt(file_path)
    elif ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext == ".docx":
        return extract_text_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")
