from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from routers.items import router as items_router
from routers.auth import router as auth_router
from models.favorite import Favorite
from core.config import settings
from routers.favorite import router as favorites_router
from db.database import init_db
import models 


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await init_db()
    yield


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
    )
app.include_router(items_router)
app.include_router(auth_router)
app.include_router(favorites_router)