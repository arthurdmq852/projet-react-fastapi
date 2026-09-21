from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import func, select
from sqlmodel.ext.asyncio.session import AsyncSession

from db.database import get_session
from models.item import Item
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
    q: str | None = Query(
        default=None,
        min_length=2,
        description="Recherche par mot-clé dans le titre",
    ),
    categorie: str | None = Query(
        default=None,
        description="Filtrer par nom de catégorie",
    ),
    page: int = Query(
        default=1,
        ge=1,
        description="Numéro de la page (>= 1)",
    ),
    limit: int = Query(
        default=12,
        ge=1,
        le=50,
        description="Nombre d'éléments par page (1 à 50)",
    ),
    session: AsyncSession = Depends(get_session),
) -> PaginatedItems:
    statement = select(Item)

    # 1. Filtre par mot-clé sur le titre (insensible à la casse)
    if q:
        statement = statement.where(Item.titre.ilike(f"%{q}%"))

    # 2. Filtre par catégorie exacte
    if categorie:
        statement = statement.where(Item.categorie == categorie)

    # 3. Calcul du nombre total d'éléments correspondant aux filtres
    count_statement = select(func.count()).select_from(statement.subquery())
    total_result = await session.exec(count_statement)
    total = total_result.one()

    # 4. Pagination (offset et limit)
    offset = (page - 1) * limit
    statement = statement.offset(offset).limit(limit)

    result = await session.exec(statement)
    items = result.all()

    return PaginatedItems(
        total=total,
        page=page,
        limit=limit,
        results=items,
    )


@router.get(
    "/{item_id}",
    summary="Obtenir le détail d'un jeu",
    response_model=ItemRead,
    responses={404: {"description": "Jeu introuvable"}},
)
async def get_item(
    item_id: int,
    session: AsyncSession = Depends(get_session),
) -> ItemRead:
    item = await session.get(Item, item_id)

    # Renvoie une erreur 404 si l'identifiant n'existe pas en base
    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item introuvable",
        )

    return item