from typing import Any, Optional

from pydantic import BaseModel, Field


class DemoStartupPlanRequest(BaseModel):
    prompt: str = Field(
        default="Build a startup plan for an AI tutoring app",
        min_length=3,
    )


class DemoLogoGenerationRequest(BaseModel):
    company_name: str = Field(default="AgentForge", min_length=1)
    industry: str = Field(default="AI Agents")


class DemoMvpPlanRequest(BaseModel):
    product_name: str = Field(default="AgentForge MVP", min_length=1)
    description: str = Field(default="Autonomous agent economy platform")


class DemoResponse(BaseModel):
    success: bool
    workflow_id: int
    workflow_uuid: str
    total_cost_avax: float
    payments: list[dict[str, Any]]
    result: dict[str, Any]
    message: str
