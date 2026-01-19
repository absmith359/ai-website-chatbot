import httpx
from config import AI_API_KEY, AI_MODEL_NAME

async def ask_ai(message: str):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AI_API_KEY}",
        "HTTP-Referer": "https://ai-website-chatbot.onrender.com",
        "X-Title": "AI Website Chatbot"
    }

    payload = {
        "model": AI_MODEL_NAME,
        "messages": [
            {"role": "user", "content": message}
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            json=payload,
            headers=headers
        )

    data = response.json()

    # Error handling
    if "choices" not in data:
        return f"AI error: {data}"

    return data["choices"][0]["message"]["content"]