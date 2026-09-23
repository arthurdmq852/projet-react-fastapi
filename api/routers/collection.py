from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from core.dependencies import get_current_user
from db.database import get_session
from models.collection_entry import CollectionEntry, StatutEnum
from models.item import Item
from models.user import User
from schemas.collection import (
    CollectionEntryCreate,
    CollectionEntryRead,
    CollectionEntryUpdate,
    StatsResponse,
)
from schemas.item import ItemRead


router = APIRouter(
    prefix="/me",
    tags=["Collection"],
)


@router.get(
    "/collection",
    summary="Lister ma collection",
    response_model=list[CollectionEntryRead],
)
async def list_collection(
    statut: StatutEnum | None = Query(default=None),
    tri: str | None = Query(default=None, regex="^(date|note)$"),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> list[CollectionEntryRead]:
    statement = (
        select(CollectionEntry, Item)
        .join(Item, CollectionEntry.item_id == Item.id)
        .where(CollectionEntry.user_id == current_user.id)
    )

    if statut:
        statement = statement.where(CollectionEntry.statut == statut)

    if tri == "note":
        statement = statement.order_by(CollectionEntry.note.desc().nulls_last())
    else:
        statement = statement.order_by(CollectionEntry.date_ajout.desc())

    result = await session.exec(statement)
    rows = result.all()

    return [
        CollectionEntryRead(
            id=entry.id,
            statut=entry.statut,
            note=entry.note,
            commentaire=entry.commentaire,
            date_ajout=entry.date_ajout,
            item=ItemRead.model_validate(item),
        )
        for entry, item in rows
    ]


@router.post(
    "/collection",
    summary="Ajouter un élément à ma collection",
    response_model=CollectionEntryRead,
    status_code=status.HTTP_201_CREATED,
    responses={
        404: {"description": "Item inexistant"},
        409: {"description": "Déjà présent dans la collection"},
    },
)
async def add_to_collection(
    data: CollectionEntryCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> CollectionEntryRead:
    item = await session.get(Item, data.item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item introuvable",
        )

    statement = select(CollectionEntry).where(
        CollectionEntry.user_id == current_user.id,
        CollectionEntry.item_id == data.item_id,
    )
    res = await session.exec(statement)
    if res.first() is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Élément déjà présent dans votre collection",
        )

    entry = CollectionEntry(
        user_id=current_user.id,
        item_id=data.item_id,
        statut=data.statut,
        note=data.note,
        commentaire=data.commentaire,
    )
    session.add(entry)
    await session.commit()
    await session.refresh(entry)

    return CollectionEntryRead(
        id=entry.id,
        statut=entry.statut,
        note=entry.note,
        commentaire=entry.commentaire,
        date_ajout=entry.date_ajout,
        item=ItemRead.model_validate(item),
    )


@router.patch(
    "/collection/{entry_id}",
    summary="Modifier une entrée de ma collection",
    response_model=CollectionEntryRead,
    responses={404: {"description": "Entrée introuvable"}},
)
async def update_entry(
    entry_id: int,
    data: CollectionEntryUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> CollectionEntryRead:
    statement = select(CollectionEntry).where(
        CollectionEntry.id == entry_id,
        CollectionEntry.user_id == current_user.id,
    )
    res = await session.exec(statement)
    entry = res.first()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entrée introuvable",
        )

    if data.statut is not None:
        entry.statut = data.statut
    if data.note is not None:
        entry.note = data.note
    if data.commentaire is not None:
        entry.commentaire = data.commentaire

    session.add(entry)
    await session.commit()
    await session.refresh(entry)

    item = await session.get(Item, entry.item_id)

    return CollectionEntryRead(
        id=entry.id,
        statut=entry.statut,
        note=entry.note,
        commentaire=entry.commentaire,
        date_ajout=entry.date_ajout,
        item=ItemRead.model_validate(item),
    )


@router.delete(
    "/collection/{entry_id}",
    summary="Supprimer une entrée de ma collection",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    responses={404: {"description": "Entrée introuvable"}},
)
async def delete_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> Response:
    statement = select(CollectionEntry).where(
        CollectionEntry.id == entry_id,
        CollectionEntry.user_id == current_user.id,
    )
    res = await session.exec(statement)
    entry = res.first()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entrée introuvable",
        )

    await session.delete(entry)
    await session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/stats",
    summary="Statistiques de ma collection",
    response_model=StatsResponse,
)
async def get_stats(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> StatsResponse:
    statement = select(CollectionEntry).where(
        CollectionEntry.user_id == current_user.id
    )
    res = await session.exec(statement)
    entries = res.all()

    total = len(entries)
    par_statut = {
        "a_decouvrir": sum(1 for e in entries if e.statut == StatutEnum.a_decouvrir),
        "en_cours": sum(1 for e in entries if e.statut == StatutEnum.en_cours),
        "termine": sum(1 for e in entries if e.statut == StatutEnum.termine),
    }

    notes = [e.note for e in entries if e.note is not None]
    note_moyenne = round(sum(notes) / len(notes), 2) if notes else None

    return StatsResponse(
        total=total,
        par_statut=par_statut,
        note_moyenne=note_moyenne,
    )