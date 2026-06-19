import { Link } from "react-router";
import {
  ArrowRight,
  Check,
  Code2,
  LifeBuoy,
  Network,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { HeroVisual } from "~/components/hero-visual";
import { TechMarquee } from "~/components/tech-marquee";
import { ProjectCard, type Project } from "~/components/project-card";
import { GithubIcon } from "~/components/icons";
import { siteMeta } from "~/lib/site-meta";

export function meta({}: Route.MetaArgs) {
  return siteMeta({
    title: "Sims Digital Partners — Cody Sims, software developer",
    description:
      "Cody Sims — software support engineer and developer. Application development, system integration, automation, and technical support, built on practical, dependable engineering.",
    path: "/",
  });
}

interface Capability {
  icon: LucideIcon;
  title: string;
  description: string;
  tech: string[];
}

const capabilities: Capability[] = [
  {
    icon: Code2,
    title: "Application Development",
    description:
      "Building applications end to end — data models, APIs, and the interfaces people actually use — with an eye toward keeping them reliable and maintainable.",
    tech: ["React", "TypeScript", "Laravel", "Python", "REST APIs", "PostgreSQL"],
  },
  {
    icon: Network,
    title: "System Integration",
    description:
      "Connecting systems and services so data moves cleanly between them, replacing manual handoffs with structured, dependable interfaces.",
    tech: ["REST APIs", "Webhooks", "Auth", "Databases", "Docker"],
  },
  {
    icon: Workflow,
    title: "Automation",
    description:
      "Turning repetitive, error-prone tasks into automated, observable processes so time goes toward more useful work.",
    tech: ["Python", "Bash", "CI/CD", "GitHub Actions", "Ansible"],
  },
  {
    icon: LifeBuoy,
    title: "Technical Support & Operations",
    description:
      "Troubleshooting issues, supporting the people who rely on software, and helping keep systems healthy with clear logging, monitoring, and follow-through.",
    tech: ["Debugging", "Logging", "Monitoring", "Linux", "AWS", "Azure"],
  },
];

const GITHUB_PROFILE = "https://github.com/cody-sims-git-hub";
const SENTINEL_VISION_REPO =
  "https://github.com/cody-sims-git-hub/Sentinel-Vision";
const SIMPLECRM_REPO = "https://github.com/cody-sims-git-hub/simple-crm";
const SIMPLECRM_DEMO = "https://demo.simsdigitalpartners.com";

const featured: Project[] = [
  {
    title: "Sentinel Vision",
    category: "Computer vision",
    description:
      "A real-time object detection platform built on a YOLOv8m model with CUDA-accelerated training. A hands-on exploration of computer vision and AI/LLM workflows using PyTorch and OpenCV.",
    tags: ["YOLOv8m", "PyTorch", "CUDA", "OpenCV", "Computer vision"],
    links: [{ label: "GitHub", href: SENTINEL_VISION_REPO, kind: "github" }],
  },
  {
    title: "SimpleCRM",
    category: "Web application",
    description:
      "A customer relationship management application built with Laravel — lead tracking, dashboard reporting, authentication, and full CRUD workflows on a modern Laravel stack.",
    tags: ["Laravel", "PHP", "MySQL", "Auth", "CRUD"],
    links: [
      { label: "GitHub", href: SIMPLECRM_REPO, kind: "github" },
      { label: "Live demo", href: SIMPLECRM_DEMO, kind: "demo" },
    ],
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
      {children}
    </p>
  );
}

function CapabilityBlock({
  icon: Icon,
  title,
  description,
  tech,
  index,
}: Capability & { index: number }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-colors hover:border-primary/40 sm:p-8">
      <div
        aria-hidden
        className="absolute -top-16 left-1/3 h-40 w-40 rounded-full bg-primary/20 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
            <Icon className="size-5" />
          </span>
          <div>
            <span className="font-mono text-xs text-muted-foreground/70">
              {String(index).padStart(2, "0")}
            </span>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h3>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
          {tech.map((t) => (
            <span
              key={t}
              className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* HERO — the global VideoBackground shows through here */}
      <section className="relative overflow-x-clip">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <div className="animate-fade-up">
              <Eyebrow>Building practical software &amp; systems</Eyebrow>
            </div>
            <h1
              className="animate-fade-up mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl"
              style={{ animationDelay: "0.08s" }}
            >
              Bridging today's technology with{" "}
              <span className="text-gradient">tomorrow's possibilities</span>.
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
              style={{ animationDelay: "0.16s" }}
            >
              I'm Cody Sims — a software support engineer and developer. I build
              websites, business applications, workflow automation, and
              software systems, with a focus on work that's well-made and
              genuinely useful.
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "0.24s" }}
            >
              <Button asChild size="lg">
                <a href="#projects">
                  See recent work <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Get in touch</Link>
              </Button>
            </div>
            <ul
              className="animate-fade-up mt-8 flex flex-wrap gap-x-6 gap-y-2"
              style={{ animationDelay: "0.32s" }}
            >
              {[
                "End-to-end ownership",
                "Reliable, well-built results",
                "Clear communication",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="size-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <HeroVisual />
          </div>
        </div>
      </section>

      <TechMarquee />

      {/* CAPABILITIES */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="max-w-2xl">
          <Eyebrow>Capabilities</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Areas of hands-on experience
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The areas where I've spent the most time building, supporting, and
            learning — through personal projects, professional work, and ongoing
            study.
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {capabilities.map((cap, i) => (
            <CapabilityBlock key={cap.title} index={i + 1} {...cap} />
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section
        id="projects"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-24 sm:px-6"
      >
        <div className="max-w-2xl">
          <Eyebrow>Recent work</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Featured projects
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            A look at projects I've built, from computer vision to full-stack web
            applications. Source and live demos are linked where available.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        {/* More projects in development */}
        <div className="mt-5 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                More projects in development
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Additional software projects, experiments, and research work are
                actively in development. I'll add them here as they mature.
              </p>
            </div>
            <Button asChild variant="outline">
              <a href={GITHUB_PROFILE} target="_blank" rel="noreferrer">
                <GithubIcon className="size-4" /> View GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA — invite project conversations */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 px-6 py-12 text-center backdrop-blur-sm sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-[-8rem] mx-auto h-64 w-[36rem] rounded-full bg-primary/20 blur-[100px]"
          />
          <h2 className="relative text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Have a project in mind?
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-muted-foreground">
            I'm available for select website, application, and automation
            projects. Whether you're launching something new, improving an
            existing process, or exploring ways technology can save time and
            create value, I'd be happy to start a conversation.
          </p>
          <div className="relative mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/contact">
                Discuss a project <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="mailto:info@simsdigitalpartners.com">Get in touch</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
