import type { Config } from "@react-router/dev/config";

export default {
  // Static deployment to Hostinger: no server runtime.
  // Prerender every route to full static HTML at build time (SSG). The server
  // build is produced for prerendering only — deploy just `build/client`.
  ssr: true,
  prerender: true,
  // Static host has no runtime server, so disable lazy route discovery
  // (the `/__manifest` fetch). Embed the full manifest at build time instead.
  routeDiscovery: { mode: "initial" },
  future: {
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_splitRouteModules: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
