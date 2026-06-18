import type { Route } from "./+types/projects";
import { PageHeader } from "~/components/page-header";
import { ProjectCard, type Project } from "~/components/project-card";
import { CTA } from "~/components/cta";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projects — Sims Digital Partners" },
    {
      name: "description",
      content:
        "Recent work by Cody Sims — websites, business applications, automation, and AI-assisted tools.",
    },
  ];
}

// Placeholder entries — replace with real project details.
const projects: Project[] = [
  {
    title: "Small business website",
    category: "Website",
    description:
      "A fast, modern marketing site with clear messaging and a contact flow that brings in leads.",
    tags: ["React Router", "Tailwind CSS", "Responsive"],
    link: null,
  },
  {
    title: "Client management tool",
    category: "Business application",
    description:
      "A CRM-style internal app that replaced scattered spreadsheets with a single source of truth.",
    tags: ["TypeScript", "Dashboard", "Reporting"],
    link: null,
  },
  {
    title: "Workflow automation",
    category: "Automation",
    description:
      "Automated handoffs between everyday tools, cutting hours of manual data entry each week.",
    tags: ["Integrations", "Scheduling", "Notifications"],
    link: null,
  },
  {
    title: "AI assistant",
    category: "AI-assisted tool",
    description:
      "A focused assistant that drafts and summarizes content using a team's own documents.",
    tags: ["AI", "Summarization", "Q&A"],
    link: null,
  },
];

export default function Projects() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <PageHeader
        eyebrow="Recent work"
        title="Projects"
        description="A selection of work across websites, business tools, automation, and AI. More details available on request."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>

      <CTA
        variant="bar"
        className="mt-12"
        title="Want to see something specific or discuss a project?"
        actionLabel="Get in touch"
        actionTo="/contact"
      />
    </div>
  );
}
