const SITE_URL = "https://simsdigitalpartners.com";
const SITE_NAME = "Sims Digital Partners";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SiteMetaArgs {
  /** Full <title> for the page. */
  title: string;
  /** Meta + OG/Twitter description. */
  description: string;
  /** Route path (e.g. "/about") used for the canonical og:url. */
  path?: string;
}

/**
 * Builds the full set of meta tags for a route: standard description plus
 * Open Graph + Twitter Card tags (with a shared share image) so links render a
 * rich preview when shared on social/messaging platforms.
 */
export function siteMeta({ title, description, path = "/" }: SiteMetaArgs) {
  const url = SITE_URL + path;
  return [
    { title },
    { name: "description", content: description },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: OG_IMAGE },
    { property: "og:image:type", content: "image/jpeg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "610" },
    { property: "og:image:alt", content: SITE_NAME },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: OG_IMAGE },
  ];
}
