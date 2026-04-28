import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const PageHeader = ({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) => (
  <header className={cn("flex flex-col md:flex-row md:items-end md:justify-between gap-4 px-1 mb-6 md:mb-8 animate-fade-up", className)}>
    <div className="flex flex-col gap-2">
      {eyebrow && (
        <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-moss">{eyebrow}</span>
      )}
      <h1 className="text-3xl md:text-4xl font-serif-display tracking-tight text-graphite">{title}</h1>
      {description && <p className="text-graphite-light text-sm max-w-2xl">{description}</p>}
    </div>
    {action}
  </header>
);
