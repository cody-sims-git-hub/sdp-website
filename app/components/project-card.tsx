import { ArrowUpRight, ExternalLink } from "lucide-react";
import { cn } from "~/lib/utils";
import { GithubIcon } from "~/components/icons";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export interface ProjectLink {
  label: string;
  href: string;
  kind: "github" | "demo" | "details";
}

export interface Project {
  title: string;
  category: string;
  description: string;
  tags: string[];
  links?: ProjectLink[];
}

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const linkIcon = {
  github: GithubIcon,
  demo: ExternalLink,
  details: ArrowUpRight,
};

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
      {project.links && project.links.length > 0 && (
        <CardFooter className="flex flex-wrap gap-2">
          {project.links.map((link) => {
            const Icon = linkIcon[link.kind];
            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Icon className="size-3.5" />
                {link.label}
              </a>
            );
          })}
        </CardFooter>
      )}
    </Card>
  );
}
