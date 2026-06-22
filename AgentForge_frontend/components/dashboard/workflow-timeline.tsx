"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineStep } from "@/types";

interface WorkflowTimelineProps {
  steps: TimelineStep[];
}

export function WorkflowTimeline({ steps }: WorkflowTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-0 h-full w-0.5 bg-gradient-to-b from-accent-blue/50 via-accent-violet/30 to-transparent" />

      <div className="space-y-6">
        {steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-4 pl-2"
            >
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                  isCompleted
                    ? "border-accent-emerald bg-accent-emerald/20"
                    : isActive
                    ? "border-accent-blue bg-accent-blue/20"
                    : "border-white/10 bg-card"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-accent-emerald" />
                ) : isActive ? (
                  <Loader2 className="h-4 w-4 animate-spin text-accent-blue" />
                ) : (
                  <Circle className="h-3 w-3 text-muted-foreground" />
                )}
              </div>

              <div
                className={cn(
                  "flex-1 rounded-2xl p-4 transition-all duration-300",
                  isActive ? "glass-card glow-active" : "bg-white/[0.02]",
                  isCompleted && "opacity-80"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{step.title}</p>
                  {step.agent && (
                    <span className="text-xs text-accent-violet">
                      {step.agent}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
