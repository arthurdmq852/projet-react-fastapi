import asyncpg
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from core.dependencies import get_current_user
from db.database import get_session
from schemas.collection import (
    CollectionEntryCreate,
    CollectionEntryRead,
    CollectionEntryUpdate,
    StatsResponse,
    StatutEnum,
)
from schemas.item import ItemRead


router = APIRouter(
    prefix="/me",
    tags=["Collection"],
)

ITEM_FIELDS = (
    "i.id, i.titre, i.categorie, i.description, "
    "i.image_url, i.annee, i.studio, i.plateforme"
)


def lire_entree(row: asyncpg.Record | dict) -> CollectionEntryRead:
    item = {key: row[key] for key in ItemRead.model_fields}

    return CollectionEntryRead(
        id=row["entry_id"],
        statut=row["statut"],
        note=row["note"],
        commentaire=row["commentaire"],
        date_ajout=row["date_ajout"],
        item=ItemRead.model_validate(item),
    )


@router.get(
    "/collection",
    summary="Lister ma collection",
    response_model=list[CollectionEntryRead],
    responses={401: {"description": "Token invalide ou expiré"}},
)
async def list_collection(
    statut: StatutEnum | None = Query(default=None),
    tri: str | None = Query(default=None, pattern="^(date|note)$"),
    current_user: dict = Depends(get_current_user),
    session: asyncpg.Connection = Depends(get_session),
) -> list[CollectionEntryRead]:
    ordre = (
        "e.note DESC NULLS LAST, e.id DESC"
        if tri == "note"
        else "e.date_ajout DESC, e.id DESC"
    )

    rows = await session.fetch(
        f"SELECT e.id AS entry_id, e.statut, e.note, "
        f"e.commentaire, e.date_ajout, {ITEM_FIELDS} "
        "FROM collection_entries e "
        "JOIN items i ON i.id = e.item_id "
        f"WHERE e.user_id = $1 "
        f"AND ($2::text IS NULL OR e.statut = $2) "
        f"ORDER BY {ordre}",
        current_user["id"],
        statut.value if statut else None,
    )

    return [lire_entree(row) for row in rows]


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
    current_user: dict = Depends(get_current_user),
    session: asyncpg.Connection = Depends(get_session),
) -> CollectionEntryRead:
    item = await session.fetchrow(
        f"SELECT {ITEM_FIELDS} FROM items i WHERE i.id = $1",
        data.item_id,
    )

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Item introuvable",
        )

    entry = await session.fetchrow(
        "INSERT INTO collection_entries "
        "(user_id, item_id, statut, note, commentaire) "
        "VALUES ($1, $2, $3, $4, $5) "
        "ON CONFLICT (user_id, item_id) DO NOTHING "
        "RETURNING id AS entry_id, statut, note, commentaire, date_ajout",
        current_user["id"],
        data.item_id,
        data.statut.value,
        data.note,
        data.commentaire,
    )

    if entry is None:
        raise HTTPException(
            status_code=409,
            detail="Élément déjà présent dans votre collection",
        )

    return lire_entree({**dict(entry), **dict(item)})


@router.patch(
    "/collection/{entry_id}",
    summary="Modifier une entrée de ma collection",
    response_model=CollectionEntryRead,
    responses={404: {"description": "Entrée introuvable"}},
)
async def update_entry(
    entry_id: int,
    data: CollectionEntryUpdate,
    current_user: dict = Depends(get_current_user),
    session: asyncpg.Connection = Depends(get_session),
) -> CollectionEntryRead:
    champs = data.model_fields_set

    row = await session.fetchrow(
        "UPDATE collection_entries SET "
        "statut = CASE WHEN $3::bool THEN $4::text ELSE statut END, "
        "note = CASE WHEN $5::bool THEN $6::int ELSE note END, "
        "commentaire = CASE WHEN $7::bool THEN $8::text ELSE commentaire END "
        "WHERE id = $1 AND user_id = $2 "
        "RETURNING id AS entry_id, item_id, statut, note, "
        "commentaire, date_ajout",
        entry_id,
        current_user["id"],
        "statut" in champs and data.statut is not None,
        data.statut.value if data.statut else None,
        "note" in champs,
        data.note,
        "commentaire" in champs,
        data.commentaire,
    )

    if row is None:
        raise HTTPException(
            status_code=404,
            detail="Entrée introuvable",
        )

    item = await session.fetchrow(
        f"SELECT {ITEM_FIELDS} FROM items i WHERE i.id = $1",
        row["item_id"],
    )

    return lire_entree({**dict(row), **dict(item)})


@router.delete(
    "/collection/{entry_id}",
    summary="Supprimer une entrée de ma collection",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    responses={404: {"description": "Entrée introuvable"}},
)
async def delete_entry(
    entry_id: int,
    current_user: dict = Depends(get_current_user),
    session: asyncpg.Connection = Depends(get_session),
) -> Response:
    row = await session.fetchrow(
        "DELETE FROM collection_entries "
        "WHERE id = $1 AND user_id = $2 RETURNING id",
        entry_id,
        current_user["id"],
    )

    if row is None:
        raise HTTPException(
            status_code=404,
            detail="Entrée introuvable",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/stats",
    summary="Statistiques de ma collection",
    response_model=StatsResponse,
    responses={401: {"description": "Token invalide ou expiré"}},
)
async def get_stats(
    current_user: dict = Depends(get_current_user),
    session: asyncpg.Connection = Depends(get_session),
) -> StatsResponse:
    rows = await session.fetch(
        "SELECT statut, note FROM collection_entries WHERE user_id = $1",
        current_user["id"],
    )

    par_statut = {statut.value: 0 for statut in StatutEnum}

    for row in rows:
        par_statut[row["statut"]] += 1

    notes = [row["note"] for row in rows if row["note"] is not None]
    note_moyenne = round(sum(notes) / len(notes), 2) if notes else None

    return StatsResponse(
        total=len(rows),
        par_statut=par_statut,
        note_moyenne=note_moyenne,
    )