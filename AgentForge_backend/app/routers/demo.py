from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.demo import (
    DemoLogoGenerationRequest,
    DemoMvpPlanRequest,
    DemoResponse,
    DemoStartupPlanRequest,
)
from app.utils.logging import get_logger
from app.workflow.engine import WorkflowEngine

logger = get_logger(__name__)
router = APIRouter(prefix="/demo", tags=["Demo"])


@router.post("/startup-plan", response_model=DemoResponse)
async def demo_startup_plan(payload: DemoStartupPlanRequest, db: Session = Depends(get_db)):
    logger.info("API: POST /demo/startup-plan")
    engine = WorkflowEngine(db)
    try:
        result = await engine.run_workflow(
            prompt=payload.prompt,
            request_type="startup_plan",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

    return DemoResponse(
        success=True,
        workflow_id=result["workflow_id"],
        workflow_uuid=result["workflow_uuid"],
        total_cost_avax=result["total_cost_avax"],
        payments=result["payments"],
        result=result["result"],
        message="Startup plan workflow completed with autonomous agent payments",
    )


@router.post("/logo-generation", response_model=DemoResponse)
async def demo_logo_generation(payload: DemoLogoGenerationRequest, db: Session = Depends(get_db)):
    logger.info("API: POST /demo/logo-generation")
    engine = WorkflowEngine(db)
    try:
        result = await engine.run_workflow(
            prompt=f"Logo for {payload.company_name} in {payload.industry}",
            request_type="logo_generation",
            extra_context={
                "company_name": payload.company_name,
                "industry": payload.industry,
            },
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

    return DemoResponse(
        success=True,
        workflow_id=result["workflow_id"],
        workflow_uuid=result["workflow_uuid"],
        total_cost_avax=result["total_cost_avax"],
        payments=result["payments"],
        result=result["result"],
        message="Logo generation workflow completed with autonomous agent payments",
    )


@router.post("/mvp-plan", response_model=DemoResponse)
async def demo_mvp_plan(payload: DemoMvpPlanRequest, db: Session = Depends(get_db)):
    logger.info("API: POST /demo/mvp-plan")
    engine = WorkflowEngine(db)
    try:
        result = await engine.run_workflow(
            prompt=payload.description,
            request_type="mvp_plan",
            extra_context={
                "product_name": payload.product_name,
                "description": payload.description,
            },
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

    return DemoResponse(
        success=True,
        workflow_id=result["workflow_id"],
        workflow_uuid=result["workflow_uuid"],
        total_cost_avax=result["total_cost_avax"],
        payments=result["payments"],
        result=result["result"],
        message="MVP plan workflow completed with autonomous agent payments",
    )
