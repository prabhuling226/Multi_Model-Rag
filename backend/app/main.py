from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models
from app.config.database import Base, engine
from app.config.settings import settings
from app.middleware.exception_middleware import ExceptionLoggingMiddleware

from app.api.router import api_router
from app.routers.dashboard_router import router as dashboard_router
from app.routers.document_router import router as document_router
from app.routers.chat_router import router as chat_router
from app.routers.profile_router import router as profile_router

app = FastAPI(
    title=settings.PROJECT_NAME or "AI Document Chat RAG API",
    version="1.0.0",
)

# Custom Exception Logging Middleware (Assignment Requirement)
app.add_middleware(ExceptionLoggingMiddleware)

# CORS Configuration for Localhost & Production (Vercel & Render)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://multi-model-rag-1.onrender.com",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create Database Tables
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database table initialization notice: {e}")

# Router Registration
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)
app.include_router(document_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)


@app.get("/")
def home():
    return {
        "success": True,
        "message": "FastAPI AI Document RAG Backend active",
        "version": "1.0.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "connected",
    }
