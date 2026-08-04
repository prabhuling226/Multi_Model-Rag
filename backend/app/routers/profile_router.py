from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User

from app.schemas.profile_schema import (
    ProfileResponse,
    UpdateProfileRequest,
    ChangePasswordRequest,
    MessageResponse,
)

from app.services.profile_services import ProfileService

router = APIRouter(
    prefix="/profile",
    tags=["Profile"],
)


@router.get("/", response_model=ProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ProfileService(db)
    return service.get_profile(current_user.id)


@router.put("/", response_model=MessageResponse)
def update_profile(
    request: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ProfileService(db)

    try:
        return service.update_profile(
            current_user.id,
            request,
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.put("/change-password", response_model=MessageResponse)
def change_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ProfileService(db)

    try:
        return service.change_password(
            current_user.id,
            request,
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )