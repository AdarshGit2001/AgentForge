"use client";

import { motion } from "framer-motion";
import { HOW_IT_WORKS } from "@/lib/constants";
import { fadeInUp, staggerContainer, staggerItem } from "@/animations/variants";

export function HowItWorksSection() {
  return (
    <section className="relative px-6 py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-violet/5 to-transparent" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold md:text-5xl">
            How It <span className="gradient-text">Works</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-4"
        >
          {HOW_IT_WORKS.map((step, index) => (
            <motion.div key={step.step} variants={staggerItem} className="relative">
              {index < HOW_IT_WORKS.length - 1 && (
                <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-gradient-to-r from-accent-blue/50 to-transparent md:block" />
              )}
              <div className="glass-card relative rounded-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-accent-violet text-lg font-bold">
                  {step.step}
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
