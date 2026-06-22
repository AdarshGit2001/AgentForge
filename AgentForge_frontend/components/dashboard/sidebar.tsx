"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  ArrowLeftRight,
  Wallet,
  GitBranch,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardSection } from "@/types";
import { slideInSidebar } from "@/animations/variants";

const NAV_ITEMS: { id: DashboardSection; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "wallets", label: "Wallets", icon: Wallet },
  { id: "workflow", label: "Workflow", icon: GitBranch },
  { id: "settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  active: DashboardSection;
  onNavigate: (section: DashboardSection) => void;
  collapsed?: boolean;
}

export function Sidebar({ active, onNavigate, collapsed }: SidebarProps) {
  return (
    <motion.aside
      variants={slideInSidebar}
      initial="initial"
      animate="animate"
      className={cn(
        "flex h-full flex-col border-r border-white/5 bg-card/50 p-4 backdrop-blur-xl",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "group relative flex items-center gap-3 rounded-button px-3 py-3 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-accent-blue/20 to-accent-violet/10 text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-button border border-accent-blue/20"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "relative h-5 w-5 transition-colors",
                  isActive ? "text-accent-blue" : "group-hover:text-accent-blue"
                )}
              />
              {!collapsed && (
                <span className="relative">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </motion.aside>
  );
}
