from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import List, Literal
from app.core.reports import generate_pdf_report
from app.db.session import get_db
from app.models.database import DownloadHistory

router = APIRouter()

class DownloadRequest(BaseModel):
    scan_id: int
    document_title: str
    paper_size: Literal["A3", "A4", "A5"]
    file_format: Literal["PDF", "DOCX"]


@router.post("/download")
async def log_download(req: DownloadRequest, db: Session = Depends(get_db)):
    """
    Logs the download action to the database (history) and returns the file.
    Paper size (A3, A4, A5) and format (PDF, DOCX) are stored in DownloadHistory.
    """
    # Store in database
    db_record = DownloadHistory(
        scan_id=req.scan_id,
        document_title=req.document_title,
        paper_size=req.paper_size,
        file_format=req.file_format,
        downloaded_at=datetime.utcnow()
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    # Generate and return the PDF report (simulated content for now)
    mock_highlights = [
        {
            "matchType": "exact",
            "sentence": "Neural networks are computing systems inspired by biological neural networks.",
            "similarity": 98,
            "source": {"title": "Introduction to Neural Networks"}
        },
    ]
    pdf_content = generate_pdf_report(req.document_title, 34.0, mock_highlights)

    filename = f"report_{req.scan_id}_{req.paper_size}.{req.file_format.lower()}"
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/download/history", response_model=List[dict])
async def get_download_history(db: Session = Depends(get_db)):
    """Returns all recorded download actions sorted by most recent."""
    history = db.query(DownloadHistory).order_by(DownloadHistory.downloaded_at.desc()).all()
    # Convert to dict for response if needed or let FastAPI handle models
    return [
        {
            "id": h.id,
            "scan_id": h.scan_id,
            "document_title": h.document_title,
            "paper_size": h.paper_size,
            "file_format": h.file_format,
            "downloaded_at": h.downloaded_at.isoformat()
        } for h in history
    ]


@router.get("/{scan_id}/pdf")
async def get_pdf_report(scan_id: str):
    """Legacy endpoint — delegates to the standard report generator."""
    mock_highlights = [
        {
            "matchType": "exact",
            "sentence": "Neural networks are computing systems inspired by biological neural networks.",
            "similarity": 98,
            "source": {"title": "Introduction to Neural Networks"}
        },
    ]
    pdf_content = generate_pdf_report("Sample_Analysis.pdf", 34.0, mock_highlights)
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=report_{scan_id}.pdf"}
    )
