import { Mail } from "lucide-react";
import type { Route } from "./+types/contact";
import { PageHeader } from "~/components/page-header";
import { ContactForm } from "~/components/contact-form";
import { GithubIcon, LinkedinIcon } from "~/components/icons";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact — Sims Digital Partners" },
    {
      name: "description",
      content:
        "Get in touch with Cody Sims — about a website, application, or automation project, an opportunity, or to connect professionally.",
    },
  ];
}

const CONTACT_EMAIL = "info@simsdigitalpartners.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/cody-sims3/";
const GITHUB_URL = "https://github.com/cody-sims-git-hub";

const reasons = [
  "A website, application, or automation project",
  "Roles and opportunities",
  "Collaboration or partnership",
  "Questions about my work or background",
];

export default function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <PageHeader
        eyebrow="Contact"
        title="Let's connect"
        description="Whether you have a project in mind or you'd just like to connect, I'd be glad to hear from you. Tell me a bit about what you're looking for and I'll get back to you."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ContactForm email={CONTACT_EMAIL} />

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6">
            <h2 className="font-medium text-foreground">Reach me directly</h2>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
                <Mail className="size-4" />
              </span>
              {CONTACT_EMAIL}
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
                <LinkedinIcon className="size-4" />
              </span>
              LinkedIn
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
                <GithubIcon className="size-4" />
              </span>
              GitHub
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6">
            <h2 className="font-medium text-foreground">Reasons to reach out</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
