# Legal pages: Privacy Policy & Terms of Service — design + drafted text

**Date:** 2026-06-25
**Status:** Draft for review

## Summary

Add two prerendered pages — `/privacy` and `/terms` — to the Sims Digital Partners
site, with plain-language legal content tailored to what the site actually does.

**Decisions (confirmed):**
- Entity: **Sims Digital Partners LLC** ("we", "us", "our")
- Governing law: **North Carolina**
- Privacy scope: **US plain-language** — disclose the contact form, GA4 + Microsoft
  Clarity analytics, cookies, and opt-out; **no cookie-consent banner**
- Contact email: **info@simsdigitalpartners.com**
- Effective / "Last updated": **June 25, 2026**

> **Not legal advice.** These are good-faith, plain-language policies that
> accurately describe the site's data practices. They are not a substitute for
> review by a licensed attorney if airtight liability protection is required.

## Technical design

- **Routes:** new `routes/privacy.tsx` and `routes/terms.tsx`, registered in
  `app/routes.ts` inside the existing `layout()` so they prerender to static HTML
  (`/privacy/index.html`, `/terms/index.html`) and are deep-linkable.
- **Layout:** reuse `PageHeader` (mono eyebrow + title) over a single readable prose
  column. Use theme tokens only (`text-foreground`, `text-muted-foreground`,
  `bg-card`, `border-border`, `text-primary`) — no new dependencies, no ad-hoc hex.
  A small shared content style (headings, paragraphs, lists, links) lives inline in
  each route; if the two pages share enough markup, factor a tiny `LegalPage`/prose
  wrapper component — otherwise keep inline per existing page conventions.
- **`meta`:** each route exports `meta` with title + description (e.g.
  "Privacy Policy | Sims Digital Partners").
- **Footer:** add `Privacy` and `Terms` links to the bottom copyright bar in
  `site-footer.tsx` (e.g. `© 2026 Sims Digital Partners. All rights reserved.
  · Privacy · Terms`). Each page also cross-links the other and `/contact`.
- **Data accuracy:** contact-form fields confirmed in `app/lib/contact-api.ts` —
  name, email, subject, message (+ Turnstile token, honeypot). Third parties:
  Hostinger (hosting), Resend (email delivery), self-hosted API/MySQL on VPS,
  Google Analytics 4, Microsoft Clarity, Cloudflare Turnstile.

---

## Drafted content — Privacy Policy

**Privacy Policy**
_Last updated: June 25, 2026_

Sims Digital Partners LLC ("Sims Digital Partners," "we," "us," or "our") respects
your privacy. This Privacy Policy explains what information we collect when you
visit **simsdigitalpartners.com** (the "Site"), how we use it, and the choices you
have. By using the Site, you agree to this Policy.

**1. Information we collect**

_Information you provide._ When you submit our contact form, we collect the
information you enter: your **name**, **email address**, **subject**, and the
**message** you send. We use this to respond to your inquiry.

_Information collected automatically._ When you visit the Site, certain information
is collected automatically through analytics tools, including your IP address,
browser and device type, operating system, referring website, the pages you view,
and how you interact with the Site. We use **Google Analytics 4** (Google) and
**Microsoft Clarity** (Microsoft) for this. Microsoft Clarity may also record
session activity such as mouse movements, clicks, and scrolling to produce
aggregated heatmaps and session replays that help us understand how the Site is
used. These tools use cookies and similar technologies (see Section 5).

_Spam prevention._ Our contact form is protected by **Cloudflare Turnstile**, which
helps verify that submissions come from real people. Cloudflare may process limited
technical information (such as your IP address and browser signals) to provide this
protection.

**2. How we use information**

We use the information we collect to:
- respond to your inquiries and communicate with you;
- operate, maintain, and improve the Site;
- understand how visitors use the Site (analytics); and
- protect the Site against spam, abuse, and security threats.

**3. How information is shared**

We do **not** sell your personal information. We share information only with
service providers that help us operate the Site and respond to you, including:
- **Hostinger** — website hosting;
- **Resend** — delivery of contact-form emails;
- our own application server and database, used to receive and store contact-form
  submissions;
- **Google** (Google Analytics 4) and **Microsoft** (Clarity) — analytics; and
- **Cloudflare** — spam protection (Turnstile).

We may also disclose information if required by law or to protect our rights,
safety, or property.

**4. Cookies and analytics**

The Site uses cookies and similar technologies, primarily through Google Analytics
4 and Microsoft Clarity, to measure and improve how the Site performs. These are
loaded on the production website.

You can control or disable cookies through your browser settings. You can opt out
of Google Analytics across websites by installing the
[Google Analytics Opt-out Browser Add-on](https://tools.google.com/dlpage/gaoptout).
Disabling cookies may affect some Site functionality but will not prevent you from
viewing the Site.

**5. Data retention**

We keep contact-form submissions for as long as needed to respond to your inquiry
and maintain our business records, and then delete or anonymize them. Analytics
data is retained according to the providers' standard retention settings.

**6. Security**

We use reasonable measures to protect information, including HTTPS encryption and
spam protection. However, no method of transmission or storage is completely
secure, and we cannot guarantee absolute security.

**7. Children's privacy**

The Site is not directed to children under 13, and we do not knowingly collect
personal information from children. If you believe a child has provided us
information, please contact us and we will delete it.

**8. Third-party links**

The Site may link to third-party websites or services. We are not responsible for
the privacy practices of those third parties, and we encourage you to review their
policies.

**9. Your choices**

You may contact us at **info@simsdigitalpartners.com** to ask what personal
information we hold about you, to correct it, or to request its deletion. You can
also opt out of analytics as described in Section 4.

**10. Changes to this Policy**

We may update this Privacy Policy from time to time. When we do, we will revise the
"Last updated" date above. Your continued use of the Site after changes take effect
means you accept the updated Policy.

**11. Contact us**

Questions about this Privacy Policy? Contact **Sims Digital Partners LLC** at
**info@simsdigitalpartners.com**.

---

## Drafted content — Terms of Service

**Terms of Service**
_Last updated: June 25, 2026_

These Terms of Service ("Terms") govern your use of **simsdigitalpartners.com** (the
"Site"), operated by Sims Digital Partners LLC ("Sims Digital Partners," "we," "us,"
or "our"). By accessing or using the Site, you agree to these Terms. If you do not
agree, please do not use the Site.

**1. About the Site and our services**

The Site is an informational and marketing website that describes the services
Sims Digital Partners offers, including websites, business applications, workflow
automation, and AI-assisted tools. Information on the Site is provided for general
purposes only. Nothing on the Site is an offer to enter into a contract, and no
contract for services is formed through the Site. Any services we provide are
governed by a **separate written agreement or quote** between you and us.

**2. Acceptable use**

You agree to use the Site lawfully and not to:
- use the Site in any way that violates applicable law or regulation;
- attempt to gain unauthorized access to, interfere with, or disrupt the Site or
  its underlying systems;
- introduce malware or other harmful code; or
- scrape, harvest, or collect data from the Site through automated means without
  our prior written permission.

**3. Intellectual property**

All content on the Site — including text, graphics, logos, images, code samples,
and design — is owned by Sims Digital Partners LLC or its licensors and is
protected by intellectual-property laws. The "Sims Digital Partners" name and logo
are our marks. You may not copy, reproduce, distribute, or create derivative works
from Site content without our prior written permission, except for personal,
non-commercial viewing of the Site.

**4. Third-party links**

The Site may contain links to third-party websites or services that we do not
control. We provide these links for convenience and are not responsible for the
content, products, or practices of any third-party site.

**5. Disclaimers**

The Site is provided "as is" and "as available," without warranties of any kind,
whether express or implied, including warranties of merchantability, fitness for a
particular purpose, and non-infringement. We do not warrant that the Site will be
uninterrupted, error-free, or secure, or that information on it is accurate,
complete, or current. Content on the Site is not professional advice (legal,
financial, technical, or otherwise) and should not be relied on as such.

**6. Limitation of liability**

To the fullest extent permitted by law, Sims Digital Partners LLC and its owner will
not be liable for any indirect, incidental, special, consequential, or punitive
damages, or for any loss of data, profits, or goodwill, arising out of or related
to your use of (or inability to use) the Site. To the fullest extent permitted by
law, our total liability for any claim relating to the Site will not exceed
one hundred U.S. dollars (US $100).

**7. Indemnification**

You agree to indemnify and hold harmless Sims Digital Partners LLC and its owner
from any claims, losses, or expenses (including reasonable attorneys' fees) arising
out of your misuse of the Site or your violation of these Terms.

**8. Privacy**

Your use of the Site is also governed by our [Privacy Policy](/privacy), which
explains how we handle information.

**9. Governing law**

These Terms are governed by the laws of the State of North Carolina, without regard
to its conflict-of-laws rules. You agree that any dispute relating to the Site or
these Terms will be brought exclusively in the state or federal courts located in
North Carolina.

**10. Changes to these Terms**

We may update these Terms from time to time. When we do, we will revise the "Last
updated" date above. Your continued use of the Site after changes take effect means
you accept the updated Terms.

**11. Contact us**

Questions about these Terms? Contact **Sims Digital Partners LLC** at
**info@simsdigitalpartners.com**.

---

## Build sequence

1. Create `app/routes/privacy.tsx` and `app/routes/terms.tsx` (PageHeader + prose
   content above; `meta` exports; cross-links to each other and `/contact`).
2. Register both in `app/routes.ts` under the `layout()`.
3. Add `Privacy` and `Terms` links to the footer copyright bar in
   `app/components/site-footer.tsx`.
4. `npm run typecheck` and `npm run build` (verify both routes prerender to
   `build/client/privacy/index.html` and `.../terms/index.html`).
5. Commit; deploy via the normal GitHub Actions flow (push to `main`).

## Open items for reviewer

- **Indemnification (ToS §7):** included as standard; cut if you'd rather keep the
  Terms lighter.
- **Liability cap (ToS §6):** drafted at US $100; adjust or remove the dollar figure
  if preferred.
- Any sections to add/remove before implementation.
