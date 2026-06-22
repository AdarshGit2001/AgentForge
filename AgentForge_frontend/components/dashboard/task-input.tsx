"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_PROMPT } from "@/lib/constants";

interface TaskInputCardProps {
  onLaunch: (prompt: string) => void;
  isLoading: boolean;
}

export function TaskInputCard({ onLaunch, isLoading }: TaskInputCardProps) {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);

  return (
    <Card className="gradient-border overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-accent-blue" />
          Launch Agent Workflow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your goal..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => onLaunch(prompt)}
            disabled={isLoading || prompt.length < 3}
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running Workflow...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" />
                Launch Agent Workflow
              </>
            )}
          </Button>
        </div>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4"
          >
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-blue via-accent-violet to-accent-cyan"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 30, ease: "linear" }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Agents are hiring, paying, and collaborating autonomously...
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
