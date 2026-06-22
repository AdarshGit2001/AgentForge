export const AGENT_ROLES = [
  { name: "Manager Agent", role: "manager", description: "Orchestrates the agent economy" },
  { name: "Research Agent", role: "research", description: "Delivers market research & insights" },
  { name: "Design Agent", role: "design", description: "Creates branding & visual identity" },
  { name: "Developer Agent", role: "developer", description: "Builds MVP plans & architecture" },
] as const;

export const FEATURES = [
  {
    title: "Autonomous Hiring",
    description: "Agents discover and hire specialized agents based on reputation and service quality.",
    icon: "Users",
    gradient: "from-accent-blue to-accent-cyan",
  },
  {
    title: "On-Chain Payments",
    description: "Every service purchase executes as a real AVAX transaction on Avalanche Fuji Testnet.",
    icon: "Wallet",
    gradient: "from-accent-violet to-accent-blue",
  },
  {
    title: "Reputation Economy",
    description: "Agents build trust through successful deliveries, creating a self-regulating marketplace.",
    icon: "Star",
    gradient: "from-accent-emerald to-accent-cyan",
  },
  {
    title: "Workflow Orchestration",
    description: "Complex multi-agent workflows execute end-to-end without human intervention.",
    icon: "GitBranch",
    gradient: "from-accent-cyan to-accent-violet",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Submit Your Goal",
    description: "Describe what you want built — a startup plan, logo, or MVP.",
  },
  {
    step: 2,
    title: "Manager Orchestrates",
    description: "The Manager Agent breaks down your goal and hires the right specialists.",
  },
  {
    step: 3,
    title: "Agents Get Paid",
    description: "Each agent receives AVAX payment upon successful service delivery.",
  },
  {
    step: 4,
    title: "Receive Output",
    description: "Get a complete deliverable assembled by your autonomous agent team.",
  },
] as const;

export const TECH_STACK = [
  { name: "Next.js 15", category: "Frontend" },
  { name: "FastAPI", category: "Backend" },
  { name: "LangGraph", category: "Orchestration" },
  { name: "Avalanche Fuji", category: "Blockchain" },
  { name: "React Query", category: "Data" },
  { name: "Framer Motion", category: "Animation" },
] as const;

export const DEFAULT_PROMPT = "Build a startup plan for an AI Tutor App";

export const TIMELINE_STEPS = [
  { id: 1, title: "Manager Agent Received Task", description: "Task parsed and workflow initiated", agent: "Manager" },
  { id: 2, title: "Research Agent Hired", description: "Market research service purchased", agent: "Research" },
  { id: 3, title: "Payment Executed", description: "AVAX transferred on Fuji Testnet", agent: "Manager" },
  { id: 4, title: "Research Delivered", description: "Market analysis and insights returned", agent: "Research" },
  { id: 5, title: "Design Agent Hired", description: "Branding service purchased", agent: "Design" },
  { id: 6, title: "Final Output Generated", description: "Complete startup plan assembled", agent: "Developer" },
] as const;

export const NETWORK = {
  name: "Avalanche Fuji Testnet",
  chainId: 43113,
  symbol: "AVAX",
} as const;
