from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models import Transaction
from app.schemas.transaction import TransactionListResponse, TransactionResponse
from app.utils.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("", response_model=TransactionListResponse)
def list_transactions(db: Session = Depends(get_db)):
    logger.info("API: GET /transactions")
    transactions = db.query(Transaction).order_by(Transaction.created_at.desc()).all()
    return TransactionListResponse(
        transactions=[TransactionResponse.model_validate(t) for t in transactions],
        total=len(transactions),
    )


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    logger.info("API: GET /transactions/%s", transaction_id)
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
    return TransactionResponse.model_validate(transaction)
