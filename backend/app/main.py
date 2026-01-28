from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from fastapi import Body

import shutil

from app.extractor.text_extractor import extract_text
from app.detector.model import detect_ai_text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    temp_file = Path(f"temp_{file.filename}")
    with temp_file.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        text = extract_text(temp_file)
        # print(f"Extracted text from {file.filename}: {text[:100]}...")  # Print first 100 chars
        return {"filename": file.filename, "content": text}
    except Exception as e:
        return {"error": str(e)}
    finally:
        if temp_file.exists():
            temp_file.unlink()

@app.post("/analyze/")
async def analyze_text(payload: dict = Body(...)):
    text = payload.get("text")
    model = payload.get("model", "roberta")  # Default to RoBERTa
    
    if not text:
        return {"error": "No text provided"}
    
    result = detect_ai_text(text, model_name=model)
    return {"analysis": result}
