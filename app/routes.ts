import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("components/layout.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("resume", "routes/resume.tsx"),
    route("contact", "routes/contact.tsx"),
  ]),
] satisfies RouteConfig;
