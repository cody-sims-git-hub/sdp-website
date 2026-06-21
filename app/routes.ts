import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("components/layout.tsx", [
    index("routes/home.tsx"),
    route("services", "routes/services.tsx"),
    route("services/business-websites", "routes/services.business-websites.tsx"),
    route(
      "services/workflow-automation",
      "routes/services.workflow-automation.tsx",
    ),
    route("services/ai-integration", "routes/services.ai-integration.tsx"),
    route("services/custom-software", "routes/services.custom-software.tsx"),
    route("about", "routes/about.tsx"),
    route("resume", "routes/resume.tsx"),
    route("contact", "routes/contact.tsx"),
  ]),
] satisfies RouteConfig;
