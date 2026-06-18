import { Award, FileText, GraduationCap, Shield, Sparkles } from "lucide-react";
import type { Route } from "./+types/resume";
import { Button } from "~/components/ui/button";
import { PageHeader } from "~/components/page-header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume — Sims Digital Partners" },
    {
      name: "description",
      content:
        "Resume for Cody Sims — software developer focused on AI applications, automation, cloud, and cybersecurity.",
    },
  ];
}

const summary =
  "Recent graduate with a B.S. in Information and Cybersecurity Operations and an NVIDIA certification in Building Agentic AI Applications with Large Language Models. Accepted to Georgetown University's M.P.S. in Artificial Intelligence Management (expected 2027). Hands-on experience building AI-powered applications and working across cloud, cybersecurity, DevSecOps, automation, and modern software development — combining military leadership and business-ownership experience into a disciplined, analytical approach to solving complex problems.";

const highlights = [
  "B.S. Information & Cybersecurity Operations",
  "NVIDIA Agentic AI Certification",
  "Georgetown M.P.S. AI Management (2027)",
  "U.S. Marine Corps veteran",
];

const education = [
  {
    credential: "M.P.S., Artificial Intelligence Management",
    school: "Georgetown University · Remote",
    period: "2026 – 2027 (expected)",
    points: [
      "Accepted to Georgetown's Master of Professional Studies in AI Management.",
    ],
  },
  {
    credential: "B.S., Information and Cybersecurity Operations",
    school: "ECPI University · Greensboro, NC",
    period: "2019 – 2026",
    points: [
      "Cybersecurity operations, network infrastructure, systems administration, and cloud security.",
      "Hands-on labs in ethical hacking, vulnerability assessment, incident response, and digital forensics.",
      "Applied AI/ML, cloud technologies, and DevSecOps across academic technical labs.",
    ],
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
};

const credentials = [
  {
    title: "Building Agentic AI Applications with Large Language Models",
    issuer: "NVIDIA",
    period: "2025",
    detail:
      "Building agentic AI applications using LLM workflows, orchestration concepts, and modern AI development practices.",
  },
  {
    title: "Dean's List",
    issuer: "ECPI University",
    period: "2025",
    detail:
      "Recognized for exceptional academic achievement (May–September 2025).",
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
        description="Software developer — AI applications, automation, cloud, and cybersecurity."
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
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
