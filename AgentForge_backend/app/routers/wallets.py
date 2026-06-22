from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models import Wallet
from app.schemas.transaction import TransactionResponse
from app.schemas.wallet import (
    WalletCreateRequest,
    WalletCreateResponse,
    WalletListResponse,
    WalletResponse,
    WalletSendRequest,
)
from app.services.wallet_service import WalletService
from app.utils.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/wallets", tags=["Wallets"])


@router.get("", response_model=WalletListResponse)
def list_wallets(db: Session = Depends(get_db)):
    logger.info("API: GET /wallets")
    wallets = db.query(Wallet).order_by(Wallet.id).all()
    return WalletListResponse(
        wallets=[WalletResponse.model_validate(w) for w in wallets],
        total=len(wallets),
    )


@router.get("/{wallet_id}", response_model=WalletResponse)
def get_wallet(wallet_id: int, db: Session = Depends(get_db)):
    logger.info("API: GET /wallets/%s", wallet_id)
    wallet = db.query(Wallet).filter(Wallet.id == wallet_id).first()
    if not wallet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wallet not found")

    wallet_service = WalletService(db)
    wallet.balance = wallet_service.get_balance(wallet_id)
    return WalletResponse.model_validate(wallet)


@router.post("/create", response_model=WalletCreateResponse, status_code=status.HTTP_201_CREATED)
def create_wallet(payload: WalletCreateRequest, db: Session = Depends(get_db)):
    logger.info("API: POST /wallets/create agent_id=%s", payload.agent_id)
    wallet_service = WalletService(db)
    try:
        result = wallet_service.create_wallet(agent_id=payload.agent_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    wallet = db.query(Wallet).filter(Wallet.id == result["wallet_id"]).first()
    return WalletCreateResponse(wallet=WalletResponse.model_validate(wallet))


@router.post("/send", response_model=TransactionResponse)
def send_payment(payload: WalletSendRequest, db: Session = Depends(get_db)):
    logger.info(
        "API: POST /wallets/send from=%s to=%s amount=%s",
        payload.from_agent_id,
        payload.to_agent_id,
        payload.amount_avax,
    )
    wallet_service = WalletService(db)
    try:
        transaction = wallet_service.send_payment(
            from_agent_id=payload.from_agent_id,
            to_agent_id=payload.to_agent_id,
            amount_avax=payload.amount_avax,
            description=payload.description,
            service_id=payload.service_id,
            workflow_id=payload.workflow_id,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return TransactionResponse.model_validate(transaction)
