import { Bot, Globe, LayoutGrid, Workflow } from "lucide-react";
import type { Route } from "./+types/services";
import { PageHeader } from "~/components/page-header";
import { ServiceCard } from "~/components/service-card";
import { CTA } from "~/components/cta";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Services — Sims Digital Partners" },
    {
      name: "description",
      content:
        "Websites, business applications, workflow automation, and AI-assisted tools for small businesses.",
    },
  ];
}

const services = [
  {
    icon: Globe,
    title: "Websites for small businesses",
    description:
      "A professional online presence that loads fast, looks credible, and turns visitors into customers.",
    points: [
      "Modern, responsive marketing sites",
      "Clear messaging and strong calls to action",
      "SEO-friendly and easy to maintain",
    ],
  },
  {
    icon: LayoutGrid,
    title: "Business applications & CRM-style tools",
    description:
      "Custom internal tools that replace spreadsheets and bring your data into one place.",
    points: [
      "Client, lead, and inventory tracking",
      "Dashboards and reporting",
      "Tailored to how your business actually works",
    ],
  },
  {
    icon: Workflow,
    title: "Workflow automation",
    description:
      "Remove repetitive manual work by connecting the tools you already use.",
    points: [
      "Automated data entry and notifications",
      "Integrations between apps and services",
      "Scheduled and trigger-based workflows",
    ],
  },
  {
    icon: Bot,
    title: "AI-assisted tools",
    description: "Practical AI features that save real time without the hype.",
    points: [
      "Drafting, summarizing, and content generation",
      "Document and data Q&A",
      "Assistants built around your processes",
    ],
  },
];

export default function Services() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <PageHeader
        eyebrow="Services"
        title="Built to solve practical problems"
        description="Whether you need a website, an internal tool, or a way to cut down on busywork, the goal is the same: software that's useful from day one."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>

      <CTA
        variant="bar"
        className="mt-12"
        title="Not sure which of these fits? Let's talk through it."
        actionLabel="Get in touch"
        actionTo="/contact"
      />
    </div>
  );
}
