from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.config.security import decode_access_token
from app.core.exceptions import (
    InvalidTokenException,
    UserNotFoundException,
)
from app.models.user import User


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)


def get_database():

    yield from get_db()


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_database)
):

    payload = decode_access_token(token)

    if payload is None:
        raise InvalidTokenException()

    user_id = payload.get("sub")

    if user_id is None:
        raise InvalidTokenException()

    user = db.query(User).filter(
        User.id == int(user_id)
    ).first()

    if user is None:
        raise UserNotFoundException()

    return user