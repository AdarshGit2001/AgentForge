from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ServiceBase(BaseModel):
    name: str
    description: str = ""
    price_avax: float
    agent_id: int
    category: str = "general"


class ServiceCreate(ServiceBase):
    pass


class ServiceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    price_avax: float
    agent_id: int
    category: str
    is_active: int
    created_at: datetime


class ServiceListResponse(BaseModel):
    services: list[ServiceResponse]
    total: int
