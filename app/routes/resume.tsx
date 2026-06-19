import {
  Award,
  Briefcase,
  ExternalLink,
  FileText,
  GraduationCap,
  Shield,
  Sparkles,
} from "lucide-react";
import type { Route } from "./+types/resume";
import { Button } from "~/components/ui/button";
import { PageHeader } from "~/components/page-header";
import { siteMeta } from "~/lib/site-meta";

export function meta({}: Route.MetaArgs) {
  return siteMeta({
    title: "Resume — Sims Digital Partners",
    description:
      "Résumé for Cody Sims — software support engineer and developer, U.S. Marine Corps veteran, and incoming Georgetown M.P.S. in Artificial Intelligence Management.",
    path: "/resume",
  });
}

const summary =
  "Recent graduate with a B.S. in Information and Cybersecurity Operations and an NVIDIA certification in building applications powered by large language models. Accepted to Georgetown University's M.P.S. in Artificial Intelligence Management (expected 2027). Hands-on experience building AI-powered applications and working across cloud, cybersecurity, DevSecOps, automation, and modern software development — combining military leadership and business-ownership experience into a disciplined, analytical approach to solving complex problems.";

const highlights = [
  "B.S. Information & Cybersecurity Operations",
  "Graduated Cum Laude",
  "NVIDIA LLM Application Development",
  "Georgetown M.P.S. AI Management (2027)",
  "U.S. Marine Corps veteran",
];

const experience = [
  {
    role: "Software Support Engineer",
    company: "Preferred Data Corporation · High Point, NC",
    period: "Jun 2026 – Present",
    summary:
      "Read, debug, extend, and maintain custom software supporting customer business operations — investigating issues through code analysis and SQL/database troubleshooting, resolving support tickets, and building scripts and automations to improve reliability and efficiency.",
  },
  {
    role: "Owner / Independent Insurance Agent",
    company: "Sims Insurance Partners LLC · Kernersville, NC",
    period: "Sep 2025 – Present",
    summary:
      "Operate an independent insurance business serving senior clients with life insurance and Medicare solutions — managing client relationships, operations, and compliance end to end.",
  },
  {
    role: "Licensed Independent Insurance Agent",
    company: "The Assurance Group · Archdale, NC",
    period: "Jun 2020 – Sep 2025",
    summary:
      "Built and managed a client base of 600+ through direct outreach, referrals, and educational seminars, earning Chairman's Club recognition for top production.",
  },
];

const education = [
  {
    credential: "M.P.S., Artificial Intelligence Management",
    school: "Georgetown University · Remote",
    period: "2026 – 2027 (expected)",
    points: [
      "Accepted to Georgetown's Master of Professional Studies in AI Management.",
    ],
    link: null,
  },
  {
    credential: "B.S., Information and Cybersecurity Operations",
    school: "ECPI University · Greensboro, NC",
    period: "2019 – 2026",
    points: [
      "Graduated Cum Laude.",
      "Cybersecurity operations, network infrastructure, systems administration, and cloud security.",
      "Hands-on labs in ethical hacking, vulnerability assessment, incident response, and digital forensics.",
      "Applied AI/ML, cloud technologies, and DevSecOps across academic technical labs.",
    ],
    link: "/ecpi-diploma.pdf",
  },
];

const military = {
  role: "Corporal · United States Marine Corps",
  period: "2015 – 2019",
  points: [
    "Infantry Rifleman leading in high-pressure, team-oriented environments — responsible for team coordination, accountability, and mission-critical execution.",
    "Served with an Intelligence Battalion as an 8621 Ground Sensor Surveillance Operator (secondary MOS), operating sensor systems for monitoring and intelligence gathering.",
  ],
  commendations: [
    "Good Conduct Medal",
    "Global War on Terrorism Service Medal",
    "National Defense Service Medal",
    "Humanitarian Service Medal",
    "Sea Service Deployment Ribbon",
    "Expert Rifle Badge",
    "Expert Pistol Badge",
  ],
  link: "/usmc-corporal-promotion.pdf",
};

const credentials = [
  {
    title: "Building Agentic AI Applications with Large Language Models",
    issuer: "NVIDIA",
    period: "2025",
    detail:
      "Building practical applications powered by large language models — LLM workflows, orchestration concepts, and modern AI development practices.",
    link: "/nvidia-agentic-ai-certificate.pdf",
  },
  {
    title: "Dean's List",
    issuer: "ECPI University",
    period: "2025",
    detail:
      "Recognized for exceptional academic achievement (May–September 2025).",
    link: "/deans-list-certificate.pdf",
  },
];

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: typeof Award;
  children: React.ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
      <Icon className="size-4 text-primary" />
      {children}
    </h2>
  );
}

export default function Resume() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <PageHeader
        eyebrow="Resume"
        title="Cody Sims"
        description="Software Support Engineer, Developer, and AI Management Graduate Student."
        action={
          <Button asChild variant="outline">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <FileText className="size-4" /> View résumé (PDF)
            </a>
          </Button>
        }
      />

      <div className="mt-12 space-y-12">
        {/* Professional summary */}
        <section>
          <SectionLabel icon={Sparkles}>Professional summary</SectionLabel>
          <div className="mt-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6">
            <p className="text-base leading-relaxed text-muted-foreground">
              {summary}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-sm text-foreground backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Work experience */}
        <section>
          <SectionLabel icon={Briefcase}>Work experience</SectionLabel>
          <div className="mt-5 space-y-4">
            {experience.map((item) => (
              <div
                key={item.company}
                className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium text-foreground">{item.role}</h3>
                  <span className="font-mono text-sm text-muted-foreground">
                    {item.period}
                  </span>
                </div>
                <p className="mt-1 text-sm text-primary">{item.company}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <SectionLabel icon={GraduationCap}>Education</SectionLabel>
          <div className="mt-5 space-y-4">
            {education.map((item) => (
              <div
                key={item.credential}
                className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium text-foreground">
                    {item.credential}
                  </h3>
                  <span className="font-mono text-sm text-muted-foreground">
                    {item.period}
                  </span>
                </div>
                <p className="mt-1 text-sm text-primary">{item.school}</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="size-4" /> View diploma
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Military service */}
        <section>
          <SectionLabel icon={Shield}>Military service</SectionLabel>
          <div className="mt-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-medium text-foreground">{military.role}</h3>
              <span className="font-mono text-sm text-muted-foreground">
                {military.period}
              </span>
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
              {military.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {military.commendations.map((item) => (
                <span
                  key={item}
                  className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
            {military.link && (
              <a
                href={military.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <ExternalLink className="size-4" /> View promotion warrant
              </a>
            )}
          </div>
        </section>

        {/* Awards & certifications */}
        <section>
          <SectionLabel icon={Award}>Awards &amp; certifications</SectionLabel>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {credentials.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-primary">
                    {item.issuer}
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {item.period}
                  </span>
                </div>
                <h3 className="mt-2 font-medium text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="size-4" /> View certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
