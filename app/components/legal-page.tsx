import type { ReactNode } from "react";
import { Link } from "react-router";
import { PageHeader } from "~/components/page-header";

/** Inline link style for prose inside legal pages (mailto, cross-links). */
export const legalLinkClass =
  "text-primary underline-offset-4 transition-colors hover:underline";

const footerLinkClass = "transition-colors hover:text-foreground";

/**
 * Shared shell for the Privacy Policy and Terms of Service pages: a narrow,
 * readable prose column with the standard PageHeader, a "Last updated" line, the
 * intro lede, the numbered sections, and a row of cross-links at the bottom.
 */
export function LegalPage({
  eyebrow,
  title,
  lastUpdated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <PageHeader eyebrow={eyebrow} title={title} />

      <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Last updated: {lastUpdated}
      </p>
      <div className="mt-6 text-base leading-relaxed text-muted-foreground">
        {intro}
      </div>

      <div className="mt-10 space-y-10">{children}</div>

      <div className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-8 text-sm text-muted-foreground">
        <Link to="/privacy" className={footerLinkClass}>
          Privacy Policy
        </Link>
        <Link to="/terms" className={footerLinkClass}>
          Terms of Service
        </Link>
        <Link to="/contact" className={footerLinkClass}>
          Contact
        </Link>
      </div>
    </div>
  );
}

/** A numbered section within a legal page: heading + prose body. */
export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

/** Lead-in label for a sub-point (e.g. "Information you provide."). */
export function LegalLabel({ children }: { children: ReactNode }) {
  return <span className="font-medium text-foreground">{children}</span>;
}

/** Bulleted list styled for legal prose. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-primary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
