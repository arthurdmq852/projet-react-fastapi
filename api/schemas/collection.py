from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field

from schemas.item import ItemRead


class StatutEnum(str, Enum):
    a_decouvrir = "a_decouvrir"
    en_cours = "en_cours"
    termine = "termine"


class CollectionEntryCreate(BaseModel):
    item_id: int
    statut: StatutEnum = StatutEnum.a_decouvrir
    note: int | None = Field(default=None, ge=1, le=5)
    commentaire: str | None = None


class CollectionEntryUpdate(BaseModel):
    statut: StatutEnum | None = None
    note: int | None = Field(default=None, ge=1, le=5)
    commentaire: str | None = None


class CollectionEntryRead(BaseModel):
    id: int
    statut: StatutEnum
    note: int | None
    commentaire: str | None
    date_ajout: datetime
    item: ItemRead


class StatsResponse(BaseModel):
    total: int
    par_statut: dict[str, int]
    note_moyenne: float | None