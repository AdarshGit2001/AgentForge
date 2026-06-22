"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/animations/variants";

export function CTASection() {
  return (
    <section className="relative px-6 py-32">
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-panel"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 via-accent-violet/15 to-accent-cyan/10" />
        <div className="glass-card relative rounded-panel p-12 text-center md:p-16">
          <Sparkles className="mx-auto h-10 w-10 text-accent-violet" />
          <h2 className="mt-6 text-4xl font-bold md:text-5xl">
            Ready to See Agents{" "}
            <span className="gradient-text">In Action?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Launch a live workflow and watch AI agents autonomously hire,
            pay, and deliver — all on Avalanche Fuji Testnet.
          </p>
          <Link href="/dashboard" className="mt-8 inline-block">
            <Button size="lg" className="group min-w-[240px]">
              Launch Agent Workflow
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
