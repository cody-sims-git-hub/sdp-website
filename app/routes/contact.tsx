import { Mail, MapPin } from "lucide-react";
import type { Route } from "./+types/contact";
import { PageHeader } from "~/components/page-header";
import { ContactForm } from "~/components/contact-form";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact — Sims Digital Partners" },
    {
      name: "description",
      content:
        "Get in touch with Cody Sims to discuss a website, business application, automation, or AI project.",
    },
  ];
}

const CONTACT_EMAIL = "codysims37@gmail.com";

export default function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your project"
        description="Tell me what you're working on and I'll get back to you. The more detail you can share, the better."
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
            <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
                <MapPin className="size-4" />
              </span>
              Available for remote work
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6">
            <h2 className="font-medium text-foreground">What happens next</h2>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>1. I'll review your message and reply.</li>
              <li>2. We'll have a short conversation about scope.</li>
              <li>3. You get a clear plan and next steps.</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
