from fastapi import APIRouter
router = APIRouter()

@router.post("/login")
async def login():
    return {"message": "Login successful", "token": "mock-token"}

@router.post("/signup")
async def signup():
    return {"message": "Signup successful"}
