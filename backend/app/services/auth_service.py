from datetime import timedelta

from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)
from app.config.settings import settings
from app.models.user import User


class AuthService:

    def __init__(self, db: Session):
        self.db = db

    def register(
        self,
        full_name: str,
        email: str,
        password: str
    ):

        existing_user = (
            self.db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_user:
            raise ValueError("Email already registered.")

        user = User(
            full_name=full_name,
            email=email,
            password=hash_password(password)
        )

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return {
            "message": "User registered successfully."
        }

    def login(
        self,
        email: str,
        password: str
    ):

        user = (
            self.db.query(User)
            .filter(User.email == email)
            .first()
        )

        if not user:
            raise ValueError("Invalid email or password.")

        if not verify_password(
            password,
            user.password
        ):
            raise ValueError("Invalid email or password.")

        access_token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }