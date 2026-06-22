from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class TransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tx_hash: str
    from_agent_id: int
    to_agent_id: int
    wallet_id: Optional[int] = None
    service_id: Optional[int] = None
    workflow_id: Optional[int] = None
    amount_avax: float
    status: str
    description: str
    created_at: datetime


class TransactionListResponse(BaseModel):
    transactions: list[TransactionResponse]
    total: int
