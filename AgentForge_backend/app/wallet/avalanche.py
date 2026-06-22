"""Avalanche Fuji testnet wallet abstraction layer."""

from abc import ABC, abstractmethod
from typing import Any

from app.config import get_settings
from app.utils.logging import get_logger

logger = get_logger(__name__)


class BlockchainProvider(ABC):
    @abstractmethod
    def create_wallet(self) -> dict[str, str]:
        pass

    @abstractmethod
    def get_balance(self, address: str) -> float:
        pass

    @abstractmethod
    def send_payment(
        self,
        from_private_key: str,
        to_address: str,
        amount_avax: float,
    ) -> dict[str, Any]:
        pass

    @abstractmethod
    def get_transaction_history(self, address: str) -> list[dict[str, Any]]:
        pass


class MockAvalancheProvider(BlockchainProvider):
    """In-memory mock provider for demo and offline development."""

    _mock_balances: dict[str, float] = {}
    _mock_transactions: dict[str, list[dict[str, Any]]] = {}

    def create_wallet(self) -> dict[str, str]:
        from eth_account import Account

        account = Account.create()
        address = account.address
        self._mock_balances[address] = 0.0
        self._mock_transactions[address] = []
        logger.info("Mock wallet created: %s", address)
        return {
            "address": address,
            "private_key": account.key.hex(),
        }

    def get_balance(self, address: str) -> float:
        return self._mock_balances.get(address, 0.0)

    def send_payment(
        self,
        from_private_key: str,
        to_address: str,
        amount_avax: float,
    ) -> dict[str, Any]:
        from eth_account import Account

        account = Account.from_key(from_private_key)
        from_address = account.address

        sender_balance = self._mock_balances.get(from_address, 0.0)
        if sender_balance < amount_avax:
            raise ValueError(
                f"Insufficient balance: {sender_balance} AVAX, required {amount_avax} AVAX"
            )

        tx_hash = f"0xmock{from_address[-8:]}{to_address[-8:]}{int(amount_avax * 1e6)}"

        self._mock_balances[from_address] = sender_balance - amount_avax
        self._mock_balances[to_address] = self._mock_balances.get(to_address, 0.0) + amount_avax

        tx_record = {
            "tx_hash": tx_hash,
            "from_address": from_address,
            "to_address": to_address,
            "amount_avax": amount_avax,
            "status": "confirmed",
            "network": "avalanche-fuji-mock",
        }

        self._mock_transactions.setdefault(from_address, []).append(tx_record)
        self._mock_transactions.setdefault(to_address, []).append(tx_record)

        logger.info(
            "Mock payment sent: %s -> %s (%s AVAX) tx=%s",
            from_address,
            to_address,
            amount_avax,
            tx_hash,
        )
        return tx_record

    def get_transaction_history(self, address: str) -> list[dict[str, Any]]:
        return self._mock_transactions.get(address, [])


class AvalancheProvider(BlockchainProvider):
    """Real Avalanche Fuji testnet provider using Web3.py."""

    def __init__(self) -> None:
        from web3 import Web3

        settings = get_settings()
        self.w3 = Web3(Web3.HTTPProvider(settings.avalanche_rpc_url))
        self.chain_id = settings.avalanche_chain_id

        if not self.w3.is_connected():
            raise ConnectionError(
                f"Unable to connect to Avalanche RPC: {settings.avalanche_rpc_url}"
            )

    def create_wallet(self) -> dict[str, str]:
        from eth_account import Account

        account = Account.create()
        logger.info("Avalanche wallet created: %s", account.address)
        return {
            "address": account.address,
            "private_key": account.key.hex(),
        }

    def get_balance(self, address: str) -> float:
        balance_wei = self.w3.eth.get_balance(self.w3.to_checksum_address(address))
        return float(self.w3.from_wei(balance_wei, "ether"))

    def send_payment(
        self,
        from_private_key: str,
        to_address: str,
        amount_avax: float,
    ) -> dict[str, Any]:
        from eth_account import Account

        account = Account.from_key(from_private_key)
        from_address = account.address
        to_checksum = self.w3.to_checksum_address(to_address)
        value_wei = self.w3.to_wei(amount_avax, "ether")

        nonce = self.w3.eth.get_transaction_count(from_address)
        gas_price = self.w3.eth.gas_price

        tx = {
            "nonce": nonce,
            "to": to_checksum,
            "value": value_wei,
            "gas": 21000,
            "gasPrice": gas_price,
            "chainId": self.chain_id,
        }

        signed = account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)

        tx_record = {
            "tx_hash": receipt.transactionHash.hex(),
            "from_address": from_address,
            "to_address": to_address,
            "amount_avax": amount_avax,
            "status": "confirmed" if receipt.status == 1 else "failed",
            "network": "avalanche-fuji",
        }

        logger.info(
            "Avalanche payment sent: %s -> %s (%s AVAX) tx=%s",
            from_address,
            to_address,
            amount_avax,
            tx_record["tx_hash"],
        )
        return tx_record

    def get_transaction_history(self, address: str) -> list[dict[str, Any]]:
        logger.warning(
            "Full on-chain history requires indexer; returning empty list for %s",
            address,
        )
        return []


def get_blockchain_provider():
    settings = get_settings()

    if settings.mock_blockchain:
        print("USING MOCK PROVIDER")
        return MockAvalancheProvider()

    print("TRYING REAL PROVIDER")

    return AvalancheProvider()
    