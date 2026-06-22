from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class AgentBase(BaseModel):
    name: str
    role: str
    description: str = ""


class AgentCreate(AgentBase):
    pass


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    description: Optional[str] = None
    reputation_score: Optional[int] = None


class ServiceSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    price_avax: float
    category: str
    description: str = ""


class AgentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    agent_uuid: str
    name: str
    role: str
    wallet_address: Optional[str] = None
    balance: float
    reputation_score: int
    description: str = ""
    services: list[ServiceSummary] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class AgentListResponse(BaseModel):
    agents: list[AgentResponse]
    total: int
