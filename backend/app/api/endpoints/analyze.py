from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.nlp import detector
from app.core.copyleaks import copyleaks_service
import uuid

router = APIRouter()

class AnalysisRequest(BaseModel):
    text: str
    use_api: bool = False

@router.post("/")
async def analyze_text(request: AnalysisRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    if request.use_api:
        try:
            scan_id = str(uuid.uuid4())
            # 1. Authenticate
            copyleaks_service.authenticate()
            # 2. Submit
            copyleaks_service.submit_text(request.text, scan_id)
            # 3. Get results (In real world, this is async)
            # For this modification, we return a hybrid result or mock if API keys aren't set
            results = copyleaks_service.get_results(scan_id)
            return results
        except Exception as e:
            # Fallback to local detector if API fails (e.g. invalid keys)
            return detector.analyze(request.text)
    
    results = detector.analyze(request.text)
    return results
