import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** When provided, renders a checked feature list below the description. */
  points?: string[];
  className?: string;
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  points,
  className,
}: ServiceCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col border-border bg-card/60 backdrop-blur-sm transition-colors hover:border-primary/40",
        className,
      )}
    >
      <CardHeader>
        <span className="grid size-11 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
          <Icon className="size-5" />
        </span>
        <CardTitle className="mt-4 text-lg">{title}</CardTitle>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardHeader>
      {points && points.length > 0 && (
        <CardContent className="mt-auto">
          <ul className="space-y-2">
            {points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {point}
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}
