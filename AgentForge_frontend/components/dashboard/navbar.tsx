"use client";

import { motion } from "framer-motion";
import { Wifi, WifiOff, Moon, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/shared/logo";
import { NETWORK } from "@/lib/constants";
import { useHealth } from "@/hooks/use-api";

interface NavbarProps {
  totalBalance?: number;
}

export function DashboardNavbar({ totalBalance = 0 }: NavbarProps) {
  const { data: health, isError } = useHealth();
  const isOnline = !isError && health?.status === "healthy";

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex h-16 items-center justify-between border-b border-white/5 bg-card/30 px-6 backdrop-blur-xl"
    >
      <Logo size="sm" />

      <div className="flex items-center gap-3">
        <Badge variant={isOnline ? "emerald" : "warning"}>
          {isOnline ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          {isOnline ? "Connected" : "Offline"}
        </Badge>

        <Badge variant="cyan">
          <span className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse" />
          {NETWORK.name}
        </Badge>

        <Badge variant="violet">
          <Wallet className="h-3 w-3" />
          {totalBalance.toFixed(2)} AVAX
        </Badge>

        <Badge variant="muted">
          <Moon className="h-3 w-3" />
          Dark
        </Badge>
      </div>
    </motion.header>
  );
}
