from sqlalchemy.orm import Session

from app.models.user import User
from backend.app.repository.base_repo import BaseRepository


class AuthRepository(BaseRepository):

    def __init__(self, db: Session):
        super().__init__(db)

    def get_user_by_email(self, email: str):

        return (
            self.db.query(User)
            .filter(User.email == email)
            .first()
        )

    def get_user_by_id(self, user_id: int):

        return (
            self.db.query(User)
            .filter(User.id == user_id)
            .first()
        )

    def create_user(
        self,
        full_name: str,
        email: str,
        password: str,
    ):

        user = User(
            full_name=full_name,
            email=email,
            password=password,
        )

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return user