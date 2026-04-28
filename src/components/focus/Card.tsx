import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const SurfaceCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-surface rounded-[2rem] p-6 md:p-8 shadow-card border border-border/60 animate-fade-up",
        className
      )}
      {...props}
    />
  )
);
SurfaceCard.displayName = "SurfaceCard";

export const SectionLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn("text-graphite-light text-[10px] font-semibold tracking-[0.18em] uppercase", className)}>
    {children}
  </h2>
);
