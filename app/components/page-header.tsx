import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** Optional element rendered to the right of the heading (e.g. a button). */
  action?: ReactNode;
  className?: string;
}

/** Consistent page intro for inner pages — mono eyebrow, heading, lede. */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-wrap items-end justify-between gap-6 border-b border-border pb-10",
        className,
      )}
    >
      <div className="max-w-2xl">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
