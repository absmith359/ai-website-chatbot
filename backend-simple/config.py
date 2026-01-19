import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

AI_API_KEY = os.getenv("AI_API_KEY")
AI_MODEL_NAME = os.getenv("AI_MODEL_NAME", "deepseek/deepseek-r1:free")

BACKEND_URL = os.getenv("BACKEND_URL", "https://ai-website-chatbot.onrender.com")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://ai-website-chatbot-beige.vercel.app")

WIDGET_URL = os.getenv("WIDGET_URL")