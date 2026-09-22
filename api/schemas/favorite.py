from pydantic import BaseModel

from schemas.item import ItemRead


class FavoriteRead(BaseModel):
    id: int
    item: ItemRead


class FavoriteList(BaseModel):
    total: int
    results: list[FavoriteRead]