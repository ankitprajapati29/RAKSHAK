"""FastAPI application entry point"""

from fastapi import FastAPI
from fastapi.responses import JSONResponse

from .config.settings import settings

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)


@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint."""
    return JSONResponse(
        status_code=200,
        content={"status": "ok"},
    )