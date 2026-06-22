"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/shared/animated-background";
import { FloatingWalletCards } from "@/components/landing/floating-wallets";
import { fadeInUp, staggerContainer, staggerItem } from "@/animations/variants";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24">
      <AnimatedBackground />
      <FloatingWalletCards />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 mx-auto max-w-5xl text-center"
      >
        <motion.div variants={staggerItem} className="mb-6 inline-flex">
          <span className="glass rounded-full px-4 py-2 text-sm text-accent-cyan">
            ⚡ Built for Avalanche Agentic Payments Speedrun
          </span>
        </motion.div>

        <motion.h1
          variants={staggerItem}
          className="text-balance text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl"
        >
          <span className="block">AI Agents That</span>
          <span className="gradient-text mt-2 block">
            Hire, Pay, and Work Together
          </span>
        </motion.h1>

        <motion.p
          variants={staggerItem}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          AI agents discover services, negotiate value, and execute payments on
          Avalanche without human intervention.
        </motion.p>

        <motion.div
          variants={staggerItem}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/dashboard">
            <Button size="lg" className="group min-w-[200px]">
              <Play className="h-5 w-5" />
              Launch Demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="min-w-[200px]">
              View Dashboard
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-8"
        >
          {[
            { value: "4", label: "Autonomous Agents" },
            { value: "AVAX", label: "Fuji Testnet" },
            { value: "100%", label: "Agent-Driven" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold gradient-text md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
