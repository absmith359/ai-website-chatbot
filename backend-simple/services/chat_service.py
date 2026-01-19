from utils.ai_client import ask_ai

async def generate_reply(user_message: str):
    reply = await ask_ai(user_message)
    return reply