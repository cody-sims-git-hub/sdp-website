export const contactConfig = {
  apiUrl: import.meta.env.VITE_CONTACT_API_URL ?? "",
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "",
};

if (import.meta.env.PROD && !contactConfig.apiUrl) {
  throw new Error("VITE_CONTACT_API_URL must be set for production builds");
}
