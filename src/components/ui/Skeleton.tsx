import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-lg bg-[linear-gradient(100deg,var(--color-paper-deep)_40%,var(--color-card)_50%,var(--color-paper-deep)_60%)] bg-[length:200%_100%]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
