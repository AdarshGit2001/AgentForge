export interface ServiceSummary {
  id: number;
  name: string;
  price_avax: number;
  category: string;
  description: string;
}

export interface Agent {
  id: number;
  agent_uuid: string;
  name: string;
  role: string;
  wallet_address: string | null;
  balance: number;
  reputation_score: number;
  description: string;
  services: ServiceSummary[];
  created_at: string;
  updated_at: string;
}

export interface AgentListResponse {
  agents: Agent[];
  total: number;
}

export interface Wallet {
  id: number;
  agent_id: number;
  address: string;
  balance: number;
  network: string;
  created_at: string;
  updated_at: string;
}

export interface WalletListResponse {
  wallets: Wallet[];
  total: number;
}

export interface Transaction {
  id: number;
  tx_hash: string;
  from_agent_id: number;
  to_agent_id: number;
  wallet_id: number | null;
  service_id: number | null;
  workflow_id: number | null;
  amount_avax: number;
  status: string;
  description: string;
  created_at: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price_avax: number;
  agent_id: number;
  category: string;
  is_active: number;
  created_at: string;
}

export interface ServiceListResponse {
  services: Service[];
  total: number;
}

export interface AgentExecution {
  id: number;
  agent_id: number;
  service_id: number | null;
  status: string;
  output_data: string;
  payment_tx_hash: string;
  started_at: string;
  completed_at: string | null;
}

export interface Workflow {
  id: number;
  workflow_uuid: string;
  status: string;
  current_agent: string;
  total_cost_avax: number;
  outputs: string;
  payments: string;
  error_message: string;
  start_time: string;
  end_time: string | null;
  executions: AgentExecution[];
}

export interface WorkflowStartRequest {
  prompt: string;
  request_type?: string;
}

export interface WorkflowStartResponse {
  workflow_id: number;
  workflow_uuid: string;
  status: string;
  message: string;
  result?: {
    total_cost_avax: number;
    payments: PaymentRecord[];
    outputs: WorkflowOutputs;
  };
}

export interface DemoStartupPlanRequest {
  prompt: string;
}

export interface DemoResponse {
  success: boolean;
  workflow_id: number;
  workflow_uuid: string;
  total_cost_avax: number;
  payments: PaymentRecord[];
  result: Record<string, unknown>;
  message: string;
}

export interface PaymentRecord {
  from: string;
  to: string;
  amount_avax: number;
  tx_hash?: string;
  service?: string;
}

export interface WorkflowOutputs {
  manager?: string;
  research?: string;
  design?: string;
  developer?: string;
}

export type AgentStatus = "idle" | "active" | "completed" | "waiting";

export type DashboardSection =
  | "overview"
  | "agents"
  | "transactions"
  | "wallets"
  | "workflow"
  | "settings";

export interface AnalyticsMetrics {
  totalTransactions: number;
  servicesPurchased: number;
  avgReputation: number;
  workflowSuccessRate: number;
  volumeTransacted: number;
}

export interface TimelineStep {
  id: number;
  title: string;
  description: string;
  status: "pending" | "active" | "completed";
  agent?: string;
}

export interface HealthResponse {
  status: string;
}

export interface RootResponse {
  name: string;
  version: string;
  status: string;
  docs: string;
}
