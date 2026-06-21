import type { LucideIcon } from "lucide-react";
import { AppWindow, Globe, Sparkles, Workflow } from "lucide-react";

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface Service {
  /** URL slug — the detail page lives at /services/<slug>. */
  slug: string;
  icon: LucideIcon;
  /** Short service name (card heading). */
  title: string;
  /** Benefit-oriented headline. */
  headline: string;
  /** One-line summary used on the home and index cards. */
  description: string;
  /** Technologies / keywords shown as pills. */
  tags: string[];
  /** SEO <title> for the detail page. */
  metaTitle: string;
  /** SEO meta description for the detail page. */
  metaDescription: string;
  /** Intro paragraphs on the detail page. */
  summary: string[];
  /** "What's included" feature list. */
  features: ServiceFeature[];
  /** Optional high-level process steps. */
  process?: string[];
}

export const services: Service[] = [
  {
    slug: "business-websites",
    icon: Globe,
    title: "Business Websites",
    headline: "Websites that help businesses get found and get contacted",
    description:
      "Modern, fast-loading websites built for credibility, search visibility, and lead generation. From simple business sites to custom web applications, designed to work across desktop and mobile.",
    tags: ["Next.js", "React", "SEO", "Analytics", "Hosting", "Forms"],
    metaTitle: "Business Website Design & Development | Sims Digital Partners",
    metaDescription:
      "Custom business websites built for speed, search visibility, and lead generation — responsive, modern sites and web applications for small businesses.",
    summary: [
      "Your website is often the first impression a potential customer has of your business. We build fast, modern websites that load quickly, look professional on every device, and are structured to help people find you and get in touch.",
      "Whether you need a straightforward marketing site or a more involved web application, the focus is on clean design, solid performance, and the technical fundamentals — accessibility, SEO, and analytics — that help a site actually do its job.",
    ],
    features: [
      {
        title: "Modern, responsive design",
        description:
          "Clean layouts that work across desktop, tablet, and mobile, built to reflect your brand and earn trust.",
      },
      {
        title: "Built for search & speed",
        description:
          "Fast load times, semantic markup, and on-page SEO so your site is easy to find and pleasant to use.",
      },
      {
        title: "Lead capture",
        description:
          "Contact forms, scheduling, and clear calls to action that turn visitors into conversations.",
      },
      {
        title: "Analytics & hosting",
        description:
          "Analytics setup to understand your traffic, plus guidance on reliable, low-maintenance hosting.",
      },
    ],
    process: ["Discovery & goals", "Design & content", "Build & review", "Launch & measure"],
  },
  {
    slug: "workflow-automation",
    icon: Workflow,
    title: "Workflow Automation",
    headline: "Reduce repetitive work with automation",
    description:
      "Automate manual processes, notifications, reporting, data entry, and business workflows so your team spends less time on repetitive tasks and more time on valuable work.",
    tags: ["Automation", "Integrations", "Workflows", "APIs", "Reporting"],
    metaTitle: "Workflow Automation Services | Sims Digital Partners",
    metaDescription:
      "Workflow automation services — automate repetitive tasks, reporting, notifications, and data entry to save your team time and reduce errors.",
    summary: [
      "Most teams lose hours every week to repetitive, manual work — copying data between tools, sending the same updates, compiling the same reports. Automation handles that work reliably in the background.",
      "We map out the processes that slow your team down and build automations that connect your existing tools, move data cleanly, and run consistently — so people can spend their time on the work that actually needs them.",
    ],
    features: [
      {
        title: "Process automation",
        description:
          "Replace manual, repetitive steps with automated workflows that run reliably and consistently.",
      },
      {
        title: "Tool integrations",
        description:
          "Connect the apps and services you already use so data flows between them without manual handoffs.",
      },
      {
        title: "Reporting & notifications",
        description:
          "Automatic reports, alerts, and updates delivered where your team already works.",
      },
      {
        title: "Data entry & syncing",
        description:
          "Keep records accurate and up to date across systems without copy-and-paste.",
      },
    ],
    process: ["Map the workflow", "Identify what to automate", "Build & test", "Monitor & refine"],
  },
  {
    slug: "ai-integration",
    icon: Sparkles,
    title: "AI Integration",
    headline: "Add AI to existing systems",
    description:
      "Integrate AI assistants, document search, chat interfaces, and intelligent workflows into existing business processes without replacing the tools you already use.",
    tags: ["LLMs", "Chatbots", "Knowledge Bases", "RAG", "AI Assistants"],
    metaTitle: "AI Integration Services | Sims Digital Partners",
    metaDescription:
      "AI integration services — add AI assistants, chatbots, document search, and RAG-powered tools to your existing systems and workflows.",
    summary: [
      "AI is most useful when it fits into the tools and processes you already rely on, rather than replacing them. The goal is practical: solve a real problem, not add complexity for its own sake.",
      "We integrate AI assistants, chat interfaces, and document search into existing systems — grounded in your own data so answers stay relevant and trustworthy. That includes retrieval-augmented generation (RAG), so an assistant can draw on your documents and knowledge base.",
    ],
    features: [
      {
        title: "AI assistants & chatbots",
        description:
          "Conversational interfaces that answer questions and help users get things done, on your site or internal tools.",
      },
      {
        title: "Document search & RAG",
        description:
          "Search and question-answering grounded in your own documents, so responses stay accurate and relevant.",
      },
      {
        title: "Knowledge bases",
        description:
          "Turn scattered documents and information into a searchable, genuinely useful resource.",
      },
      {
        title: "Fits your existing tools",
        description:
          "AI added into the systems you already use, without forcing a migration or a rebuild.",
      },
    ],
    process: ["Identify the use case", "Connect your data", "Build & evaluate", "Integrate & iterate"],
  },
  {
    slug: "custom-software",
    icon: AppWindow,
    title: "Custom Software & Applications",
    headline: "Software built around your process",
    description:
      "When spreadsheets and off-the-shelf software no longer fit, custom applications can streamline operations, centralize data, and support the way your business actually works.",
    tags: ["Web Apps", "Databases", "Dashboards", "APIs", "CRM Systems"],
    metaTitle: "Custom Software & Web App Development | Sims Digital Partners",
    metaDescription:
      "Custom software and web application development — bespoke apps, dashboards, databases, and CRM tools built around how your business actually works.",
    summary: [
      "When spreadsheets and off-the-shelf tools stop keeping up, custom software can fit your process exactly — centralizing data, removing workarounds, and supporting the way your team actually works.",
      "We build web applications, internal tools, dashboards, and database-backed systems end to end — from data model to interface — with a focus on something reliable and maintainable that you can grow into.",
    ],
    features: [
      {
        title: "Web applications",
        description:
          "Custom apps and internal tools built around your specific workflow, not a generic template.",
      },
      {
        title: "Databases & data models",
        description:
          "Well-structured data so information stays consistent, queryable, and trustworthy.",
      },
      {
        title: "Dashboards & reporting",
        description:
          "Clear views into your data so you can see what's happening and make decisions.",
      },
      {
        title: "CRM & business tools",
        description:
          "Lead tracking, records, and process tools tailored to how you operate.",
      },
    ],
    process: ["Understand the process", "Design the system", "Build iteratively", "Launch & support"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
