"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionFeed, TransactionSkeleton } from "@/components/dashboard/transaction-feed";
import { ErrorState } from "@/components/ui/error-state";
import { useAgents, useTransactions } from "@/hooks/use-api";

export function ActivityPanel() {
  const { data: agentsData } = useAgents();
  const {
    data: txData,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransactions();

  const agents = agentsData?.agents ?? [];
  const transactions = txData?.transactions ?? [];

  return (
    <motion.aside
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex h-full w-80 flex-col border-l border-white/5 bg-card/30 backdrop-blur-xl"
    >
      <div className="border-b border-white/5 p-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-accent-blue" />
          <h2 className="font-semibold">Live Activity</h2>
          {transactions.length > 0 && (
            <span className="ml-auto flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-accent-emerald opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-emerald" />
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Real-time agent transactions
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <TransactionSkeleton />
        ) : isError ? (
          <ErrorState
            message={error?.message}
            onRetry={() => refetch()}
          />
        ) : (
          <TransactionFeed transactions={transactions} agents={agents} />
        )}
      </div>
    </motion.aside>
  );
}
