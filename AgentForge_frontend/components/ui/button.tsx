import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-accent-blue to-accent-violet text-white shadow-glow hover:shadow-glow-violet hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "glass text-foreground hover:bg-white/[0.08] hover:scale-[1.02]",
        ghost: "hover:bg-white/[0.05] text-muted-foreground hover:text-foreground",
        outline:
          "border border-white/10 bg-transparent hover:bg-white/[0.05] hover:border-white/20",
        emerald:
          "bg-gradient-to-r from-accent-emerald to-accent-cyan text-white shadow-glow-emerald hover:scale-[1.02]",
      },
      size: {
        default: "h-12 px-6 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
