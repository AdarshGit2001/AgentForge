You are a senior blockchain, AI agent systems, and FastAPI engineer.

Build the COMPLETE backend for the following hackathon project.

# Project Name

AgentForge

# Hackathon Context

This project is for the Avalanche Agentic Payments Speedrun.

The goal is to demonstrate autonomous AI agents that can:

* Have identities
* Have wallets
* Buy services
* Sell services
* Make autonomous payments
* Interact through an agent economy
* Run on Avalanche Fuji Testnet

The backend must be designed to maximize hackathon judging criteria:

1. Value Proposition
2. Technical Complexity
3. Usage of Avalanche Technologies
4. Agentic Payments
5. Autonomous Transactions

# Tech Stack

Use:

* Python 3.12+
* FastAPI
* LangGraph
* Pydantic
* Web3.py
* Uvicorn
* SQLite (for MVP)
* SQLAlchemy

Project must be production-quality and organized.

# Main Concept

The system contains 4 AI agents:

1. Manager Agent
2. Research Agent
3. Design Agent
4. Developer Agent

Each agent has:

* Unique ID
* Name
* Wallet Address
* Balance
* Reputation Score
* Service Catalog
* Transaction History

# Agent Responsibilities

## Manager Agent

Receives user requests.

Example:

"Build a startup plan for an AI tutoring app"

Manager Agent must:

* Analyze request
* Decide required services
* Select appropriate agents
* Calculate required costs
* Trigger payments
* Collect outputs
* Return final result

## Research Agent

Services:

* Basic Market Research
* Startup Research
* Competitor Analysis

Pricing:

Basic Research = 0.01 AVAX

Startup Research = 0.03 AVAX

Competitor Analysis = 0.05 AVAX

## Design Agent

Services:

* Logo Design
* Branding Package

Pricing:

Logo Design = 0.02 AVAX

Branding Package = 0.05 AVAX

## Developer Agent

Services:

* Landing Page Plan
* MVP Architecture

Pricing:

Landing Page Plan = 0.03 AVAX

MVP Architecture = 0.06 AVAX

# Agent Economy Logic

Manager Agent must:

1. Receive task
2. Determine required services
3. Query service catalog
4. Determine price
5. Execute payment
6. Trigger target agent
7. Receive result
8. Continue workflow

# Avalanche Integration

Implement Avalanche Fuji Testnet support.

Create:

wallet_service.py

Functions:

* create_wallet()
* get_balance()
* send_payment()
* get_transaction_history()

Store:

wallet address

private key

balance

transaction hashes

Use Web3.py structure.

If real blockchain integration is difficult, create a clean abstraction layer so real Avalanche integration can be plugged in later.

# x402-inspired Payment Flow

Implement agent-to-agent payment workflow.

Flow:

Manager Agent
-> pays Research Agent
-> receives service

Manager Agent
-> pays Design Agent
-> receives service

Manager Agent
-> pays Developer Agent
-> receives service

Every transaction must be recorded.

# Reputation System

Each agent contains:

reputation_score

After successful service:

+1 reputation

After failure:

-1 reputation

Store history.

# Database Models

Create SQLAlchemy models:

Agent

Service

Wallet

Transaction

Workflow

AgentExecution

UserRequest

# APIs

Create complete REST APIs.

## Agent APIs

GET /agents

GET /agents/{id}

POST /agents

PUT /agents/{id}

DELETE /agents/{id}

## Service APIs

GET /services

POST /services

## Workflow APIs

POST /workflow/start

GET /workflow/{id}

## Transaction APIs

GET /transactions

GET /transactions/{id}

## Wallet APIs

GET /wallets

GET /wallets/{id}

POST /wallets/create

POST /wallets/send

## Demo APIs

POST /demo/startup-plan

POST /demo/logo-generation

POST /demo/mvp-plan

# LangGraph Integration

Create LangGraph orchestration.

Graph:

Manager Agent
-> Research Agent
-> Design Agent
-> Developer Agent

The graph must support:

task delegation

service execution

result aggregation

workflow tracking

# AI Layer

Create ai_service.py

Use OpenAI-compatible interface.

Environment variables:

OPENAI_API_KEY

Functions:

generate_research()

generate_branding()

generate_mvp_plan()

Use mock responses if no API key is available.

Backend must run without paid APIs.

# Workflow Engine

Implement complete workflow state tracking.

Track:

workflow_id

status

current_agent

payments

outputs

start_time

end_time

# Logging

Create centralized logging.

Log:

agent decisions

payments

workflow transitions

errors

API calls

# Folder Structure

Generate complete project structure.

Include:

app/
agents/
services/
database/
routers/
models/
schemas/
wallet/
workflow/
utils/
tests/

Generate all files.

# Requirements

Generate:

requirements.txt

.env.example

README.md

startup instructions

sample API requests

sample responses

# Important

The project must run immediately after:

pip install -r requirements.txt

uvicorn app.main:app --reload

Provide complete code for every file.

Do not leave TODOs.

Do not provide explanations.

Generate the entire backend implementation.
