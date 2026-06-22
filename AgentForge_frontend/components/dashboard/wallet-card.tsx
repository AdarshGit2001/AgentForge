"use client";

import { motion } from "framer-motion";
import { Wallet, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAddress, formatAvax } from "@/lib/utils";
import type { Wallet as WalletType, Agent } from "@/types";

interface WalletCardProps {
  wallet: WalletType;
  agent?: Agent;
  index: number;
}

export function WalletCard({ wallet, agent, index }: WalletCardProps) {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card group rounded-card p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20">
            <Wallet className="h-5 w-5 text-accent-blue" />
          </div>
          <div>
            <p className="font-medium">{agent?.name || `Agent #${wallet.agent_id}`}</p>
            <Badge variant="cyan" className="mt-1">
              {wallet.network}
            </Badge>
          </div>
        </div>
        <button
          onClick={copyAddress}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          {copied ? (
            <Check className="h-4 w-4 text-accent-emerald" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="mt-4">
        <p className="font-mono text-2xl font-bold text-accent-cyan">
          {formatAvax(wallet.balance)}
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {formatAddress(wallet.address, 8)}
        </p>
      </div>
    </motion.div>
  );
}

export function WalletCardSkeleton() {
  return (
    <div className="glass-card rounded-card p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-5 w-16 rounded-full" />
        </div>
      </div>
      <Skeleton className="mt-4 h-8 w-32" />
      <Skeleton className="mt-2 h-3 w-40" />
    </div>
  );
}
