import asyncpg
from fastapi import APIRouter, Depends, HTTPException, status

from core.dependencies import get_current_user
from core.security import create_access_token, hash_password, verify_password
from db.database import get_session
from schemas.auth import TokenResponse, UserLogin, UserRead, UserRegister


router = APIRouter(
    prefix="/auth",
    tags=["Authentification"],
)


@router.post(
    "/register",
    summary="Créer un compte",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    responses={409: {"description": "Email déjà utilisé"}},
)
async def register(
    user_data: UserRegister,
    session: asyncpg.Connection = Depends(get_session),
) -> UserRead:
    try:
        row = await session.fetchrow(
            "INSERT INTO users (email, hashed_password) "
            "VALUES ($1, $2) RETURNING id, email",
            str(user_data.email),
            hash_password(user_data.password),
        )
    except asyncpg.UniqueViolationError:
        raise HTTPException(
            status_code=409,
            detail="Email déjà utilisé",
        )

    return UserRead.model_validate(dict(row))


@router.post(
    "/login",
    summary="Se connecter",
    response_model=TokenResponse,
    responses={401: {"description": "Email ou mot de passe invalide"}},
)
async def login(
    user_data: UserLogin,
    session: asyncpg.Connection = Depends(get_session),
) -> TokenResponse:
    row = await session.fetchrow(
        "SELECT id, hashed_password FROM users WHERE email = $1",
        str(user_data.email),
    )

    if row is None or not verify_password(
        user_data.password,
        row["hashed_password"],
    ):
        raise HTTPException(
            status_code=401,
            detail="Email ou mot de passe invalide",
        )

    token = create_access_token({"sub": str(row["id"])})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
    )


@router.get(
    "/me",
    summary="Obtenir mon profil",
    response_model=UserRead,
    responses={401: {"description": "Token invalide ou expiré"}},
)
async def read_me(
    current_user: dict = Depends(get_current_user),
) -> UserRead:
    return UserRead.model_validate(current_user)