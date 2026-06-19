import { Link } from "react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { PageHeader } from "~/components/page-header";
import { services, type Service } from "~/lib/services";

/** Shared detail-page template for an individual service. */
export function ServiceDetail({ service }: { service: Service }) {
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <PageHeader
        eyebrow="Services"
        title={service.title}
        description={service.headline}
        action={
          <Button asChild>
            <Link to="/contact">
              Start a project <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        {/* Overview + what's included */}
        <div>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            {service.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              What's included
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {service.features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm"
                >
                  <h3 className="flex items-center gap-2 font-medium text-foreground">
                    <Check className="size-4 shrink-0 text-primary" />
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar — process + technologies */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {service.process && service.process.length > 0 && (
            <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                How it works
              </p>
              <ol className="mt-4 space-y-3 text-sm text-foreground">
                {service.process.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="font-mono text-xs text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Technologies
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* CTA */}
      <section className="mt-16">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 px-6 py-12 text-center backdrop-blur-sm sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-[-8rem] mx-auto h-64 w-[36rem] rounded-full bg-primary/20 blur-[100px]"
          />
          <h2 className="relative text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Interested in {service.title}?
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-muted-foreground">
            Tell us a bit about what you're working on and we'll figure out
            whether it's a good fit.
          </p>
          <div className="relative mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/contact">
                Get in touch <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/services">View all services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Other services — internal linking */}
      <section className="mt-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Other services
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {others.map((other) => (
            <Link
              key={other.slug}
              to={`/services/${other.slug}`}
              className="group rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-colors hover:border-primary/40"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
                <other.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-medium text-foreground">{other.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {other.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Learn more
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to all services
        </Link>
      </div>
    </div>
  );
}
