from datetime import datetime, timezone
from typing import Any, Optional

from sqlalchemy.orm import Session

from app.models import Agent, Transaction, Wallet
from app.utils.logging import get_logger
from app.config import get_settings
from app.wallet.avalanche import MockAvalancheProvider, get_blockchain_provider

logger = get_logger(__name__)


class WalletService:
    def __init__(self, db: Session):
        self.db = db
        self.provider = get_blockchain_provider()

    def create_wallet(self, agent_id: Optional[int] = None) -> dict[str, Any]:
        wallet_info = self.provider.create_wallet()

        if agent_id is not None:
            agent = self.db.query(Agent).filter(Agent.id == agent_id).first()
            if not agent:
                raise ValueError(f"Agent {agent_id} not found")

            existing = self.db.query(Wallet).filter(Wallet.agent_id == agent_id).first()
            if existing:
                raise ValueError(f"Agent {agent_id} already has a wallet")

            wallet = Wallet(
                agent_id=agent_id,
                address=wallet_info["address"],
                private_key=wallet_info["private_key"],
                balance=0.0,
                network="avalanche-fuji",
            )
            agent.wallet_address = wallet_info["address"]
            self.db.add(wallet)
            self.db.commit()
            self.db.refresh(wallet)
            logger.info("Wallet created for agent %s: %s", agent_id, wallet.address)
            return {
                "wallet_id": wallet.id,
                "address": wallet.address,
                "private_key": wallet.private_key,
                "balance": wallet.balance,
                "agent_id": agent_id,
            }

        return wallet_info

    def get_balance(self, wallet_id: int) -> float:
        wallet = self.db.query(Wallet).filter(Wallet.id == wallet_id).first()
        if not wallet:
            raise ValueError(f"Wallet {wallet_id} not found")

        on_chain_balance = self.provider.get_balance(wallet.address)
        wallet.balance = on_chain_balance
        agent = self.db.query(Agent).filter(Agent.id == wallet.agent_id).first()
        if agent:
            agent.balance = on_chain_balance
        self.db.commit()
        return on_chain_balance

    def send_payment(
        self,
        from_agent_id: int,
        to_agent_id: int,
        amount_avax: float,
        description: str = "",
        service_id: Optional[int] = None,
        workflow_id: Optional[int] = None,
    ) -> Transaction:
        from_agent = self.db.query(Agent).filter(Agent.id == from_agent_id).first()
        to_agent = self.db.query(Agent).filter(Agent.id == to_agent_id).first()

        if not from_agent or not to_agent:
            raise ValueError("Invalid sender or recipient agent")

        from_wallet = self.db.query(Wallet).filter(Wallet.agent_id == from_agent_id).first()
        to_wallet = self.db.query(Wallet).filter(Wallet.agent_id == to_agent_id).first()

        if not from_wallet or not to_wallet:
            raise ValueError("Both agents must have wallets")

        if from_agent.balance < amount_avax:
            raise ValueError(
                f"Insufficient balance: {from_agent.balance} AVAX, required {amount_avax} AVAX"
            )

        if get_settings().mock_blockchain and isinstance(self.provider, MockAvalancheProvider):
            self.provider._mock_balances[from_wallet.address] = from_agent.balance
            self.provider._mock_balances[to_wallet.address] = to_agent.balance

        tx_result = self.provider.send_payment(
            from_private_key=from_wallet.private_key,
            to_address=to_wallet.address,
            amount_avax=amount_avax,
        )

        from_agent.balance -= amount_avax
        to_agent.balance += amount_avax
        from_wallet.balance = from_agent.balance
        to_wallet.balance = to_agent.balance

        transaction = Transaction(
            tx_hash=tx_result["tx_hash"],
            from_agent_id=from_agent_id,
            to_agent_id=to_agent_id,
            wallet_id=from_wallet.id,
            service_id=service_id,
            workflow_id=workflow_id,
            amount_avax=amount_avax,
            status=tx_result.get("status", "completed"),
            description=description,
        )
        self.db.add(transaction)
        self.db.commit()
        self.db.refresh(transaction)

        logger.info(
            "Payment recorded: agent %s -> agent %s | %s AVAX | tx=%s",
            from_agent_id,
            to_agent_id,
            amount_avax,
            transaction.tx_hash,
        )
        return transaction

    def get_transaction_history(self, wallet_id: int) -> list[dict[str, Any]]:
        wallet = self.db.query(Wallet).filter(Wallet.id == wallet_id).first()
        if not wallet:
            raise ValueError(f"Wallet {wallet_id} not found")

        db_transactions = (
            self.db.query(Transaction)
            .filter(
                (Transaction.from_agent_id == wallet.agent_id)
                | (Transaction.to_agent_id == wallet.agent_id)
            )
            .order_by(Transaction.created_at.desc())
            .all()
        )

        history = [
            {
                "tx_hash": tx.tx_hash,
                "from_agent_id": tx.from_agent_id,
                "to_agent_id": tx.to_agent_id,
                "amount_avax": tx.amount_avax,
                "status": tx.status,
                "description": tx.description,
                "created_at": tx.created_at.isoformat(),
            }
            for tx in db_transactions
        ]

        on_chain = self.provider.get_transaction_history(wallet.address)
        if on_chain:
            history.extend(on_chain)

        return history
