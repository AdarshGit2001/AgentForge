import json
import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from sqlalchemy.orm import Session

from app.agents.design import DesignAgent
from app.agents.developer import DeveloperAgent
from app.agents.manager import ManagerAgent
from app.agents.research import ResearchAgent
from app.models import Agent, AgentExecution, UserRequest, Workflow
from app.services.reputation_service import ReputationService
from app.services.wallet_service import WalletService
from app.utils.logging import get_logger

logger = get_logger(__name__)


class WorkflowEngine:
    AGENT_MAP = {
        "manager": ManagerAgent,
        "research": ResearchAgent,
        "design": DesignAgent,
        "developer": DeveloperAgent,
    }

    def __init__(self, db: Session):
        self.db = db
        self.wallet_service = WalletService(db)
        self.reputation_service = ReputationService(db)

    def create_user_request(
        self,
        prompt: str,
        request_type: str = "startup_plan",
    ) -> UserRequest:
        user_request = UserRequest(
            request_uuid=str(uuid.uuid4()),
            prompt=prompt,
            request_type=request_type,
            status="pending",
        )
        self.db.add(user_request)
        self.db.commit()
        self.db.refresh(user_request)
        return user_request

    def create_workflow(self, user_request: UserRequest) -> Workflow:
        workflow = Workflow(
            workflow_uuid=str(uuid.uuid4()),
            user_request_id=user_request.id,
            status="pending",
            current_agent="manager",
            outputs=json.dumps({}),
            payments=json.dumps([]),
        )
        self.db.add(workflow)
        self.db.commit()
        self.db.refresh(workflow)
        logger.info("Workflow created: %s (id=%s)", workflow.workflow_uuid, workflow.id)
        return workflow

    async def run_workflow(
        self,
        prompt: str,
        request_type: str = "startup_plan",
        extra_context: Optional[dict[str, Any]] = None,
    ) -> dict[str, Any]:
        user_request = self.create_user_request(prompt, request_type)
        workflow = self.create_workflow(user_request)

        workflow.status = "running"
        self.db.commit()

        context: dict[str, Any] = {
            "prompt": prompt,
            "request_type": request_type,
            "workflow_id": workflow.id,
            **(extra_context or {}),
        }

        outputs: dict[str, Any] = {}
        payments: list[dict[str, Any]] = []
        total_cost = 0.0

        try:
            manager = ManagerAgent(self.db)
            manager_result = await manager.execute(context)
            outputs["manager"] = manager_result

            manager_agent = self.db.query(Agent).filter(Agent.role == "manager").first()
            if not manager_agent:
                raise ValueError("Manager agent not found")

            for service_item in manager_result["selected_services"]:
                role = service_item["agent_role"]
                workflow.current_agent = role
                self.db.commit()

                agent_class = self.AGENT_MAP.get(role)
                if not agent_class:
                    continue

                agent_instance = agent_class(self.db)
                service_context = {
                    **context,
                    "service_name": service_item["service_name"],
                }

                execution = AgentExecution(
                    workflow_id=workflow.id,
                    agent_id=service_item["agent_id"],
                    service_id=service_item["service_id"],
                    status="running",
                    input_data=json.dumps(service_context),
                )
                self.db.add(execution)
                self.db.commit()
                self.db.refresh(execution)

                try:
                    payment = self.wallet_service.send_payment(
                        from_agent_id=manager_agent.id,
                        to_agent_id=service_item["agent_id"],
                        amount_avax=service_item["price_avax"],
                        description=f"Payment for {service_item['service_name']}",
                        service_id=service_item["service_id"],
                        workflow_id=workflow.id,
                    )

                    payment_record = {
                        "tx_hash": payment.tx_hash,
                        "from_agent_id": payment.from_agent_id,
                        "to_agent_id": payment.to_agent_id,
                        "service_name": service_item["service_name"],
                        "amount_avax": payment.amount_avax,
                        "status": payment.status,
                    }
                    payments.append(payment_record)
                    total_cost += payment.amount_avax

                    logger.info(
                        "Workflow %s: payment %s AVAX to %s for %s",
                        workflow.workflow_uuid,
                        payment.amount_avax,
                        service_item["agent_name"],
                        service_item["service_name"],
                    )

                    result = await agent_instance.execute(service_context)
                    outputs[role] = outputs.get(role, [])
                    if isinstance(outputs[role], list):
                        outputs[role].append(result)
                    else:
                        outputs[role] = [result]

                    execution.status = "completed"
                    execution.output_data = json.dumps(result)
                    execution.payment_tx_hash = payment.tx_hash
                    execution.completed_at = datetime.now(timezone.utc)

                    self.reputation_service.record_success(
                        service_item["agent_id"],
                        f"Completed {service_item['service_name']}",
                    )

                except Exception as exc:
                    execution.status = "failed"
                    execution.output_data = json.dumps({"error": str(exc)})
                    execution.completed_at = datetime.now(timezone.utc)
                    self.reputation_service.record_failure(
                        service_item["agent_id"],
                        f"Failed {service_item['service_name']}: {exc}",
                    )
                    logger.error(
                        "Workflow %s: service execution failed for %s: %s",
                        workflow.workflow_uuid,
                        service_item["service_name"],
                        exc,
                    )
                    raise

                self.db.commit()

            workflow.status = "completed"
            workflow.current_agent = "completed"
            workflow.total_cost_avax = total_cost
            workflow.outputs = json.dumps(outputs)
            workflow.payments = json.dumps(payments)
            workflow.end_time = datetime.now(timezone.utc)

            user_request.status = "completed"
            user_request.result = json.dumps(
                {
                    "outputs": outputs,
                    "payments": payments,
                    "total_cost_avax": total_cost,
                }
            )
            user_request.completed_at = datetime.now(timezone.utc)
            self.db.commit()

            logger.info(
                "Workflow %s completed | cost=%s AVAX | payments=%s",
                workflow.workflow_uuid,
                total_cost,
                len(payments),
            )

            return {
                "workflow_id": workflow.id,
                "workflow_uuid": workflow.workflow_uuid,
                "status": workflow.status,
                "total_cost_avax": total_cost,
                "payments": payments,
                "outputs": outputs,
                "result": json.loads(user_request.result),
            }

        except Exception as exc:
            workflow.status = "failed"
            workflow.error_message = str(exc)
            workflow.end_time = datetime.now(timezone.utc)
            workflow.outputs = json.dumps(outputs)
            workflow.payments = json.dumps(payments)
            workflow.total_cost_avax = total_cost

            user_request.status = "failed"
            user_request.result = json.dumps({"error": str(exc), "outputs": outputs})
            self.db.commit()

            logger.error("Workflow %s failed: %s", workflow.workflow_uuid, exc)
            raise

    def get_workflow(self, workflow_id: int) -> Workflow | None:
        return self.db.query(Workflow).filter(Workflow.id == workflow_id).first()
