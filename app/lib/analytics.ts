// Lightweight GA4 tracking for the handful of *meaningful* clicks worth funnel
// analysis. Events only fire when `gtag` exists (production — the inline gtag
// bootstrap in app/root.tsx defines window.gtag); in dev these are no-ops.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Send a GA4 event if gtag is available; no-op otherwise. */
export function gtagEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/**
 * Map a click target's href to a meaningful GA4 event name, or null to ignore.
 * Keyed off stable hrefs/destinations rather than label text. The contact-form
 * submit fires its own `contact_submit` event (see contact-form.tsx).
 */
function classifyClick(href: string): string | null {
  if (/^mailto:/i.test(href)) return "email_click";

  let host = "";
  let path = "";
  try {
    const u = new URL(href, window.location.href);
    host = u.hostname;
    path = u.pathname.replace(/\/+$/, "") || "/";
  } catch {
    return null;
  }

  if (/(^|\.)linkedin\.com$/i.test(host)) return "linkedin_click";
  if (/(^|\.)github\.com$/i.test(host)) return "github_click";
  if (path === "/resume.pdf") return "resume_download";
  if (path === "/services") return "view_services";
  if (path === "/contact") return "get_in_touch";
  return null;
}

/**
 * One delegated, capture-phase listener that fires a named GA4 event for the
 * meaningful clicks (View Services, Get in touch, Resume download, Email /
 * LinkedIn / GitHub links). gtag uses sendBeacon, so events survive the
 * navigation an outbound or link click triggers. Returns a cleanup function.
 */
export function initClickTracking(): () => void {
  if (typeof document === "undefined") return () => {};

  const handler = (event: MouseEvent) => {
    const start = event.target as Element | null;
    const el = start?.closest?.(
      'a, button, [role="button"], [data-slot="button"]',
    ) as HTMLElement | null;
    if (!el) return;

    const href = el.getAttribute("href") || "";
    const name = classifyClick(href);
    if (!name) return;

    const label =
      (el.getAttribute("aria-label") || el.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 100) || "(no label)";

    gtagEvent(name, {
      click_text: label,
      click_location: window.location.pathname,
      click_url: href,
    });
  };

  document.addEventListener("click", handler, { capture: true });
  return () =>
    document.removeEventListener("click", handler, { capture: true });
}
