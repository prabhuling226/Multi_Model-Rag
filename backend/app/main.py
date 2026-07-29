from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models

from app.config.database import Base, engine
from app.config.settings import settings
from app.routers.dashboard_router import router as dashboard_router
from app.api.router import api_router

from app.routers.document_router import router as document_router
from app.routers.chat_router import router as chat_router
from app.routers.profile_router import router as profile_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
)

# Create Database Tables
Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication Routes
app.include_router(
    api_router,
    prefix=settings.API_V1_STR,
)

# Profile Routes
app.include_router(
    profile_router,
    prefix=settings.API_V1_STR,
)

# Document Routes
app.include_router(
    document_router,
    prefix=settings.API_V1_STR,
)

# Chat Routes
app.include_router(
    chat_router,
    prefix=settings.API_V1_STR,
)

app.include_router(
    dashboard_router,
    prefix="/api/v1"
)

# Home Route
@app.get("/")
def home():
    return {
        "success": True,
        "message": "AI Document Chat Backend Running",
    }


# Health Check
@app.get("/health")
def health():
    return {
        "status": "healthy",
    }