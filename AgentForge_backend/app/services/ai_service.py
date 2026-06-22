import json
from typing import Any

import httpx

from app.config import get_settings
from app.utils.logging import get_logger

logger = get_logger(__name__)


class AIService:
    def __init__(self) -> None:
        self.settings = get_settings()

        print("GEMINI MODEL:", self.settings.gemini_model)
        print("GEMINI KEY FOUND:", self.has_gemini_key)

    @property
    def has_api_key(self) -> bool:
        return bool(self.settings.openai_api_key)
    
    @property
    def has_gemini_key(self) -> bool:
        return bool(self.settings.gemini_api_key)


    async def _call_gemini(
        self,
        system_prompt: str,
        user_prompt: str,
    ) -> str:

        url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{self.settings.gemini_model}:generateContent?key={self.settings.gemini_api_key}"
    )

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": f"{system_prompt}\n\n{user_prompt}"
                        }
                    ]
                }
            ]
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, json=payload)

            print("GEMINI STATUS:", response.status_code)
            print("GEMINI BODY:", response.text[:500])

            response.raise_for_status()

            data = response.json()

            return data["candidates"][0]["content"]["parts"][0]["text"]

    async def _call_openai(self, system_prompt: str, user_prompt: str) -> str:
        if not self.has_api_key:
            return ""

        url = f"{self.settings.openai_base_url.rstrip('/')}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.settings.openai_api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.settings.openai_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.7,
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                url,
                headers=headers,
                json=payload
            )

            print("STATUS:", response.status_code)
            print("BODY:", response.text)

            response.raise_for_status()

            data = response.json()
            return data["choices"][0]["message"]["content"]

    async def generate_research(
        self,
        prompt: str,
        service_name: str = "Startup Research",
    ) -> dict[str, Any]:
        system_prompt = (
            "You are a startup research analyst. Provide structured market research "
            "with sections: Market Overview, Target Audience, Opportunities, Risks."
        )
        user_prompt = f"Service: {service_name}\nRequest: {prompt}"

        if self.has_gemini_key:
            try:
                content = await self._call_gemini(system_prompt, user_prompt)
                logger.info("AI research generated via Gemini for service: %s", service_name)
                return {
                    "service": service_name,
                    "content": content,
                    "source": "gemini",
                }
            except Exception as exc:
                print("GEMINI ERROR:", exc)
                logger.warning("Gemini call failed, using mock research: %s", exc)

        mock_content = self._mock_research(prompt, service_name)
        logger.info("Mock research generated for service: %s", service_name)
        return {
            "service": service_name,
            "content": mock_content,
            "source": "mock",
        }

    async def generate_branding(
        self,
        company_name: str,
        industry: str,
        service_name: str = "Logo Design",
    ) -> dict[str, Any]:
        system_prompt = (
            "You are a brand designer. Provide logo concepts, color palette, "
            "typography, and brand voice recommendations."
        )
        user_prompt = (
            f"Service: {service_name}\nCompany: {company_name}\nIndustry: {industry}"
        )

        if self.has_gemini_key:
            try:
                content = await self._call_gemini(system_prompt, user_prompt)
                logger.info("AI branding generated via Gemini for: %s", company_name)
                return {
                    "service": service_name,
                    "company_name": company_name,
                    "content": content,
                    "source": "gemini",
                }
            except Exception as exc:
                print("GEMINI ERROR:", exc)
                logger.warning("Gemini call failed, using mock branding: %s", exc)

        mock_content = self._mock_branding(company_name, industry, service_name)
        logger.info("Mock branding generated for: %s", company_name)
        return {
            "service": service_name,
            "company_name": company_name,
            "content": mock_content,
            "source": "mock",
        }

    async def generate_mvp_plan(
        self,
        product_name: str,
        description: str,
        service_name: str = "MVP Architecture",
    ) -> dict[str, Any]:
        system_prompt = (
            "You are a solutions architect. Provide MVP architecture with "
            "components, tech stack, data flow, and delivery milestones."
        )
        user_prompt = (
            f"Service: {service_name}\nProduct: {product_name}\nDescription: {description}"
        )

        if self.has_gemini_key:
            try:
                content = await self._call_gemini(system_prompt, user_prompt)
                logger.info("AI MVP plan generated via Gemini for: %s", product_name)
                return {
                    "service": service_name,
                    "product_name": product_name,
                    "content": content,
                    "source": "gemini",
                }
            except Exception as exc:
                print("GEMINI ERROR:", exc)
                logger.warning("Gemini call failed, using mock MVP plan: %s", exc)

        mock_content = self._mock_mvp_plan(product_name, description, service_name)
        logger.info("Mock MVP plan generated for: %s", product_name)
        return {
            "service": service_name,
            "product_name": product_name,
            "content": mock_content,
            "source": "mock",
        }

    def _mock_research(self, prompt: str, service_name: str) -> str:
        return json.dumps(
            {
                "service": service_name,
                "prompt": prompt,
                "market_overview": (
                    "The AI tutoring market is projected to grow rapidly driven by "
                    "personalized learning demand and LLM-powered tutoring agents."
                ),
                "target_audience": [
                    "K-12 students needing supplemental support",
                    "College students in STEM fields",
                    "Professionals upskilling in technical domains",
                ],
                "opportunities": [
                    "Adaptive learning paths powered by agent orchestration",
                    "Pay-per-session micro-economy for specialist tutor agents",
                    "Integration with Avalanche for autonomous agent payments",
                ],
                "risks": [
                    "Regulatory compliance in education markets",
                    "Quality control for AI-generated tutoring content",
                    "User acquisition costs in competitive EdTech space",
                ],
                "recommendation": (
                    "Launch an MVP focused on STEM tutoring with agent-based "
                    "marketplace payments on Avalanche Fuji testnet."
                ),
            },
            indent=2,
        )

    def _mock_branding(self, company_name: str, industry: str, service_name: str) -> str:
        return json.dumps(
            {
                "service": service_name,
                "company_name": company_name,
                "industry": industry,
                "logo_concepts": [
                    f"{company_name} Neural Node — interconnected agent nodes forming a forge icon",
                    f"{company_name} Prism — geometric prism representing multi-agent collaboration",
                ],
                "color_palette": {
                    "primary": "#E84142",
                    "secondary": "#232323",
                    "accent": "#6FCF97",
                    "background": "#F7F9FC",
                },
                "typography": {
                    "headings": "Space Grotesk",
                    "body": "Inter",
                },
                "brand_voice": "Confident, technical, autonomous, trustworthy",
                "tagline": f"{company_name}: Forge Your Agent Economy",
            },
            indent=2,
        )

    def _mock_mvp_plan(self, product_name: str, description: str, service_name: str) -> str:
        return json.dumps(
            {
                "service": service_name,
                "product_name": product_name,
                "description": description,
                "architecture": {
                    "frontend": "React + TypeScript dashboard for agent workflows",
                    "backend": "FastAPI + LangGraph orchestration layer",
                    "blockchain": "Avalanche Fuji testnet with Web3.py wallet service",
                    "database": "SQLite for MVP, PostgreSQL for production",
                },
                "components": [
                    "Manager Agent orchestrator",
                    "Service catalog and pricing engine",
                    "x402-inspired agent payment pipeline",
                    "Reputation and transaction ledger",
                ],
                "milestones": [
                    "Week 1: Core API and wallet abstraction",
                    "Week 2: LangGraph workflow and demo endpoints",
                    "Week 3: Avalanche testnet integration and hackathon demo",
                ],
                "estimated_mvp_cost_avax": 0.21,
            },
            indent=2,
        )

