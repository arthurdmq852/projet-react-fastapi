from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from core.dependencies import get_current_user
from core.security import create_access_token, hash_password, verify_password
from db.database import get_session
from models.user import User
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
    session: AsyncSession = Depends(get_session),
) -> UserRead:
    statement = select(User).where(User.email == user_data.email)
    result = await session.exec(statement)
    existing_user = result.first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email déjà utilisé",
        )

    user = User(
        email=str(user_data.email),
        hashed_password=hash_password(user_data.password),
    )

    session.add(user)
    await session.commit()
    await session.refresh(user)

    return user


@router.post(
    "/login",
    summary="Se connecter",
    response_model=TokenResponse,
    responses={401: {"description": "Email ou mot de passe invalide"}},
)
async def login(
    user_data: UserLogin,
    session: AsyncSession = Depends(get_session),
) -> TokenResponse:
    statement = select(User).where(User.email == user_data.email)
    result = await session.exec(statement)
    user = result.first()

    if not user or not verify_password(
        user_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe invalide",
        )

    access_token = create_access_token(
        data={"sub": str(user.id)},
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
    )


@router.get(
    "/me",
    summary="Obtenir mon profil",
    response_model=UserRead,
)
async def read_me(
    current_user: User = Depends(get_current_user),
) -> UserRead:
    return current_user