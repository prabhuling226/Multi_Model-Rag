from sqlalchemy.orm import Session

from app.config.security import (
    create_access_token,
    hash_password,
    verify_password,
)

from app.core.exceptions import (
    UnauthorizedException,
    UserAlreadyExistsException,
)

from app.repository.auth_repo import AuthRepository

from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
)


class AuthService:

    def __init__(self, db: Session):

        self.repository = AuthRepository(db)

    def register(
        self,
        request: RegisterRequest,
    ):

        existing_user = self.repository.get_user_by_email(
            request.email
        )

        if existing_user:
            raise UserAlreadyExistsException()

        hashed_password = hash_password(
            request.password
        )

        user = self.repository.create_user(
            full_name=request.full_name,
            email=request.email,
            password=hashed_password,
        )

        token = create_access_token(
            user.id
        )

        return {
            "user": user,
            "access_token": token,
            "token_type": "bearer",
        }

    def login(
        self,
        request: LoginRequest,
    ):

        user = self.repository.get_user_by_email(
            request.email
        )

        if not user:
            raise UnauthorizedException()

        if not verify_password(
            request.password,
            user.password,
        ):
            raise UnauthorizedException()

        token = create_access_token(
            user.id
        )

        return {
            "user": user,
            "access_token": token,
            "token_type": "bearer",
        }