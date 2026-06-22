from fastapi import APIRouter
from app.services.ai_service import AIService

router = APIRouter(tags=["Testing"])

@router.get("/test-openai")
async def test_openai():
    ai = AIService()

    result = await ai.generate_research(
        "Build an AI startup for students"
    )

    return result