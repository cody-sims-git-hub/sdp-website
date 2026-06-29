import type { LucideIcon } from "lucide-react";
import { AppWindow, Globe, Sparkles, Workflow } from "lucide-react";

export interface ServiceFeature {
  title: string;
  description: string;
}

/** A "where this can grow" path that cross-links to another service. */
export interface ServiceGrowthPath {
  /** Slug of the service this path points to. */
  slug: string;
  title: string;
  description: string;
}

export interface ServiceGrowth {
  title: string;
  intro: string;
  paths: ServiceGrowthPath[];
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
  /** Optional "where this can grow" section that cross-links to other services. */
  growth?: ServiceGrowth;
}

export const services: Service[] = [
  {
    slug: "business-websites",
    icon: Globe,
    title: "Business Websites",
    headline:
      "A professional website that helps customers find you, see who you are, and get in touch.",
    description:
      "A clean, fast website that introduces your business, helps people find you online, and makes it easy to get in touch — the foundation you can build on as you grow.",
    tags: ["Responsive", "SEO", "AI Discoverability", "Fast Loading", "Contact Forms", "Hosting"],
    metaTitle: "Business Website Design | Sims Digital Partners",
    metaDescription:
      "A professional brochure website that helps customers find you on search and AI assistants, see who you are, and get in touch — fast, modern, and built to grow.",
    summary: [
      "Think of this as your business's home online — a polished site whose job is to help people find you, understand what you do, and reach you without friction. It loads fast, looks right on every phone and laptop, and is built so search engines and AI assistants can read it and point customers your way.",
      "A site like this is often called a brochure site: it introduces your business and sends inquiries straight to you — messages land right in your inbox, or in a CRM you already use, with no new system to log into. When you're ready to do more — take bookings, sell online, or automate the follow-up — that's where a website grows into a web application, and that can be built for you too.",
    ],
    features: [
      {
        title: "Fast, on every device",
        description:
          "Pages load quickly and look professional on phones, tablets, and computers — a strong first impression every time.",
      },
      {
        title: "Easy to find online",
        description:
          "Structured for search so customers looking for what you offer can actually find you, with the on-page SEO fundamentals handled.",
      },
      {
        title: "Ready for AI search",
        description:
          "Most sites still only do SEO. But customers are shifting from Google to AI assistants like ChatGPT — your site is built to be discoverable there too, so you get recommended where competitors aren't.",
      },
      {
        title: "Inquiries straight to you",
        description:
          "A contact form that sends messages right to your inbox — or the CRM you already use. No database, no new system to manage; people just reach you.",
      },
    ],
    process: ["Discovery & goals", "Design & content", "Build & review", "Launch & measure"],
    growth: {
      title: "Built to grow with you",
      intro:
        "A brochure site gets you found and tells your story. When you're ready to do more than introduce yourself, the same foundation can grow into a web application built around how you work.",
      paths: [
        {
          slug: "workflow-automation",
          title: "Automate the follow-up",
          description:
            "Automatic email replies, appointment reminders, and routine messages that go out on their own — so customers hear back even when you're busy.",
        },
        {
          slug: "custom-software",
          title: "Add a portal or store",
          description:
            "An online store, customer logins, or an internal portal for your team — the features that turn a website into an application built around your business.",
        },
      ],
    },
  },
  {
    slug: "workflow-automation",
    icon: Workflow,
    title: "Workflow Automation",
    headline: "Reduce repetitive work with automation",
    description:
      "Automate manual processes, notifications, reporting, and data entry, set up online booking, and connect the tools you already use — so your team spends less time on repetitive tasks and more on valuable work.",
    tags: ["Automation", "Integrations", "Online Booking", "Workflows", "Reporting"],
    metaTitle: "Workflow Automation & Integration | Sims Digital Partners",
    metaDescription:
      "Workflow automation and integration services — set up online booking, automate reminders, reporting, notifications, and data entry, and connect the tools your team already uses.",
    summary: [
      "Most teams lose hours every week to repetitive, manual work — copying data between tools, sending the same updates, compiling the same reports. Automation handles that work reliably in the background.",
      "We map out the processes that slow your team down and connect the tools you already use — booking, email, spreadsheets, and CRM systems — so data moves cleanly and runs consistently. That includes setting up online booking so customers can schedule themselves, with the reminders and follow-ups handled automatically.",
    ],
    features: [
      {
        title: "Process automation",
        description:
          "Replace manual, repetitive steps with automated workflows that run reliably and consistently.",
      },
      {
        title: "Online booking & scheduling",
        description:
          "Set up booking tools like Calendly or Google and Microsoft Bookings so customers can schedule themselves — then automate the confirmations, reminders, and follow-ups so fewer slip through and no-shows drop.",
      },
      {
        title: "Tool integrations & syncing",
        description:
          "Connect the apps and services you already use so data flows between them automatically — kept accurate and in sync across systems, without manual handoffs or copy-and-paste.",
      },
      {
        title: "Reporting & notifications",
        description:
          "Automatic reports, alerts, and updates delivered where your team already works.",
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
    headline:
      "Web applications built around how your business actually works — portals, stores, dashboards, and the operations behind them.",
    description:
      "When spreadsheets and off-the-shelf tools no longer keep up, a custom web application puts your store, portals, records, and daily operations in one system — built around how your business actually works.",
    tags: ["Customer Portals", "Online Stores", "Stripe", "Dashboards", "Databases", "CRM"],
    metaTitle: "Custom Web Application Development | Sims Digital Partners",
    metaDescription:
      "Custom web applications built around your business — customer and employee portals, online stores with Stripe payments, internal tools, dashboards, and CRM systems that replace the spreadsheet patchwork.",
    summary: [
      "Most businesses start with a patchwork — a spreadsheet here, an off-the-shelf tool there, a few manual steps holding it together. It works until it doesn't: information lives in too many places, the same data gets entered twice, and the workarounds start costing real time.",
      "A custom web application replaces that patchwork with one system built around how you actually work. This is the step beyond a brochure site — where a website stops just showing information and starts doing things: giving customers a place to log in, selling your products, or giving your team a dashboard to run the day. It's built around your process, not a template you bend to fit.",
    ],
    features: [
      {
        title: "Customer & employee portals",
        description:
          "A secure place for customers to log in and manage their account, or for your team to access the tools and information they need to do their work.",
      },
      {
        title: "Online store with Stripe payments",
        description:
          "A storefront where you manage your products and customers check out securely — Stripe handles the payments and card data, so the sensitive part isn't yours to worry about.",
      },
      {
        title: "Internal tools & operations",
        description:
          "Replace the spreadsheet-and-sticky-note patchwork with one system that fits your process, so data is entered once and the day-to-day runs in one place.",
      },
      {
        title: "Dashboards & records",
        description:
          "Your information centralized and organized — records, reporting, and clear views into what's happening so you can make decisions with confidence.",
      },
    ],
    process: ["Understand the process", "Design the system", "Build iteratively", "Launch & support"],
    growth: {
      title: "Built to grow with you",
      intro:
        "Once your application is in place, it's a foundation you can keep building on. Two of the most common additions:",
      paths: [
        {
          slug: "workflow-automation",
          title: "Automate the busywork",
          description:
            "Reminders, follow-up emails, online booking, and routine updates that happen on their own — so the system keeps things moving without anyone lifting a finger.",
        },
        {
          slug: "ai-integration",
          title: "Add an AI assistant",
          description:
            "A chatbot that helps visitors find what they need, answer common questions, or book an appointment right inside your site — guided, in plain language.",
        },
      ],
    },
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
