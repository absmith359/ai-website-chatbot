from fastapi import APIRouter
from pydantic import BaseModel
from services.chat_service import generate_reply

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_endpoint(payload: ChatRequest):
    reply = await generate_reply(payload.message)
    return {"reply": reply}