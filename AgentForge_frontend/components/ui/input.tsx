import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-button border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-foreground backdrop-blur-sm transition-all duration-300 placeholder:text-muted-foreground focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
