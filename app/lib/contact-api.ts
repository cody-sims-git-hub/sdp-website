import { contactConfig } from "./contact-config";

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
  website: string; // honeypot
}

export type ContactResult =
  | { ok: true }
  | { ok: false; message: string; fields?: Record<string, string[]> };

export async function submitContact(req: ContactRequest): Promise<ContactResult> {
  try {
    const res = await fetch(`${contactConfig.apiUrl}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      fields?: Record<string, string[]>;
    };
    return { ok: false, message: data.error ?? "Something went wrong.", fields: data.fields };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}
