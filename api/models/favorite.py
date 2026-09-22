from sqlalchemy import UniqueConstraint
from sqlmodel import Field, SQLModel


class Favorite(SQLModel, table=True):
    __tablename__ = "favorites"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "item_id",
            name="unique_user_item_favorite",
        ),
    )

    id: int | None = Field(default=None, primary_key=True)

    user_id: int = Field(
        foreign_key="users.id",
        index=True,
        nullable=False,
    )

    item_id: int = Field(
        foreign_key="items.id",
        index=True,
        nullable=False,
    )