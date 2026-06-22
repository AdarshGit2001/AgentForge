from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class WalletCreateRequest(BaseModel):
    agent_id: Optional[int] = None


class WalletSendRequest(BaseModel):
    from_agent_id: int
    to_agent_id: int
    amount_avax: float = Field(gt=0)
    description: str = ""
    service_id: Optional[int] = None
    workflow_id: Optional[int] = None


class WalletResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    agent_id: int
    address: str
    balance: float
    network: str
    created_at: datetime
    updated_at: datetime


class WalletListResponse(BaseModel):
    wallets: list[WalletResponse]
    total: int


class WalletCreateResponse(BaseModel):
    wallet: WalletResponse
    message: str = "Wallet created successfully"
