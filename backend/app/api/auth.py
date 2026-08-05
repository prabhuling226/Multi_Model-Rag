from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.auth import RegisterRequest
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    try:
        return service.register(
            full_name=request.full_name,
            email=request.email,
            password=request.password,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    try:
        return service.login(
            email=form_data.username,
            password=form_data.password,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e),
        )