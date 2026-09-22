from datetime import datetime, timezone
from enum import Enum
from sqlalchemy import UniqueConstraint
from sqlmodel import SQLModel, Field


class StatutEnum(str, Enum):
    a_decouvrir = "a_decouvrir"
    en_cours = "en_cours"
    termine = "termine"


class CollectionEntry(SQLModel, table=True):
    __tablename__ = "collection_entries"

    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", nullable=False, index=True)
    item_id: int = Field(foreign_key="items.id", nullable=False, index=True)
    
    statut: StatutEnum = Field(default=StatutEnum.a_decouvrir, nullable=False)
    note: int | None = Field(default=None, ge=1, le=5)
    commentaire: str | None = Field(default=None)
    date_ajout: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Empêche d'ajouter deux fois le même jeu pour un même utilisateur
    __table_args__ = (
        UniqueConstraint("user_id", "item_id", name="uq_user_item"),
    )