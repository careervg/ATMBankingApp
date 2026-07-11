from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import accounts, auth, health
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.core.middleware import RequestLoggingMiddleware
from app.db.database import initialize_database


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings.log_level)
    initialize_database(settings.database_url)

    app = FastAPI(title=settings.app_name, version="1.0.0")
    app.add_middleware(RequestLoggingMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router, prefix="/api/v1", tags=["health"])
    app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
    app.include_router(accounts.router, prefix="/api/v1/accounts", tags=["accounts"])
    return app


app = create_app()