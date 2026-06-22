import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models import Agent
from app.schemas.agent import AgentCreate, AgentListResponse, AgentResponse, AgentUpdate, ServiceSummary
from app.services.wallet_service import WalletService
from app.utils.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/agents", tags=["Agents"])


def _to_agent_response(agent: Agent) -> AgentResponse:
    services = [
        ServiceSummary(
            id=s.id,
            name=s.name,
            price_avax=s.price_avax,
            category=s.category,
            description=s.description,
        )
        for s in agent.services
    ]
    return AgentResponse(
        id=agent.id,
        agent_uuid=agent.agent_uuid,
        name=agent.name,
        role=agent.role,
        wallet_address=agent.wallet_address,
        balance=agent.balance,
        reputation_score=agent.reputation_score,
        description=agent.description,
        services=services,
        created_at=agent.created_at,
        updated_at=agent.updated_at,
    )


@router.get("", response_model=AgentListResponse)
def list_agents(db: Session = Depends(get_db)):
    logger.info("API: GET /agents")
    agents = db.query(Agent).order_by(Agent.id).all()
    return AgentListResponse(
        agents=[_to_agent_response(a) for a in agents],
        total=len(agents),
    )


@router.get("/{agent_id}", response_model=AgentResponse)
def get_agent(agent_id: int, db: Session = Depends(get_db)):
    logger.info("API: GET /agents/%s", agent_id)
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    return _to_agent_response(agent)


@router.post("", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
def create_agent(payload: AgentCreate, db: Session = Depends(get_db)):
    logger.info("API: POST /agents name=%s", payload.name)
    wallet_service = WalletService(db)
    wallet_info = wallet_service.create_wallet()

    agent = Agent(
        agent_uuid=str(uuid.uuid4()),
        name=payload.name,
        role=payload.role,
        description=payload.description,
        wallet_address=wallet_info["address"],
        balance=0.0,
        reputation_score=0,
    )
    db.add(agent)
    db.commit()
    db.refresh(agent)

    from app.models import Wallet

    wallet = Wallet(
        agent_id=agent.id,
        address=wallet_info["address"],
        private_key=wallet_info["private_key"],
        balance=0.0,
    )
    db.add(wallet)
    db.commit()
    db.refresh(agent)
    return _to_agent_response(agent)


@router.put("/{agent_id}", response_model=AgentResponse)
def update_agent(agent_id: int, payload: AgentUpdate, db: Session = Depends(get_db)):
    logger.info("API: PUT /agents/%s", agent_id)
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(agent, field, value)

    db.commit()
    db.refresh(agent)
    return _to_agent_response(agent)


@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_agent(agent_id: int, db: Session = Depends(get_db)):
    logger.info("API: DELETE /agents/%s", agent_id)
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    db.delete(agent)
    db.commit()
    return None
