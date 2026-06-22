"use client";

import { motion } from "framer-motion";
import { Wallet, ArrowRight } from "lucide-react";
import { formatAvax } from "@/lib/utils";

const FLOATING_WALLETS = [
  { name: "Manager", balance: 2.45, x: "10%", y: "20%", delay: 0 },
  { name: "Research", balance: 0.87, x: "75%", y: "15%", delay: 1 },
  { name: "Design", balance: 1.23, x: "85%", y: "55%", delay: 2 },
  { name: "Developer", balance: 0.56, x: "5%", y: "65%", delay: 1.5 },
];

export function FloatingWalletCards() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {FLOATING_WALLETS.map((wallet) => (
        <motion.div
          key={wallet.name}
          className="absolute"
          style={{ left: wallet.x, top: wallet.y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: wallet.delay },
            scale: { duration: 0.6, delay: wallet.delay },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: wallet.delay },
          }}
        >
          <div className="glass-card flex items-center gap-3 rounded-2xl p-4 shadow-glow">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-violet/20">
              <Wallet className="h-5 w-5 text-accent-blue" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{wallet.name} Agent</p>
              <p className="font-mono text-sm font-semibold text-accent-cyan">
                {formatAvax(wallet.balance)}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
      <motion.div
        className="absolute left-1/2 top-1/3 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0], x: [0, 100, 200] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      >
        <div className="h-2 w-2 rounded-full bg-accent-emerald shadow-glow-emerald" />
        <ArrowRight className="h-4 w-4 text-accent-emerald" />
        <span className="text-xs font-medium text-accent-emerald">0.03 AVAX</span>
      </motion.div>
    </div>
  );
}
