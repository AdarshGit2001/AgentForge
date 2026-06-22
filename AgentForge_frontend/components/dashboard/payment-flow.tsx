"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import type { PaymentRecord } from "@/types";
import { formatAvax } from "@/lib/utils";

interface PaymentFlowProps {
  payments: PaymentRecord[];
  activeIndex?: number;
}

export function PaymentFlow({ payments, activeIndex = -1 }: PaymentFlowProps) {
  if (payments.length === 0) {
    return (
      <div className="glass-card rounded-card p-6 text-center">
        <Zap className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          Payment flows will appear when workflow runs
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {payments.map((payment, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;

          return (
            <motion.div
              key={`${payment.from}-${payment.to}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div
                className={`glass-card flex items-center gap-4 rounded-2xl p-4 transition-all duration-500 ${
                  isActive ? "glow-active border-accent-emerald/30" : ""
                } ${isPast ? "opacity-60" : ""}`}
              >
                <div className="flex-1 text-right">
                  <p className="text-sm font-medium">{payment.from}</p>
                </div>

                <div className="relative flex items-center gap-2 px-4">
                  <motion.div
                    animate={
                      isActive
                        ? { x: [0, 20, 0], opacity: [0.5, 1, 0.5] }
                        : {}
                    }
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-1"
                  >
                    <div className="h-2 w-2 rounded-full bg-accent-emerald" />
                    <ArrowRight className="h-4 w-4 text-accent-emerald" />
                    <span className="font-mono text-xs font-semibold text-accent-emerald">
                      {formatAvax(payment.amount_avax)}
                    </span>
                  </motion.div>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium">{payment.to}</p>
                </div>
              </div>

              {payment.tx_hash && (
                <p className="mt-1 text-center font-mono text-xs text-muted-foreground">
                  ✓ {payment.tx_hash.slice(0, 16)}...
                </p>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
