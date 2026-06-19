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
import "./app.css";

// Google Analytics 4. Measurement IDs are public (shipped to the client), so
// this is not a secret. Loaded in production builds only. Per-route page views
// for this SPA are handled by GA4 Enhanced Measurement ("page changes based on
// browser history events"), which tracks React Router's history navigations —
// no manual tracking, which keeps it to exactly one page_view per route.
const GA_ID = "G-LDP3LQPKCT";

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
        {import.meta.env.PROD && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
            }}
          />
        )}
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
  // Load Google Analytics off the critical render path: inject gtag.js once the
  // page is idle so it never competes with hero content for bandwidth/CPU. The
  // inline config in <head> queues events until the script arrives.
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    const inject = () => {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
    };
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(inject, { timeout: 5000 });
    } else {
      window.setTimeout(inject, 3000);
    }
  }, []);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
