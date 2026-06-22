"use client";

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

const NAV_ITEMS: { id: DashboardSection; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Home", icon: LayoutDashboard },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "transactions", label: "Txns", icon: ArrowLeftRight },
  { id: "wallets", label: "Wallets", icon: Wallet },
  { id: "workflow", label: "Flow", icon: GitBranch },
  { id: "settings", label: "Settings", icon: Settings },
];

interface MobileNavProps {
  active: DashboardSection;
  onNavigate: (section: DashboardSection) => void;
}

export function MobileNav({ active, onNavigate }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-card/90 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs transition-colors",
                isActive
                  ? "text-accent-blue"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
