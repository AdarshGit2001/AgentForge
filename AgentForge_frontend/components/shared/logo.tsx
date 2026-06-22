import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showTagline = false, size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: "h-7 w-7", text: "text-lg", tagline: "text-xs" },
    md: { icon: "h-9 w-9", text: "text-xl", tagline: "text-sm" },
    lg: { icon: "h-11 w-11", text: "text-2xl", tagline: "text-base" },
  };

  const s = sizes[size];

  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-button bg-gradient-to-br from-accent-blue to-accent-violet shadow-glow transition-transform duration-300 group-hover:scale-105",
          s.icon
        )}
      >
        <Sparkles className="h-1/2 w-1/2 text-white" />
      </div>
      <div className="flex flex-col">
        <span className={cn("font-bold tracking-tight", s.text)}>
          Agent<span className="gradient-text">Forge</span>
        </span>
        {showTagline && (
          <span className={cn("text-muted-foreground", s.tagline)}>
            The Autonomous Agent Economy
          </span>
        )}
      </div>
    </Link>
  );
}
