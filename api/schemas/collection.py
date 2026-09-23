from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from models.collection_entry import StatutEnum
from schemas.item import ItemRead


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

    model_config = ConfigDict(from_attributes=True)


class StatsResponse(BaseModel):
    total: int
    par_statut: dict[str, int]
    note_moyenne: float | None