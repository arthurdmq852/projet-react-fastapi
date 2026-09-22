from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from core.dependencies import get_current_user
from db.database import get_session
from models.favorite import Favorite
from models.item import Item
from models.user import User
from schemas.favorite import FavoriteList, FavoriteRead
from schemas.item import ItemRead


router = APIRouter(
    prefix="/me/favorites",
    tags=["Mes favoris"],
)


@router.post(
    "/{item_id}",
    summary="Ajouter un jeu à mes favoris",
    response_model=FavoriteRead,
    status_code=status.HTTP_201_CREATED,
    responses={
        404: {"description": "Jeu introuvable"},
        409: {"description": "Jeu déjà dans les favoris"},
    },
)
async def add_favorite(
    item_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> FavoriteRead:
    item = await session.get(Item, item_id)

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Jeu introuvable",
        )

    statement = select(Favorite).where(
        Favorite.user_id == current_user.id,
        Favorite.item_id == item_id,
    )
    result = await session.exec(statement)
    existing_favorite = result.first()

    if existing_favorite is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Jeu déjà dans les favoris",
        )

    favorite = Favorite(
        user_id=current_user.id,
        item_id=item_id,
    )

    session.add(favorite)
    await session.commit()
    await session.refresh(favorite)

    return FavoriteRead(
        id=favorite.id,
        item=ItemRead.model_validate(item),
    )


@router.get(
    "",
    summary="Lister mes favoris",
    response_model=FavoriteList,
)
async def get_favorites(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> FavoriteList:
    statement = (
        select(Favorite, Item)
        .join(Item, Favorite.item_id == Item.id)
        .where(Favorite.user_id == current_user.id)
        .order_by(Favorite.id.desc())
    )

    result = await session.exec(statement)
    rows = result.all()

    favorites = [
        FavoriteRead(
            id=favorite.id,
            item=ItemRead.model_validate(item),
        )
        for favorite, item in rows
    ]

    return FavoriteList(
        total=len(favorites),
        results=favorites,
    )


@router.delete(
    "/{item_id}",
    summary="Retirer un jeu de mes favoris",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    responses={404: {"description": "Favori introuvable"}},
)
async def delete_favorite(
    item_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> Response:
    statement = select(Favorite).where(
        Favorite.user_id == current_user.id,
        Favorite.item_id == item_id,
    )
    result = await session.exec(statement)
    favorite = result.first()

    if favorite is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favori introuvable",
        )

    await session.delete(favorite)
    await session.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)