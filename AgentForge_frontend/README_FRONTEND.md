PROJECT CONTEXT

Project Name: AgentForge

AgentForge is an autonomous AI agent economy built for the Avalanche Agentic Payments Speedrun.

Backend Status:
- FastAPI backend already exists.
- Backend runs on localhost:8000.
- Swagger docs are available.
- APIs exist for:
  /agents
  /services
  /transactions
  /wallets
  /workflow
  /demo/startup-plan

Agents:
1. Manager Agent
2. Research Agent
3. Design Agent
4. Developer Agent

Workflow:
User submits a goal.

Manager Agent:
- hires Research Agent
- pays Research Agent

Research Agent:
- returns research

Manager Agent:
- hires Design Agent
- pays Design Agent

Design Agent:
- returns branding

Manager Agent:
- hires Developer Agent
- pays Developer Agent

Developer Agent:
- returns MVP plan

Current blockchain state:
- Avalanche Fuji Testnet support exists.
- MOCK_BLOCKCHAIN=true currently.
- Frontend should still be designed as if payments are occurring on Avalanche.

Main objective:
Create the most visually impressive hackathon demo possible.

You are a world-class senior frontend engineer, product designer, and motion designer.

Build the COMPLETE frontend for AgentForge.

# Project

AgentForge

AgentForge is an autonomous AI agent economy running on Avalanche Fuji Testnet.

The frontend should feel like a premium startup product.

The design quality should be comparable to:

* Stripe Dashboard
* Linear
* Vercel
* Arc Browser
* Coinbase Wallet
* Raycast

NOT a typical admin dashboard.

# Goal

Create a visually stunning hackathon demo.

When judges open the website they should immediately understand:

"AI agents are autonomously buying and selling services."

The frontend should maximize demo impact.

# Tech Stack

Use:

* Next.js 15+
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* Lucide Icons
* React Query
* Axios

# Design Language

Use:

* Modern glassmorphism
* Soft gradients
* Rounded corners everywhere
* Large spacing
* Premium typography
* Smooth animations
* Beautiful shadows
* Subtle blur effects
* Professional fintech feel

Border radius:

* cards: 24px
* buttons: 16px
* panels: 28px

No sharp edges.

No bootstrap style UI.

No boring tables.

# Theme

Dark Mode only.

Primary Background:

Near black.

Cards:

Dark charcoal.

Accent Colors:

* Electric Blue
* Violet
* Emerald
* Cyan

Use gradients heavily.

# Branding

Project Name:

AgentForge

Tagline:

The Autonomous Agent Economy

Hero Description:

AI agents discover services, negotiate value, and execute payments on Avalanche without human intervention.

# Pages

Create:

1. Landing Page
2. Dashboard Page

# Landing Page

Create a premium landing page.

Sections:

Hero

Features

How It Works

Agent Economy Visualization

Technology Stack

Call To Action

Footer

Hero should include:

Animated headline

"AI Agents That Hire, Pay, and Work Together"

Animated background.

Floating wallet cards.

Animated transaction lines.

Live moving particles.

# Dashboard

This is the main demo screen.

Layout:

Top Navbar

Left Sidebar

Main Workflow Area

Right Activity Panel

# Navbar

Show:

AgentForge Logo

Network Status

Fuji Testnet Badge

Wallet Status

Theme Indicator

# Sidebar

Items:

Overview

Agents

Transactions

Wallets

Workflow

Settings

Beautiful icons.

Animated hover states.

# Main Dashboard

Create a command center.

Top section:

Task Input Card

Example:

Build a startup plan for an AI Tutor App

Button:

Launch Agent Workflow

# Agent Workflow Visualization

This is the most important section.

Display:

Manager Agent

↓

Research Agent

↓

Design Agent

↓

Developer Agent

Each agent should be represented as a premium card.

Show:

Agent Name

Role

Wallet Balance

Reputation Score

Status

Avatar

When active:

Animate glowing border.

Pulse effect.

Progress animation.

# Payment Flow Visualization

Show animated payment transfers.

Example:

Manager Agent

→ 0.03 AVAX

Research Agent

Use animated particles moving between cards.

Show transaction confirmations.

# Wallet Section

Display:

Manager Wallet

Research Wallet

Design Wallet

Developer Wallet

Show:

Address

Balance

Transaction Count

Use beautiful wallet cards.

# Transaction Feed

Live transaction stream.

Example:

Manager paid Research Agent

0.03 AVAX

Completed

Show:

Time

Status

Hash

Use premium activity cards.

No tables.

# Analytics Section

Create beautiful metric cards.

Metrics:

Total Transactions

Services Purchased

Agent Reputation

Workflow Success Rate

Volume Transacted

Use charts.

Use animated counters.

# Workflow Timeline

Create an interactive timeline.

Step 1

Manager Agent Received Task

Step 2

Research Agent Hired

Step 3

Payment Executed

Step 4

Research Delivered

Step 5

Design Hired

Step 6

Final Output Generated

# Backend Integration

Connect to backend:

http://localhost:8000

Use APIs:

/agents

/services

/transactions

/workflow

/wallets

/demo/startup-plan

Use React Query.

Create proper API layer.

Create loading states.

Create error states.

# Animations

Use Framer Motion everywhere.

Required:

Page transitions

Card hover effects

Wallet animations

Workflow animations

Payment animations

Metric counter animations

Sidebar transitions

Loading skeletons

# Responsiveness

Fully responsive.

Desktop first.

Tablet support.

Mobile support.

# Folder Structure

Generate complete frontend architecture.

Include:

app/

components/

hooks/

lib/

services/

types/

animations/

styles/

# Deliverables

Generate:

package.json

tailwind config

all pages

all components

all API services

all hooks

all animations

all styles

all layouts

all utilities

Generate complete working code.

Do not leave TODOs.

Do not use placeholder UI.

Make it look like a product that could win a hackathon demo.
