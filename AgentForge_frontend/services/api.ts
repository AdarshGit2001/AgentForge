import { apiClient } from "@/lib/api-client";
import type {
  AgentListResponse,
  Agent,
  DemoResponse,
  DemoStartupPlanRequest,
  HealthResponse,
  RootResponse,
  ServiceListResponse,
  TransactionListResponse,
  WalletListResponse,
  Workflow,
  WorkflowStartRequest,
  WorkflowStartResponse,
} from "@/types";

export const agentsApi = {
  list: () => apiClient.get<AgentListResponse>("/agents").then((r) => r.data),
  get: (id: number) => apiClient.get<Agent>(`/agents/${id}`).then((r) => r.data),
};

export const walletsApi = {
  list: () => apiClient.get<WalletListResponse>("/wallets").then((r) => r.data),
};

export const transactionsApi = {
  list: () =>
    apiClient.get<TransactionListResponse>("/transactions").then((r) => r.data),
};

export const servicesApi = {
  list: () =>
    apiClient.get<ServiceListResponse>("/services").then((r) => r.data),
};

export const workflowApi = {
  start: (payload: WorkflowStartRequest) =>
    apiClient
      .post<WorkflowStartResponse>("/workflow/start", payload)
      .then((r) => r.data),
  get: (id: number) =>
    apiClient.get<Workflow>(`/workflow/${id}`).then((r) => r.data),
};

export const demoApi = {
  startupPlan: (payload: DemoStartupPlanRequest) =>
    apiClient
      .post<DemoResponse>("/demo/startup-plan", payload)
      .then((r) => r.data),
};

export const healthApi = {
  root: () => apiClient.get<RootResponse>("/").then((r) => r.data),
  health: () => apiClient.get<HealthResponse>("/health").then((r) => r.data),
};
