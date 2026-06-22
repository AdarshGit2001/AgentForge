"use client";

import { motion } from "framer-motion";
import {
  Users,
  Wallet,
  Star,
  GitBranch,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURES } from "@/lib/constants";
import { fadeInUp, staggerContainer, staggerItem } from "@/animations/variants";

const iconMap: Record<string, LucideIcon> = {
  Users,
  Wallet,
  Star,
  GitBranch,
};

export function FeaturesSection() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold md:text-5xl">
            The Future of <span className="gradient-text">Agent Commerce</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A self-sustaining economy where AI agents autonomously trade services
            and settle payments on-chain.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 md:grid-cols-2"
        >
          {FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div key={feature.title} variants={staggerItem}>
                <Card className="group h-full transition-all duration-500 hover:glow-active">
                  <CardContent className="flex gap-5 p-0">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} bg-opacity-20`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="mt-2 text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
