"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  agentsApi,
  demoApi,
  healthApi,
  servicesApi,
  transactionsApi,
  walletsApi,
  workflowApi,
} from "@/services/api";
import type { DemoStartupPlanRequest, WorkflowStartRequest } from "@/types";

export const queryKeys = {
  agents: ["agents"] as const,
  wallets: ["wallets"] as const,
  transactions: ["transactions"] as const,
  services: ["services"] as const,
  workflow: (id: number) => ["workflow", id] as const,
  health: ["health"] as const,
};

export function useAgents() {
  return useQuery({
    queryKey: queryKeys.agents,
    queryFn: agentsApi.list,
    refetchInterval: 10000,
  });
}

export function useWallets() {
  return useQuery({
    queryKey: queryKeys.wallets,
    queryFn: walletsApi.list,
    refetchInterval: 10000,
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: transactionsApi.list,
    refetchInterval: 5000,
  });
}

export function useServices() {
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: servicesApi.list,
    refetchInterval: 30000,
  });
}

export function useWorkflow(id: number | null) {
  return useQuery({
    queryKey: queryKeys.workflow(id ?? 0),
    queryFn: () => workflowApi.get(id!),
    enabled: id !== null,
    refetchInterval: 3000,
  });
}

export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: healthApi.health,
    refetchInterval: 30000,
    retry: 1,
  });
}

export function useStartWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: WorkflowStartRequest) => workflowApi.start(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    },
  });
}

export function useDemoStartupPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DemoStartupPlanRequest) =>
      demoApi.startupPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    },
  });
}
