import { ArrowUpRight } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export interface Project {
  title: string;
  category: string;
  description: string;
  tags: string[];
  link?: string | null;
}

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col border-border bg-card/60 backdrop-blur-sm transition-colors hover:border-primary/40",
        className,
      )}
    >
      <CardHeader>
        <span className="w-fit rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-primary">
          {project.category}
        </span>
        <CardTitle className="mt-3 text-xl">{project.title}</CardTitle>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      {project.link && (
        <CardFooter>
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View project <ArrowUpRight className="size-4" />
          </a>
        </CardFooter>
      )}
    </Card>
  );
}
