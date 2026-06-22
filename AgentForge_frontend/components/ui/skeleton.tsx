import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-button bg-white/[0.06]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
