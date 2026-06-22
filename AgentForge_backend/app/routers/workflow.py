import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models import AgentExecution
from app.schemas.workflow import (
    AgentExecutionResponse,
    WorkflowResponse,
    WorkflowStartRequest,
    WorkflowStartResponse,
)
from app.utils.logging import get_logger
from app.workflow.engine import WorkflowEngine
from app.workflow.graph import LangGraphOrchestrator

logger = get_logger(__name__)
router = APIRouter(prefix="/workflow", tags=["Workflow"])


def _to_workflow_response(workflow, db: Session) -> WorkflowResponse:
    executions = (
        db.query(AgentExecution)
        .filter(AgentExecution.workflow_id == workflow.id)
        .order_by(AgentExecution.id)
        .all()
    )
    return WorkflowResponse(
        id=workflow.id,
        workflow_uuid=workflow.workflow_uuid,
        status=workflow.status,
        current_agent=workflow.current_agent,
        total_cost_avax=workflow.total_cost_avax,
        outputs=workflow.outputs,
        payments=workflow.payments,
        error_message=workflow.error_message,
        start_time=workflow.start_time,
        end_time=workflow.end_time,
        executions=[AgentExecutionResponse.model_validate(e) for e in executions],
    )


@router.post("/start", response_model=WorkflowStartResponse)
async def start_workflow(payload: WorkflowStartRequest, db: Session = Depends(get_db)):
    logger.info("API: POST /workflow/start type=%s", payload.request_type)
    engine = WorkflowEngine(db)

    user_request = engine.create_user_request(payload.prompt, payload.request_type)
    workflow = engine.create_workflow(user_request)

    orchestrator = LangGraphOrchestrator(db)
    try:
        graph_result = await orchestrator.run(
            {
                "prompt": payload.prompt,
                "request_type": payload.request_type,
                "workflow_id": workflow.id,
            }
        )

        workflow.status = "completed"
        workflow.current_agent = "completed"
        workflow.total_cost_avax = graph_result.get("total_cost_avax", 0.0)
        workflow.outputs = json.dumps(
            {
                "manager": graph_result.get("manager_plan"),
                "research": graph_result.get("research_output"),
                "design": graph_result.get("design_output"),
                "developer": graph_result.get("developer_output"),
            }
        )
        workflow.payments = json.dumps(graph_result.get("payments", []))
        from datetime import datetime, timezone

        workflow.end_time = datetime.now(timezone.utc)

        user_request.status = "completed"
        user_request.result = workflow.outputs
        user_request.completed_at = workflow.end_time
        db.commit()

        return WorkflowStartResponse(
            workflow_id=workflow.id,
            workflow_uuid=workflow.workflow_uuid,
            status=workflow.status,
            message="Workflow completed successfully via LangGraph orchestration",
            result={
                "total_cost_avax": workflow.total_cost_avax,
                "payments": graph_result.get("payments", []),
                "outputs": json.loads(workflow.outputs),
            },
        )
    except Exception as exc:
        workflow.status = "failed"
        workflow.error_message = str(exc)
        user_request.status = "failed"
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Workflow failed: {exc}",
        ) from exc


@router.get("/{workflow_id}", response_model=WorkflowResponse)
def get_workflow(workflow_id: int, db: Session = Depends(get_db)):
    logger.info("API: GET /workflow/%s", workflow_id)
    engine = WorkflowEngine(db)
    workflow = engine.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found")
    return _to_workflow_response(workflow, db)
