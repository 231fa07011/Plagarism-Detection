from fastapi import APIRouter
from app.api.endpoints import upload, analyze, auth, reports

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
router.include_router(upload.router, prefix="/upload", tags=["Upload"])
router.include_router(analyze.router, prefix="/analyze", tags=["Analysis"])
router.include_router(reports.router, prefix="/reports", tags=["Reports"])
