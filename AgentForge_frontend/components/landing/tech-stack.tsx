"use client";

import { motion } from "framer-motion";
import { TECH_STACK } from "@/lib/constants";
import { fadeInUp, staggerContainer, staggerItem } from "@/animations/variants";

export function TechStackSection() {
  return (
    <section className="relative px-6 py-32">
      <div className="absolute inset-0 bg-gradient-to-t from-accent-blue/5 to-transparent" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold md:text-5xl">
            Built With <span className="gradient-text">Modern Tech</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
        >
          {TECH_STACK.map((tech) => (
            <motion.div key={tech.name} variants={staggerItem}>
              <div className="glass-card flex flex-col items-center rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:glow-active">
                <p className="font-semibold">{tech.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {tech.category}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
