import { Link } from "react-router";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "~/components/icons";

const footerLinks = [
  { to: "/about", label: "About" },
  { to: "/resume", label: "Resume" },
  { to: "/contact", label: "Contact" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground">
            <img
              src="/images/sdp-mark.png"
              alt="Sims Digital Partners logo"
              className="h-7 w-auto"
            />
            Sims Digital Partners
          </div>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Military service. Business experience. Technology for the future.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {footerLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="mailto:info@simsdigitalpartners.com"
            aria-label="Email"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="size-5" />
          </a>
          <a
            href="https://github.com/cody-sims-git-hub"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/cody-sims3/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <LinkedinIcon className="size-5" />
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
          © {year} Sims Digital Partners. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
