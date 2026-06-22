from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field


class WorkflowStartRequest(BaseModel):
    prompt: str = Field(min_length=3)
    request_type: str = "startup_plan"


class AgentExecutionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    agent_id: int
    service_id: Optional[int] = None
    status: str
    output_data: str = ""
    payment_tx_hash: str = ""
    started_at: datetime
    completed_at: Optional[datetime] = None


class WorkflowResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    workflow_uuid: str
    status: str
    current_agent: str
    total_cost_avax: float
    outputs: str
    payments: str
    error_message: str = ""
    start_time: datetime
    end_time: Optional[datetime] = None
    executions: list[AgentExecutionResponse] = Field(default_factory=list)


class WorkflowStartResponse(BaseModel):
    workflow_id: int
    workflow_uuid: str
    status: str
    message: str
    result: Optional[dict[str, Any]] = None
