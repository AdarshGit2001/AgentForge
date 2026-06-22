# AgentForge Backend

Autonomous AI agent economy backend for the **Avalanche Agentic Payments Speedrun**. AgentForge orchestrates four specialized agents that buy and sell services using AVAX payments on Avalanche Fuji testnet.

## Features

- **4 AI Agents**: Manager, Research, Design, Developer
- **Agent Economy**: Service catalog with AVAX pricing
- **x402-inspired Payments**: Manager pays agents autonomously for services
- **Avalanche Integration**: Web3.py wallet layer with mock mode for offline demo
- **LangGraph Orchestration**: Multi-agent workflow pipeline
- **Reputation System**: +/- reputation on service success/failure
- **Complete REST API**: Agents, services, workflows, transactions, wallets, demos

## Tech Stack

- Python 3.12+
- FastAPI + Uvicorn
- LangGraph
- SQLAlchemy + SQLite
- Web3.py
- Pydantic

## Quick Start

```bash
# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux

# 4. Start server
uvicorn app.main:app --reload
```

Open **http://127.0.0.1:8000/docs** for interactive API documentation.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./agentforge.db` | SQLite database path |
| `OPENAI_API_KEY` | empty | Optional OpenAI key (mock used if empty) |
| `MOCK_BLOCKCHAIN` | `true` | Use mock Avalanche provider |
| `AVALANCHE_RPC_URL` | Fuji testnet RPC | Real chain RPC when mock disabled |
| `MANAGER_INITIAL_BALANCE` | `1.0` | Starting AVAX for Manager Agent |

## Project Structure

```
app/
├── agents/          # Manager, Research, Design, Developer agents
├── services/        # AI, wallet, reputation services
├── database/        # SQLAlchemy session and seed data
├── routers/         # FastAPI route handlers
├── models/          # SQLAlchemy ORM models
├── schemas/         # Pydantic request/response schemas
├── wallet/          # Avalanche Web3 abstraction layer
├── workflow/        # Workflow engine + LangGraph graph
├── utils/           # Logging utilities
└── main.py          # FastAPI application entry point
tests/
requirements.txt
.env.example
```

## Agent Services & Pricing

| Agent | Service | Price (AVAX) |
|-------|---------|--------------|
| Research | Basic Market Research | 0.01 |
| Research | Startup Research | 0.03 |
| Research | Competitor Analysis | 0.05 |
| Design | Logo Design | 0.02 |
| Design | Branding Package | 0.05 |
| Developer | Landing Page Plan | 0.03 |
| Developer | MVP Architecture | 0.06 |

## API Endpoints

### Health
- `GET /` — API info
- `GET /health` — Health check

### Agents
- `GET /agents` — List all agents
- `GET /agents/{id}` — Get agent by ID
- `POST /agents` — Create agent
- `PUT /agents/{id}` — Update agent
- `DELETE /agents/{id}` — Delete agent

### Services
- `GET /services` — List service catalog
- `POST /services` — Add service

### Workflow
- `POST /workflow/start` — Start LangGraph workflow
- `GET /workflow/{id}` — Get workflow status and outputs

### Transactions
- `GET /transactions` — List all payments
- `GET /transactions/{id}` — Get transaction details

### Wallets
- `GET /wallets` — List agent wallets
- `GET /wallets/{id}` — Get wallet details
- `POST /wallets/create` — Create wallet for agent
- `POST /wallets/send` — Send AVAX payment between agents

### Demo (Hackathon Showcase)
- `POST /demo/startup-plan` — Full startup plan workflow
- `POST /demo/logo-generation` — Logo design workflow
- `POST /demo/mvp-plan` — MVP architecture workflow

## Sample API Requests

### Demo: Startup Plan

```bash
curl -X POST http://127.0.0.1:8000/demo/startup-plan \
  -H "Content-Type: application/json" \
  -d "{\"prompt\": \"Build a startup plan for an AI tutoring app\"}"
```

**Sample Response:**

```json
{
  "success": true,
  "workflow_id": 1,
  "workflow_uuid": "a1b2c3d4-...",
  "total_cost_avax": 0.14,
  "payments": [
    {
      "tx_hash": "0xmock...",
      "from_agent_id": 1,
      "to_agent_id": 2,
      "service_name": "Startup Research",
      "amount_avax": 0.03,
      "status": "confirmed"
    }
  ],
  "result": {
    "outputs": { "...": "..." },
    "payments": [ "..." ],
    "total_cost_avax": 0.14
  },
  "message": "Startup plan workflow completed with autonomous agent payments"
}
```

### List Agents

```bash
curl http://127.0.0.1:8000/agents
```

### Send Payment

```bash
curl -X POST http://127.0.0.1:8000/wallets/send \
  -H "Content-Type: application/json" \
  -d "{\"from_agent_id\": 1, \"to_agent_id\": 2, \"amount_avax\": 0.01, \"description\": \"Research payment\"}"
```

### Start Workflow

```bash
curl -X POST http://127.0.0.1:8000/workflow/start \
  -H "Content-Type: application/json" \
  -d "{\"prompt\": \"Build an AI agent marketplace\", \"request_type\": \"startup_plan\"}"
```

## Payment Flow

```
User Request
    ↓
Manager Agent (analyzes task, selects services)
    ↓
Manager pays Research Agent → receives research output
    ↓
Manager pays Design Agent → receives branding output
    ↓
Manager pays Developer Agent → receives MVP plan
    ↓
Aggregated result returned to user
```

Every payment is recorded in the `transactions` table with tx hash, amount, and service reference.

## Running Tests

```bash
pytest tests/ -v
```

## Avalanche Real Integration

Set in `.env`:

```
MOCK_BLOCKCHAIN=false
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
```

Fund Manager Agent wallet with Fuji testnet AVAX before running workflows.

## License

MIT — Built for Avalanche Agentic Payments Speedrun hackathon.
