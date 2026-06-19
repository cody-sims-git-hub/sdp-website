import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { Route } from "./+types/services";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { services } from "~/lib/services";
import { siteMeta } from "~/lib/site-meta";
import { servicesIndexJsonLd } from "~/lib/structured-data";

export function meta({}: Route.MetaArgs) {
  return [
    ...siteMeta({
      title:
        "Business Websites, Automation & AI Services | Sims Digital Partners",
      description:
        "Services for growing businesses — websites, workflow automation, AI integration, and custom software built around how your business actually works.",
      path: "/services",
    }),
    { "script:ld+json": servicesIndexJsonLd(services) },
  ];
}

export default function Services() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <PageHeader
        eyebrow="Services"
        title="What we build"
        description="Helping businesses improve their online presence, automate processes, and solve operational challenges through software and AI."
        action={
          <Button asChild>
            <Link to="/contact">
              Start a project <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {services.map((service, i) => (
          <Link
            key={service.slug}
            to={`/services/${service.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-colors hover:border-primary/40 sm:p-8"
          >
            <div
              aria-hidden
              className="absolute -top-16 left-1/3 h-40 w-40 rounded-full bg-primary/20 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="relative flex flex-1 flex-col">
              <div className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                  <service.icon className="size-5" />
                </span>
                <div>
                  <span className="font-mono text-xs text-muted-foreground/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    {service.title}
                  </h2>
                </div>
              </div>
              <p className="mt-5 text-balance text-base font-medium leading-snug text-foreground">
                {service.headline}
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium text-primary">
                Learn more
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
