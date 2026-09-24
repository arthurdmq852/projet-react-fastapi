import asyncpg
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from core.config import settings
from db.database import get_session


security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
    session: asyncpg.Connection = Depends(get_session),
) -> dict:
    erreur = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalide ou expiré",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if credentials is None:
        raise erreur

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        user_id = int(payload["sub"])
    except (JWTError, ValueError, KeyError, TypeError):
        raise erreur

    row = await session.fetchrow(
        "SELECT id, email FROM users WHERE id = $1",
        user_id,
    )

    if row is None:
        raise erreur

    return dict(row)