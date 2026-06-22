"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAvax, formatTime, truncateHash } from "@/lib/utils";
import type { Transaction, Agent } from "@/types";

interface TransactionFeedProps {
  transactions: Transaction[];
  agents: Agent[];
  limit?: number;
}

function getAgentName(agents: Agent[], id: number): string {
  return agents.find((a) => a.id === id)?.name || `Agent #${id}`;
}

function getStatusVariant(status: string): "success" | "warning" | "muted" {
  const s = status.toLowerCase();
  if (s === "completed" || s === "confirmed" || s === "success") return "success";
  if (s === "pending") return "warning";
  return "muted";
}

function getStatusIcon(status: string) {
  const s = status.toLowerCase();
  if (s === "completed" || s === "confirmed" || s === "success")
    return CheckCircle2;
  if (s === "failed") return XCircle;
  return Clock;
}

export function TransactionFeed({
  transactions,
  agents,
  limit = 10,
}: TransactionFeedProps) {
  const displayed = transactions.slice(0, limit);

  if (displayed.length === 0) {
    return (
      <div className="glass-card rounded-card p-6 text-center">
        <ArrowUpRight className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          No transactions yet. Launch a workflow to see live payments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayed.map((tx, index) => {
        const StatusIcon = getStatusIcon(tx.status);
        return (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card rounded-2xl p-4 transition-all duration-300 hover:bg-white/[0.02]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {getAgentName(agents, tx.from_agent_id)} paid{" "}
                  {getAgentName(agents, tx.to_agent_id)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {tx.description || "Service payment"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-accent-emerald">
                  {formatAvax(tx.amount_avax)}
                </p>
                <Badge variant={getStatusVariant(tx.status)} className="mt-1">
                  <StatusIcon className="h-3 w-3" />
                  {tx.status}
                </Badge>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-muted-foreground">
              <span>{formatTime(tx.created_at)}</span>
              <a
              href={`https://testnet.snowtrace.io/tx/${tx.tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-accent-emerald hover:underline"
            >
              {truncateHash(tx.tx_hash)}
            </a>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function TransactionSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="mt-2 h-3 w-32" />
          <div className="mt-3 flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
