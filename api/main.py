from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from core.config import settings
from db.database import close_db, init_db
from routers.auth import router as auth_router
from routers.collection import router as collection_router
from routers.items import router as items_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await init_db()
    try:
        yield
    finally:
        await close_db()


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API REST Ma Collection - Jeux Vidéo",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"erreur": {"code": exc.status_code, "message": exc.detail}},
        headers=exc.headers,
    )


app.include_router(items_router)
app.include_router(auth_router)
app.include_router(collection_router)