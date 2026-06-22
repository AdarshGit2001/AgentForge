from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "AgentForge"
    app_version: str = "1.0.0"
    debug: bool = True

    database_url: str = "sqlite:///./agentforge.db"

    openai_api_key: str = ""
    openai_base_url: str = "https://api.openai.com/v1"
    openai_model: str = "gpt-4o-mini"

    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    
    avalanche_rpc_url: str = "https://api.avax-test.network/ext/bc/C/rpc"
    avalanche_chain_id: int = 43113
    mock_blockchain: bool = False

    manager_initial_balance: float = 1.0
    agent_initial_balance: float = 0.0


@lru_cache
def get_settings() -> Settings:
    return Settings()
