from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database.init_db import init_db
from app.routers import agents, demo, services, transactions, wallets, workflow
from app.utils.logging import get_logger, setup_logging
from app.routers import (
    agents,
    demo,
    services,
    transactions,
    wallets,
    workflow,
    test_openai,
)

setup_logging()
logger = get_logger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting %s v%s", settings.app_name, settings.app_version)
    init_db()
    yield
    logger.info("Shutting down %s", settings.app_name)


app = FastAPI(
    title=settings.app_name,
    description=(
        "AgentForge — Autonomous AI agent economy with Avalanche Fuji testnet payments. "
        "Built for the Avalanche Agentic Payments Speedrun."
    ),
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents.router)
app.include_router(services.router)
app.include_router(workflow.router)
app.include_router(transactions.router)
app.include_router(wallets.router)
app.include_router(demo.router)
app.include_router(test_openai.router)


@app.get("/", tags=["Health"])
def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "docs": "/docs",
        "demo_endpoints": [
            "POST /demo/startup-plan",
            "POST /demo/logo-generation",
            "POST /demo/mvp-plan",
        ],
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
