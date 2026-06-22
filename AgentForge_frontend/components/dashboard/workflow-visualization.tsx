"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Bot, GitBranch, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentCard } from "@/components/dashboard/agent-card";
import { PaymentFlow } from "@/components/dashboard/payment-flow";
import { WorkflowTimeline } from "@/components/dashboard/workflow-timeline";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Skeleton } from "@/components/ui/skeleton";
import { TIMELINE_STEPS } from "@/lib/constants";
import type { Agent, AgentStatus, PaymentRecord, TimelineStep } from "@/types";

interface WorkflowVisualizationProps {
  agents: Agent[];
  payments: PaymentRecord[];
  isRunning: boolean;
  activeAgentIndex: number;
  completedSteps: number;
}

function getAgentStatus(
  index: number,
  activeIndex: number,
  isRunning: boolean
): AgentStatus {
  if (!isRunning && activeIndex < 0) return "idle";
  if (index < activeIndex) return "completed";
  if (index === activeIndex) return "active";
  if (index === activeIndex + 1 && isRunning) return "waiting";
  return "idle";
}

export function WorkflowVisualization({
  agents,
  payments,
  isRunning,
  activeAgentIndex,
  completedSteps,
}: WorkflowVisualizationProps) {
  const timelineSteps: TimelineStep[] = useMemo(
    () =>
      TIMELINE_STEPS.map((step, index) => ({
        ...step,
        status:
          index < completedSteps
            ? "completed"
            : index === completedSteps && isRunning
            ? "active"
            : "pending",
      })),
    [completedSteps, isRunning]
  );

  const sortedAgents = [...agents].sort((a, b) => a.id - b.id);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="h-5 w-5 text-accent-violet" />
            Agent Workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedAgents.length === 0 ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-card" />
              ))}
            </div>
          ) : (
            sortedAgents.map((agent, index) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                status={getAgentStatus(index, activeAgentIndex, isRunning)}
                index={index}
              />
            ))
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-5 w-5 text-accent-emerald" />
              Payment Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentFlow
              payments={payments}
              activeIndex={isRunning ? payments.length - 1 : -1}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch className="h-5 w-5 text-accent-blue" />
              Workflow Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WorkflowTimeline steps={timelineSteps} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function WorkflowVisualizationLoading() {
  return <LoadingState message="Loading agent workflow..." />;
}

export function WorkflowVisualizationError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return <ErrorState message={message} onRetry={onRetry} />;
}
