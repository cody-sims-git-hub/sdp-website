import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

interface CTAProps {
  title: string;
  description?: string;
  actionLabel: string;
  actionTo: string;
  /** "panel" = centered hero-style panel with glow; "bar" = compact inline row. */
  variant?: "panel" | "bar";
  className?: string;
}

export function CTA({
  title,
  description,
  actionLabel,
  actionTo,
  variant = "panel",
  className,
}: CTAProps) {
  if (variant === "bar") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm px-6 py-6",
          className,
        )}
      >
        <div>
          <p className="font-medium text-foreground">{title}</p>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <Button asChild className="ml-auto">
          <Link to={actionTo}>
            {actionLabel} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm px-6 py-12 text-center sm:px-12",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-8rem] mx-auto h-64 w-[36rem] rounded-full bg-primary/20 blur-[100px]"
      />
      <h2 className="relative text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="relative mx-auto mt-3 max-w-xl text-muted-foreground">
          {description}
        </p>
      )}
      <div className="relative mt-6">
        <Button asChild size="lg">
          <Link to={actionTo}>
            {actionLabel} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
