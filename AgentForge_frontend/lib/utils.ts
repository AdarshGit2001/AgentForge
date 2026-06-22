import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAvax(amount: number): string {
  return `${amount.toFixed(4)} AVAX`;
}

export function formatAddress(address: string, chars = 6): string {
  if (!address || address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function truncateHash(hash: string, chars = 8): string {
  if (!hash || hash.length <= chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

export function getAgentColor(role: string): string {
  const colors: Record<string, string> = {
    manager: "from-accent-blue to-accent-cyan",
    research: "from-accent-violet to-accent-blue",
    design: "from-accent-emerald to-accent-cyan",
    developer: "from-accent-cyan to-accent-violet",
  };
  const key = role.toLowerCase();
  for (const [k, v] of Object.entries(colors)) {
    if (key.includes(k)) return v;
  }
  return "from-accent-blue to-accent-violet";
}

export function getAgentIcon(role: string): string {
  const icons: Record<string, string> = {
    manager: "👔",
    research: "🔬",
    design: "🎨",
    developer: "⚡",
  };
  const key = role.toLowerCase();
  for (const [k, v] of Object.entries(icons)) {
    if (key.includes(k)) return v;
  }
  return "🤖";
}

export function parseJsonSafe<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
