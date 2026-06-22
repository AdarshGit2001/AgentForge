"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatAvax, getAgentColor, getAgentIcon } from "@/lib/utils";
import type { Agent, AgentStatus } from "@/types";

interface AgentCardProps {
  agent: Agent;
  status: AgentStatus;
  index: number;
}

const statusConfig: Record<
  AgentStatus,
  { label: string; variant: "default" | "emerald" | "violet" | "muted"; icon: typeof Clock }
> = {
  idle: { label: "Idle", variant: "muted", icon: Clock },
  active: { label: "Active", variant: "default", icon: Loader2 },
  completed: { label: "Completed", variant: "emerald", icon: CheckCircle2 },
  waiting: { label: "Waiting", variant: "violet", icon: Clock },
};

export function AgentCard({ agent, status, index }: AgentCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const isActive = status === "active";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative"
    >
      {index > 0 && (
        <div className="absolute -top-6 left-1/2 flex -translate-x-1/2 flex-col items-center">
          <div className="h-4 w-0.5 bg-gradient-to-b from-accent-blue/50 to-accent-violet/30" />
        </div>
      )}
      <motion.div
        animate={isActive ? { boxShadow: [
          "0 0 20px rgba(59,130,246,0.3)",
          "0 0 40px rgba(59,130,246,0.5)",
          "0 0 20px rgba(59,130,246,0.3)",
        ]} : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className={cn(
          "glass-card rounded-card p-5 transition-all duration-300",
          isActive && "border-accent-blue/30"
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl",
              getAgentColor(agent.role)
            )}
          >
            {getAgentIcon(agent.role)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate font-semibold">{agent.name}</h3>
              <Badge variant={config.variant}>
                <StatusIcon
                  className={cn("h-3 w-3", isActive && "animate-spin")}
                />
                {config.label}
              </Badge>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{agent.role}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="font-mono text-sm font-medium text-accent-cyan">
                  {formatAvax(agent.balance)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reputation</p>
                <p className="font-mono text-sm font-medium text-accent-violet">
                  {agent.reputation_score}
                </p>
              </div>
            </div>
          </div>
        </div>
        {isActive && (
          <motion.div
            className="mt-4 h-1 overflow-hidden rounded-full bg-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-accent-blue to-accent-violet"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 8, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
