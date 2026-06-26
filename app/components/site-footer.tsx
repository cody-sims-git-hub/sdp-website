import { Link } from "react-router";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "~/components/icons";
import { services } from "~/lib/services";

const companyLinks = [
  { to: "/about", label: "About" },
  { to: "/resume", label: "Resume" },
  { to: "/contact", label: "Contact" },
];

const linkClass =
  "text-muted-foreground transition-colors hover:text-foreground";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr] md:gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground">
              <img
                src="/images/sdp-mark.png"
                alt="Sims Digital Partners logo"
                className="h-7 w-auto"
              />
              Sims Digital Partners
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Military service. Business experience. Technology for the future.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="mailto:info@simsdigitalpartners.com"
                aria-label="Email"
                className={linkClass}
              >
                <Mail className="size-5" />
              </a>
              <a
                href="https://github.com/cody-sims-git-hub"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className={linkClass}
              >
                <GithubIcon className="size-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/cody-sims3/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className={linkClass}
              >
                <LinkedinIcon className="size-5" />
              </a>
            </div>
          </div>

          {/* Link columns — two-up on mobile, separate columns on desktop */}
          <div className="grid grid-cols-2 gap-8 md:contents">
            {/* Services */}
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Services
              </p>
              <nav className="mt-4 flex flex-col gap-2.5 text-sm">
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    to={`/services/${service.slug}`}
                    className={linkClass}
                  >
                    {service.title}
                  </Link>
                ))}
                <Link to="/services" className={linkClass}>
                  All services
                </Link>
              </nav>
            </div>

            {/* Company */}
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Company
              </p>
              <nav className="mt-4 flex flex-col gap-2.5 text-sm">
                {companyLinks.map((item) => (
                  <Link key={item.to} to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 text-xs text-muted-foreground sm:px-6">
          <span>© {year} Sims Digital Partners. All rights reserved.</span>
          <nav className="flex items-center gap-x-5">
            <Link to="/privacy" className={linkClass}>
              Privacy
            </Link>
            <Link to="/terms" className={linkClass}>
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
