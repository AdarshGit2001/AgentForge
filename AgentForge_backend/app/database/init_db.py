import uuid

from sqlalchemy.orm import Session

from app.config import get_settings
from app.database.session import Base, SessionLocal, engine
from app.models import Agent, Service, Wallet
from app.services.wallet_service import WalletService
from app.utils.logging import get_logger

logger = get_logger(__name__)

DEFAULT_AGENTS = [
    {
        "name": "Manager Agent",
        "role": "manager",
        "description": "Orchestrates workflows, selects services, and triggers agent payments.",
        "initial_balance": get_settings().manager_initial_balance,
        "services": [],
    },
    {
        "name": "Research Agent",
        "role": "research",
        "description": "Provides market, startup, and competitor research services.",
        "initial_balance": get_settings().agent_initial_balance,
        "services": [
            ("Basic Market Research", 0.01, "research", "Basic market overview and trends."),
            ("Startup Research", 0.03, "research", "Startup viability and market fit analysis."),
            ("Competitor Analysis", 0.05, "research", "Competitive landscape and positioning."),
        ],
    },
    {
        "name": "Design Agent",
        "role": "design",
        "description": "Provides logo and branding design services.",
        "initial_balance": get_settings().agent_initial_balance,
        "services": [
            ("Logo Design", 0.02, "design", "Logo concepts and visual identity direction."),
            ("Branding Package", 0.05, "design", "Full brand guidelines and asset recommendations."),
        ],
    },
    {
        "name": "Developer Agent",
        "role": "developer",
        "description": "Provides landing page and MVP architecture planning.",
        "initial_balance": get_settings().agent_initial_balance,
        "services": [
            ("Landing Page Plan", 0.03, "development", "Landing page structure and content plan."),
            ("MVP Architecture", 0.06, "development", "Technical MVP architecture and stack plan."),
        ],
    },
]


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_default_agents(db)
    finally:
        db.close()


def seed_default_agents(db: Session) -> None:
    if db.query(Agent).count() > 0:
        logger.info("Database already initialized")
        return
    _seed_agents(db)
    logger.info("Database seeded with default agents and services")


def _seed_agents(db: Session) -> None:
    wallet_service = WalletService(db)

    for agent_data in DEFAULT_AGENTS:
        agent_uuid = str(uuid.uuid4())
        wallet_info = wallet_service.create_wallet()

        agent = Agent(
            agent_uuid=agent_uuid,
            name=agent_data["name"],
            role=agent_data["role"],
            description=agent_data["description"],
            wallet_address=wallet_info["address"],
            balance=agent_data["initial_balance"],
            reputation_score=0,
        )
        db.add(agent)
        db.flush()

        wallet = Wallet(
            agent_id=agent.id,
            address=wallet_info["address"],
            private_key=wallet_info["private_key"],
            balance=agent_data["initial_balance"],
            network="avalanche-fuji",
        )
        db.add(wallet)

        for service_name, price, category, description in agent_data["services"]:
            db.add(
                Service(
                    name=service_name,
                    price_avax=price,
                    category=category,
                    description=description,
                    agent_id=agent.id,
                )
            )

    db.commit()
