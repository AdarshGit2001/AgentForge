"use client";

import { motion } from "framer-motion";
import { ArrowDown, Zap } from "lucide-react";
import { AGENT_ROLES } from "@/lib/constants";
import { getAgentIcon } from "@/lib/utils";
import { fadeInUp } from "@/animations/variants";

export function AgentEconomySection() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold md:text-5xl">
            Agent <span className="gradient-text">Economy</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Watch agents hire, pay, and collaborate in a fully autonomous workflow
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-4">
          {AGENT_ROLES.map((agent, index) => (
            <motion.div
              key={agent.role}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="w-full max-w-md"
            >
              <div className="glass-card group flex items-center gap-4 rounded-card p-5 transition-all duration-500 hover:glow-active">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-violet/20 text-2xl">
                  {getAgentIcon(agent.role)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {agent.description}
                  </p>
                </div>
                {index < AGENT_ROLES.length - 1 && (
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="hidden sm:block"
                  >
                    <Zap className="h-5 w-5 text-accent-emerald" />
                  </motion.div>
                )}
              </div>
              {index < AGENT_ROLES.length - 1 && (
                <div className="flex justify-center py-2">
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowDown className="h-5 w-5 text-accent-blue/50" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
