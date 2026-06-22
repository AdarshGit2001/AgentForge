"use client";

import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  ShoppingBag,
  Star,
  TrendingUp,
  Activity,
  type LucideIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";
import type { AnalyticsMetrics } from "@/types";

interface MetricCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  gradient: string;
  decimals?: number;
}

function MetricCard({
  title,
  value,
  suffix = "",
  icon: Icon,
  gradient,
  decimals = 0,
}: MetricCardProps) {
  const animated = useAnimatedCounter(
    decimals > 0 ? Math.round(value * Math.pow(10, decimals)) : value
  );
  const display =
    decimals > 0
      ? (animated / Math.pow(10, decimals)).toFixed(decimals)
      : animated.toString();

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="h-full">
        <CardContent className="flex items-start justify-between p-5">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">
              {display}
              {suffix && (
                <span className="ml-1 text-lg text-muted-foreground">
                  {suffix}
                </span>
              )}
            </p>
          </div>
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface AnalyticsSectionProps {
  metrics: AnalyticsMetrics;
  chartData: { name: string; volume: number }[];
}

export function AnalyticsSection({ metrics, chartData }: AnalyticsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Transactions"
          value={metrics.totalTransactions}
          icon={ArrowLeftRight}
          gradient="from-accent-blue to-accent-cyan"
        />
        <MetricCard
          title="Services Purchased"
          value={metrics.servicesPurchased}
          icon={ShoppingBag}
          gradient="from-accent-violet to-accent-blue"
        />
        <MetricCard
          title="Agent Reputation"
          value={metrics.avgReputation}
          icon={Star}
          gradient="from-accent-emerald to-accent-cyan"
        />
        <MetricCard
          title="Success Rate"
          value={metrics.workflowSuccessRate}
          suffix="%"
          icon={TrendingUp}
          gradient="from-accent-cyan to-accent-violet"
        />
        <MetricCard
          title="Volume Transacted"
          value={metrics.volumeTransacted}
          suffix="AVAX"
          icon={Activity}
          gradient="from-accent-blue to-accent-violet"
          decimals={4}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transaction Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#14141f",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#f4f4f5",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#3b82f6"
                  fill="url(#volumeGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
