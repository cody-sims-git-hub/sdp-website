import { services, type Service } from "~/lib/services";

/**
 * schema.org JSON-LD builders. Each returns a plain object passed to a route's
 * `meta` as `{ "script:ld+json": ... }`, which React Router renders as a
 * <script type="application/ld+json"> in the prerendered <head>.
 */

const SITE_URL = "https://simsdigitalpartners.com";
const ORG_ID = `${SITE_URL}/#organization`;
const NAME = "Sims Digital Partners";
const EMAIL = "info@simsdigitalpartners.com";
const GITHUB = "https://github.com/cody-sims-git-hub";
const LINKEDIN = "https://www.linkedin.com/in/cody-sims3/";

/**
 * Canonical Organization node, referenced by @id elsewhere. Typed as a
 * ProfessionalService (a LocalBusiness subtype) so answer engines can classify
 * what the studio does and enumerate its services from `hasOfferCatalog`.
 */
const organization = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/images/sdp-icon-512.png`,
  image: `${SITE_URL}/og-image.jpg`,
  email: EMAIL,
  description:
    "Sims Digital Partners builds websites, automation, AI integrations, and custom software to help businesses modernize operations.",
  slogan:
    "Practical websites, automation, and software that help small businesses get found and run better.",
  areaServed: { "@type": "Country", name: "United States" },
  founder: { "@type": "Person", name: "Cody Sims" },
  knowsAbout: [
    "Web development",
    "Workflow automation",
    "AI integration",
    "Custom software development",
  ],
  sameAs: [GITHUB, LINKEDIN],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.metaDescription,
        url: `${SITE_URL}/services/${service.slug}`,
      },
    })),
  },
};

function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: NAME,
        url: `${SITE_URL}/`,
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Cody Sims",
    url: `${SITE_URL}/about`,
    jobTitle: "Software Support Engineer & Developer",
    worksFor: { "@type": "Organization", "@id": ORG_ID, name: NAME },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "ECPI University" },
      { "@type": "CollegeOrUniversity", name: "Georgetown University" },
    ],
    sameAs: [GITHUB, LINKEDIN],
  };
}

export function servicesIndexJsonLd(services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Services",
        itemListElement: services.map((service, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: service.title,
          url: `${SITE_URL}/services/${service.slug}`,
        })),
      },
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
      ]),
    ],
  };
}

export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.title,
        serviceType: service.title,
        description: service.metaDescription,
        url: `${SITE_URL}/services/${service.slug}`,
        provider: { "@id": ORG_ID },
      },
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: service.title, path: `/services/${service.slug}` },
      ]),
    ],
  };
}

export function contactJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        name: "Contact",
        url: `${SITE_URL}/contact`,
        about: { "@id": ORG_ID },
      },
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
    ],
  };
}
