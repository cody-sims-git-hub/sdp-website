import type { Route } from "./+types/services.custom-software";
import { ServiceDetail } from "~/components/service-detail";
import { getService } from "~/lib/services";
import { siteMeta } from "~/lib/site-meta";
import { serviceJsonLd } from "~/lib/structured-data";

const service = getService("custom-software")!;

export function meta({}: Route.MetaArgs) {
  return [
    ...siteMeta({
      title: service.metaTitle,
      description: service.metaDescription,
      path: `/services/${service.slug}`,
    }),
    { "script:ld+json": serviceJsonLd(service) },
  ];
}

export default function Page() {
  return <ServiceDetail service={service} />;
}
