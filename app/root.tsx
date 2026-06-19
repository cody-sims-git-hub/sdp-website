import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { Button } from "~/components/ui/button";
import { initClickTracking } from "~/lib/analytics";
import "./app.css";

// Google Analytics 4. Measurement IDs are public (shipped to the client), so
// this is not a secret. Loaded in production builds only. Per-route page views
// for this SPA are handled by GA4 Enhanced Measurement ("page changes based on
// browser history events"), which tracks React Router's history navigations —
// no manual tracking, which keeps it to exactly one page_view per route.
const GA_ID = "G-LDP3LQPKCT";
// Microsoft Clarity project ID — heatmaps + session recordings.
const CLARITY_ID = "x9nwbcid1q";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico?v=2", sizes: "any" },
  { rel: "icon", type: "image/png", sizes: "32x32", href: "/images/sdp-icon-32.png?v=2" },
  { rel: "icon", type: "image/png", sizes: "512x512", href: "/images/sdp-icon-512.png?v=2" },
  { rel: "apple-touch-icon", href: "/images/sdp-icon-180.png?v=2" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Geist:wght@300..800&family=Geist+Mono:wght@400..600&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0b101e" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // Analytics load entirely off the critical path — nothing runs during HTML
  // parse or hydration. Production only; after the page is idle (post-LCP) we
  // bootstrap gtag and inject GA + Clarity (both async), so they never compete
  // with rendering/hydration for CPU or bandwidth.
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    // Attach the click tracker now (cheap, runs after hydration). It no-ops
    // until gtag is defined by the idle inject below, so it blocks nothing.
    const stopTracking = initClickTracking();
    const inject = () => {
      // Google Analytics 4 — set up the queue + config, then load gtag.js async
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer!.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", GA_ID);
      const ga = document.createElement("script");
      ga.async = true;
      ga.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(ga);
      // Microsoft Clarity — heatmaps + session recordings (official snippet)
      (function (c: any, l: Document, a: string, r: "script", i: string) {
        c[a] =
          c[a] ||
          function () {
            (c[a].q = c[a].q || []).push(arguments);
          };
        const t = l.createElement(r);
        t.async = true;
        t.src = "https://www.clarity.ms/tag/" + i;
        const first = l.getElementsByTagName(r)[0];
        (first?.parentNode ?? l.head).insertBefore(t, first ?? null);
      })(window, document, "clarity", "script", CLARITY_ID);
    };
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(inject, { timeout: 5000 });
    } else {
      window.setTimeout(inject, 3000);
    }
    return stopTracking;
  }, []);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let code = "Error";
  let message = "Something went wrong";
  let details = "An unexpected error occurred. Please try again.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    code = String(error.status);
    message = error.status === 404 ? "Page not found" : "Something went wrong";
    details =
      error.status === 404
        ? "The page you're looking for doesn't exist or may have moved."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center px-4 py-20 text-center">
      <img
        src="/images/sdp-mark.png"
        alt="Sims Digital Partners"
        className="h-10 w-auto"
      />
      <p className="mt-8 font-mono text-sm uppercase tracking-[0.2em] text-primary">
        {code}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {message}
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">{details}</p>
      <Button asChild size="lg" className="mt-8">
        <a href="/">Back to home</a>
      </Button>
      {stack && (
        <pre className="mt-10 max-w-full overflow-x-auto rounded-lg border border-border bg-card/60 p-4 text-left text-xs text-muted-foreground">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
