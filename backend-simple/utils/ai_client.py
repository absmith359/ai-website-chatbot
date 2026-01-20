import httpx
from config import AI_API_KEY, AI_MODEL_NAME

print("DEBUG KEY:", AI_API_KEY)

async def ask_ai(message: str):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AI_API_KEY}",
        "Referer": "https://ai-website-chatbot.onrender.com",
        "X-Title": "AI Website Chatbot"
    }

    payload = {
        "model": AI_MODEL_NAME,
        "messages": [{"role": "user", "content": message}]
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                json=payload,
                headers=headers,
                timeout=30
            )
        except Exception as e:
            return f"AI request failed: {e}"

    # Try to parse JSON safely
    try:
        data = response.json()
    except Exception:
        return f"AI error: Non-JSON response ({response.text})"

    # Handle OpenRouter error format
    if "error" in data:
        return f"AI error: {data['error']}"

    # Handle missing choices
    if "choices" not in data:
        return f"AI error: {data}"

    return data["choices"][0]["message"]["content"]