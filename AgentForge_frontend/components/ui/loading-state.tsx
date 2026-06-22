"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8",
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-accent-blue" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </motion.div>
  );
}
