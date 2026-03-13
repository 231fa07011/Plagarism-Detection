from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    import PyPDF2
    from docx import Document as DocxDocument
    import io

    content = ""
    extension = file.filename.split('.')[-1].lower()

    try:
        if extension == 'pdf':
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(await file.read()))
            for page in pdf_reader.pages:
                content += page.extract_text()
        elif extension == 'docx':
            doc = DocxDocument(io.BytesIO(await file.read()))
            for para in doc.paragraphs:
                content += para.text + "\n"
        else:
            content = (await file.read()).decode('utf-8')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

    return {"filename": file.filename, "text": content, "status": "extracted"}
