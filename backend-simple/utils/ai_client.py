import httpx
from config import AI_API_KEY, AI_MODEL_NAME

async def ask_ai(message: str):
    # Simple OpenAI-style request
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AI_API_KEY}"
    }

    payload = {
        "model": AI_MODEL_NAME,
        "messages": [
            {"role": "user", "content": message}
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            json=payload,
            headers=headers
        )

    data = response.json()
    return data["choices"][0]["message"]["content"]