from fastapi import APIRouter
from fastapi.responses import Response
from app.core.reports import generate_pdf_report

router = APIRouter()

@router.get("/{scan_id}/pdf")
async def get_pdf_report(scan_id: str):
    # In a real app, fetch scan data from DB
    mock_highlights = [
        {"matchType": "exact", "sentence": "Neural networks are computing systems inspired by biological neural networks.", "similarity": 98, "source": {"title": "Introduction to Neural Networks"}},
    ]
    pdf_content = generate_pdf_report("Sample_Analysis.pdf", 34.0, mock_highlights)
    
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=report_{scan_id}.pdf"}
    )
