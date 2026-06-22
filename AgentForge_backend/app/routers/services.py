from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models import Agent, Service
from app.schemas.service import ServiceCreate, ServiceListResponse, ServiceResponse
from app.utils.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/services", tags=["Services"])


@router.get("", response_model=ServiceListResponse)
def list_services(db: Session = Depends(get_db)):
    logger.info("API: GET /services")
    services = db.query(Service).filter(Service.is_active == 1).order_by(Service.id).all()
    return ServiceListResponse(
        services=[ServiceResponse.model_validate(s) for s in services],
        total=len(services),
    )


@router.post("", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(payload: ServiceCreate, db: Session = Depends(get_db)):
    logger.info("API: POST /services name=%s", payload.name)
    agent = db.query(Agent).filter(Agent.id == payload.agent_id).first()
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    service = Service(
        name=payload.name,
        description=payload.description,
        price_avax=payload.price_avax,
        agent_id=payload.agent_id,
        category=payload.category,
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return ServiceResponse.model_validate(service)
