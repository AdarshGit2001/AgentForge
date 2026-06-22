import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-accent-blue/15 text-accent-blue border border-accent-blue/20",
        violet: "bg-accent-violet/15 text-accent-violet border border-accent-violet/20",
        emerald: "bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/20",
        cyan: "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/20",
        muted: "bg-white/5 text-muted-foreground border border-white/10",
        success: "bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30",
        warning: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
