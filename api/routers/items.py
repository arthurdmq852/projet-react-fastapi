import asyncpg
from fastapi import APIRouter, Depends, HTTPException, Query
from db.database import get_session
from schemas.item import ItemRead, PaginatedItems


router = APIRouter(
    prefix="/items",
    tags=["Catalogue"],
)


@router.get(
    "",
    summary="Lister les jeux du catalogue",
    response_model=PaginatedItems,
)
async def get_items(
    q: str | None = Query(default=None, min_length=2),
    categorie: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=50),
    session: asyncpg.Connection = Depends(get_session),
) -> PaginatedItems:
    filtre = (
        "WHERE ($1::text IS NULL OR titre ILIKE '%' || $1 || '%') "
        "AND ($2::text IS NULL OR categorie = $2)"
    )

    total = await session.fetchval(
        f"SELECT COUNT(*) FROM items {filtre}",
        q,
        categorie,
    )

    rows = await session.fetch(
        f"SELECT id, titre, categorie, description, image_url, "
        f"annee, studio, plateforme FROM items {filtre} "
        "ORDER BY id LIMIT $3 OFFSET $4",
        q,
        categorie,
        limit,
        (page - 1) * limit,
    )

    return PaginatedItems(
        total=total,
        page=page,
        limit=limit,
        results=[ItemRead.model_validate(dict(row)) for row in rows],
    )


@router.get(
    "/{item_id}",
    summary="Obtenir le détail d'un jeu",
    response_model=ItemRead,
    responses={404: {"description": "Jeu introuvable"}},
)
async def get_item(
    item_id: int,
    session: asyncpg.Connection = Depends(get_session),
) -> ItemRead:
    row = await session.fetchrow(
        "SELECT id, titre, categorie, description, image_url, "
        "annee, studio, plateforme FROM items WHERE id = $1",
        item_id,
    )

    if row is None:
        raise HTTPException(
            status_code=404,
            detail="Item introuvable",
        )

    return ItemRead.model_validate(dict(row))