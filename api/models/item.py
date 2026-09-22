from sqlmodel import SQLModel, Field


class Item(SQLModel, table=True):
    __tablename__ = "items"

    id: int | None = Field(default=None, primary_key=True)
    titre: str = Field(index=True, nullable=False)
    categorie: str = Field(index=True, nullable=False)
    description: str = Field(nullable=False)
    image_url: str = Field(nullable=False)
    annee: int = Field(nullable=False)

    studio: str = Field(nullable=False)
    plateforme: str = Field(nullable=False)