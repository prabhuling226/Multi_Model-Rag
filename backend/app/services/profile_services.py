from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.models.user import User
from app.schemas.profile_schema import (
    UpdateProfileRequest,
    ChangePasswordRequest,
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


class ProfileService:

    def __init__(self, db: Session):
        self.db = db

    def get_profile(self, user_id: int):

        user = (
            self.db.query(User)
            .filter(User.id == user_id)
            .first()
        )

        if user is None:
            raise Exception("User not found")

        return {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "is_active": user.is_active,
            "created_at": user.created_at,
        }

    def update_profile(
        self,
        user_id: int,
        request: UpdateProfileRequest,
    ):

        user = (
            self.db.query(User)
            .filter(User.id == user_id)
            .first()
        )

        if user is None:
            raise Exception("User not found")

        # Check whether another user already uses this email
        existing_user = (
            self.db.query(User)
            .filter(
                User.email == request.email,
                User.id != user_id,
            )
            .first()
        )

        if existing_user:
            raise Exception("Email already exists")

        user.full_name = request.full_name
        user.email = request.email

        self.db.commit()
        self.db.refresh(user)

        return {
            "message": "Profile updated successfully."
        }

    def change_password(
        self,
        user_id: int,
        request: ChangePasswordRequest,
    ):

        user = (
            self.db.query(User)
            .filter(User.id == user_id)
            .first()
        )

        if user is None:
            raise Exception("User not found")

        if not pwd_context.verify(
            request.current_password,
            user.password,
        ):
            raise Exception("Current password is incorrect.")

        user.password = pwd_context.hash(
            request.new_password
        )

        self.db.commit()

        return {
            "message": "Password changed successfully."
        }