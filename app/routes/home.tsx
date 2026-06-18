import { Link } from "react-router";
import {
  ArrowRight,
  Bot,
  Check,
  Globe,
  LayoutGrid,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { Route } from "./+types/home";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { HeroVisual } from "~/components/hero-visual";
import { TechMarquee } from "~/components/tech-marquee";
import { ProjectCard, type Project } from "~/components/project-card";
import { CTA } from "~/components/cta";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sims Digital Partners — Software development & automation" },
    {
      name: "description",
      content:
        "Cody Sims builds practical websites, business applications, workflow automation, and AI-assisted tools for small businesses.",
    },
  ];
}

interface Capability {
  icon: LucideIcon;
  title: string;
  description: string;
  points?: string[];
  wide?: boolean;
}

const capabilities: Capability[] = [
  {
    icon: Globe,
    title: "Websites for small businesses",
    description:
      "Fast, modern marketing sites that make a business look credible and turn visitors into customers.",
    points: ["Responsive & SEO-ready", "Clear messaging", "Easy to maintain"],
    wide: true,
  },
  {
    icon: LayoutGrid,
    title: "Business applications",
    description:
      "CRM-style internal tools that replace spreadsheets with a single source of truth.",
  },
  {
    icon: Workflow,
    title: "Workflow automation",
    description:
      "Connect the tools you already use and remove the repetitive work in between.",
  },
  {
    icon: Bot,
    title: "AI-assisted tools",
    description:
      "Practical AI features that save real time — drafting, summarizing, and answering questions from your own data.",
    points: ["Document Q&A", "Content generation", "Built around your process"],
    wide: true,
  },
];

const stats = [
  { value: "4", label: "Service areas, one developer" },
  { value: "100%", label: "Custom-built — no templates" },
  { value: "<24h", label: "Typical first reply" },
  { value: "1:1", label: "Work directly with me" },
];

const steps = [
  {
    n: "01",
    title: "Discover",
    text: "We talk through the problem, goals, and constraints so the scope is clear from the start.",
  },
  {
    n: "02",
    title: "Build",
    text: "I design and develop in focused iterations, sharing progress as it comes together.",
  },
  {
    n: "03",
    title: "Ship",
    text: "You get a polished, deployed result — with a clean handoff and support after launch.",
  },
];

const featured: Project[] = [
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
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
      {children}
    </p>
  );
}

function BentoCard({ icon: Icon, title, description, points, wide }: Capability) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card",
        wide && "lg:col-span-2",
      )}
    >
      <div
        aria-hidden
        className="absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/25 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative">
        <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
          <Icon className="size-5" />
        </span>
        <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        {points && (
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {points.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check className="size-4 shrink-0 text-primary" />
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* HERO — the global VideoBackground shows through here */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <div className="animate-fade-up">
              <Eyebrow>Available for new projects</Eyebrow>
            </div>
            <h1
              className="animate-fade-up mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl"
              style={{ animationDelay: "0.08s" }}
            >
              Practical software that{" "}
              <span className="text-gradient">moves your business</span>{" "}
              forward.
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
              style={{ animationDelay: "0.16s" }}
            >
              I'm Cody Sims — a software developer building websites, business
              applications, workflow automation, and AI-assisted tools. Focused,
              well-built, and made to solve real problems.
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "0.24s" }}
            >
              <Button asChild size="lg">
                <Link to="/contact">
                  Start a project <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/projects">See recent work</Link>
              </Button>
            </div>
            <ul
              className="animate-fade-up mt-8 flex flex-wrap gap-x-6 gap-y-2"
              style={{ animationDelay: "0.32s" }}
            >
              {[
                "End-to-end ownership",
                "Clean, maintainable code",
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

          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <HeroVisual />
          </div>
        </div>
      </section>

      <TechMarquee />

      {/* CAPABILITIES */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="max-w-2xl">
          <Eyebrow>What I do</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Capabilities built around what businesses actually need
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            A focused set of services — from the website customers see to the
            tools your team runs on.
          </p>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {capabilities.map((cap) => (
            <BentoCard key={cap.title} {...cap} />
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border/70 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-background/40 p-6 backdrop-blur-sm">
              <div className="font-mono text-3xl font-semibold text-foreground sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A simple, transparent process
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className="relative rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm"
            >
              <div className="font-mono text-sm text-primary">{step.n}</div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <Eyebrow>Recent work</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Selected projects
            </h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/projects">
              View all <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <CTA
          title="Have something you want built?"
          description="Tell me what you're working on. I'll let you know how I can help and what it would take."
          actionLabel="Get in touch"
          actionTo="/contact"
        />
      </section>
    </>
  );
}
