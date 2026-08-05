from datetime import timedelta

from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
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
        password: str,
    ):

        existing_user = (
            self.db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_user:
            raise ValueError("Email already registered.")

        hashed_password = hash_password(password)

        print("========== REGISTER DEBUG ==========")
        print("EMAIL:", email)
        print("HASH:", hashed_password)

        user = User(
            full_name=full_name,
            email=email,
            password=hashed_password,
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
        password: str,
    ):

        print("========== LOGIN DEBUG ==========")
        print("EMAIL:", email)

        user = (
            self.db.query(User)
            .filter(User.email == email)
            .first()
        )

        print("USER:", user)

        if user is None:
            print("❌ USER NOT FOUND")
            raise ValueError("Invalid email or password.")

        print("STORED HASH:", user.password)

        valid = verify_password(
            password,
            user.password,
        )

        print("VERIFY RESULT:", valid)

        if not valid:
            print("❌ PASSWORD MISMATCH")
            raise ValueError("Invalid email or password.")

        print("✅ PASSWORD VERIFIED")

        access_token = create_access_token(
            data={
                "sub": str(user.id),
            },
            expires_delta=timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            ),
        )

        print("TOKEN CREATED")

        return {
            "access_token": access_token,
            "token_type": "bearer",
        }