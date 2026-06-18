import { Link } from "react-router";
import { ArrowRight, FileText } from "lucide-react";
import type { Route } from "./+types/about";
import { Button } from "~/components/ui/button";
import { PageHeader } from "~/components/page-header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About — Sims Digital Partners" },
    {
      name: "description",
      content:
        "About Cody Sims — a software developer focused on building practical, well-made tools for small businesses.",
    },
  ];
}

const principles = [
  {
    title: "Practical over flashy",
    body: "I build for the problem in front of you, not for a portfolio screenshot. The right solution is the one that actually gets used.",
  },
  {
    title: "Clear communication",
    body: "Direct updates, plain language, and honest timelines. You'll always know where things stand.",
  },
  {
    title: "Built to last",
    body: "Clean, maintainable code so what I build keeps working — and stays easy to change as your needs grow.",
  },
];

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <PageHeader
        eyebrow="About"
        title="Hi, I'm Cody Sims"
        description="A software developer focused on building practical, well-made tools for small businesses and teams."
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground lg:col-span-2">
          <p>
            I'm a software developer who builds practical websites, business
            applications, workflow automation, and AI-assisted tools. Sims
            Digital Partners is how I work with small businesses and teams who
            need software that earns its keep.
          </p>
          <p>
            My focus is simple: understand the real problem, then build the most
            straightforward thing that solves it well. That usually means a
            clean website, a tool that replaces a messy spreadsheet, or an
            automation that quietly removes hours of repetitive work.
          </p>
          <p>
            I care about doing solid, honest work — code that's maintainable,
            communication that's clear, and results you can actually measure.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link to="/contact">
                Work with me <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/resume">
                <FileText className="size-4" /> View resume
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {principles.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5"
            >
              <h3 className="font-medium text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
