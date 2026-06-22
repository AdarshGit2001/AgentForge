"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ActivityPanel } from "@/components/dashboard/activity-panel";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { TaskInputCard } from "@/components/dashboard/task-input";
import { WorkflowVisualization } from "@/components/dashboard/workflow-visualization";
import { AnalyticsSection } from "@/components/dashboard/analytics";
import { WalletCard, WalletCardSkeleton } from "@/components/dashboard/wallet-card";
import { TransactionFeed } from "@/components/dashboard/transaction-feed";
import { AgentCard } from "@/components/dashboard/agent-card";
import { ErrorState } from "@/components/ui/error-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useAgents,
  useWallets,
  useTransactions,
  useServices,
  useDemoStartupPlan,
} from "@/hooks/use-api";
import type { DashboardSection, PaymentRecord } from "@/types";
import { pageTransition } from "@/animations/variants";
import { NETWORK } from "@/lib/constants";

export function DashboardContent() {
  const [section, setSection] = useState<DashboardSection>("overview");
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeAgentIndex, setActiveAgentIndex] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [workflowResult, setWorkflowResult] = useState<string | null>(null);
  const [workflowOutputs, setWorkflowOutputs] = useState<any>(null);

  const agentsQuery = useAgents();
  const walletsQuery = useWallets();
  const transactionsQuery = useTransactions();
  const servicesQuery = useServices();
  const demoMutation = useDemoStartupPlan();

  const agents = agentsQuery.data?.agents ?? [];
  const wallets = walletsQuery.data?.wallets ?? [];
  const transactions = transactionsQuery.data?.transactions ?? [];
  const services = servicesQuery.data?.services ?? [];

  const totalBalance = useMemo(
    () => wallets.reduce((sum, w) => sum + w.balance, 0),
    [wallets]
  );

  const metrics = useMemo(() => {
    const totalVolume = transactions.reduce((s, t) => s + t.amount_avax, 0);
    const avgRep =
      agents.length > 0
        ? agents.reduce((s, a) => s + a.reputation_score, 0) / agents.length
        : 0;
    return {
      totalTransactions: transactions.length,
      servicesPurchased: services.length,
      avgReputation: Math.round(avgRep),
      workflowSuccessRate: transactions.length > 0 ? 100 : 0,
      volumeTransacted: totalVolume,
    };
  }, [transactions, agents, services]);

  const chartData = useMemo(() => {
    const grouped = transactions.reduce<Record<string, number>>((acc, tx) => {
      const date = new Date(tx.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[date] = (acc[date] || 0) + tx.amount_avax;
      return acc;
    }, {});
    const entries = Object.entries(grouped).map(([name, volume]) => ({
      name,
      volume,
    }));
    if (entries.length === 0) {
      return [
        { name: "Mon", volume: 0 },
        { name: "Tue", volume: 0 },
        { name: "Wed", volume: 0 },
        { name: "Thu", volume: 0 },
        { name: "Fri", volume: 0 },
      ];
    }
    return entries;
  }, [transactions]);

  const simulateWorkflow = useCallback(() => {
    const steps = [0, 1, 2, 3];
    let step = 0;
    setActiveAgentIndex(0);
    setCompletedSteps(0);

    const interval = setInterval(() => {
      if (step < steps.length) {
        setActiveAgentIndex(steps[step]);
        setCompletedSteps(step + 1);
        step++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setActiveAgentIndex(-1);
        setCompletedSteps(6);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLaunch = async (prompt: string) => {
    setIsRunning(true);
    setPayments([]);
    setWorkflowResult(null);
    setSection("workflow");

    const cleanup = simulateWorkflow();

    try {
      const result = await demoMutation.mutateAsync({ prompt });

      setPayments(result.payments);
      setWorkflowOutputs(result.result?.outputs);

      setWorkflowResult(
        typeof result.result === "object"
          ? JSON.stringify(result.result, null, 2)
          : String(result.result)
      );
      setCompletedSteps(6);
      setActiveAgentIndex(-1);
      setIsRunning(false);
      cleanup();

      agentsQuery.refetch();
      walletsQuery.refetch();
      transactionsQuery.refetch();
    } catch (err) {
      setIsRunning(false);
      cleanup();
      setActiveAgentIndex(-1);
      console.error("Workflow failed:", err);
    }
  };

  useEffect(() => {
    if (demoMutation.isSuccess && demoMutation.data?.payments) {
      setPayments(demoMutation.data.payments);
    }
  }, [demoMutation.isSuccess, demoMutation.data]);

  const renderMainContent = () => {
    switch (section) {
      case "agents":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {agentsQuery.isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="glass-card h-32 animate-pulse rounded-card" />
                ))
              : agents.map((agent, i) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    status="idle"
                    index={i}
                  />
                ))}
          </div>
        );

      case "transactions":
        return (
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionFeed
                transactions={transactions}
                agents={agents}
                limit={50}
              />
            </CardContent>
          </Card>
        );

      case "wallets":
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            {walletsQuery.isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <WalletCardSkeleton key={i} />
                ))
              : wallets.map((wallet, i) => (
                  <WalletCard
                    key={wallet.id}
                    wallet={wallet}
                    agent={agents.find((a) => a.id === wallet.agent_id)}
                    index={i}
                  />
                ))}
          </div>
        );

      case "workflow":
        return (
          <div className="space-y-6">
            <WorkflowVisualization
              agents={agents}
              payments={payments}
              isRunning={isRunning}
              activeAgentIndex={activeAgentIndex}
              completedSteps={completedSteps}
            />
            {workflowOutputs && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Research Agent Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-sm">
                      {workflowOutputs.research?.[0]?.output?.content}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Design Agent Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-sm">
                      {workflowOutputs.design?.[0]?.output?.content}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Developer Agent Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-sm">
                      {workflowOutputs.developer?.[0]?.output?.content}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      case "settings":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-white/[0.02] p-4">
                <div>
                  <p className="font-medium">API Endpoint</p>
                  <p className="text-sm text-muted-foreground">
                    Backend server URL
                  </p>
                </div>
                <Badge variant="cyan">localhost:8000</Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/[0.02] p-4">
                <div>
                  <p className="font-medium">Network</p>
                  <p className="text-sm text-muted-foreground">
                    Avalanche testnet configuration
                  </p>
                </div>
                <Badge variant="violet">{NETWORK.name}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/[0.02] p-4">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">
                    Application appearance
                  </p>
                </div>
                <Badge variant="muted">Dark Mode</Badge>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <div className="space-y-6">
            <AnalyticsSection metrics={metrics} chartData={chartData} />
            <WorkflowVisualization
              agents={agents}
              payments={payments}
              isRunning={isRunning}
              activeAgentIndex={activeAgentIndex}
              completedSteps={completedSteps}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {walletsQuery.isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <WalletCardSkeleton key={i} />
                  ))
                : wallets.map((wallet, i) => (
                    <WalletCard
                      key={wallet.id}
                      wallet={wallet}
                      agent={agents.find((a) => a.id === wallet.agent_id)}
                      index={i}
                    />
                  ))}
            </div>
          </div>
        );
    }
  };

  const hasError =
    agentsQuery.isError || walletsQuery.isError || transactionsQuery.isError;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className="flex h-screen flex-col bg-background"
    >
      <DashboardNavbar totalBalance={totalBalance} />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <Sidebar active={section} onNavigate={setSection} />
        </div>

        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">
            <div className="mx-auto max-w-5xl space-y-6">
              <TaskInputCard
                onLaunch={handleLaunch}
                isLoading={isRunning || demoMutation.isPending}
              />

              {hasError && section === "overview" ? (
                <ErrorState
                  message="Unable to connect to backend. Ensure the API is running on localhost:8000"
                  onRetry={() => {
                    agentsQuery.refetch();
                    walletsQuery.refetch();
                    transactionsQuery.refetch();
                  }}
                />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={section}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderMainContent()}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </main>

        <div className="hidden xl:block">
          <ActivityPanel />
        </div>
      </div>

      <MobileNav active={section} onNavigate={setSection} />
    </motion.div>
  );
}
