import type { Route } from "./+types/privacy";
import { siteMeta } from "~/lib/site-meta";
import {
  LegalPage,
  LegalSection,
  LegalLabel,
  LegalList,
  legalLinkClass,
} from "~/components/legal-page";

export function meta({}: Route.MetaArgs) {
  return siteMeta({
    title: "Privacy Policy | Sims Digital Partners",
    description:
      "How Sims Digital Partners collects, uses, and protects information when you use simsdigitalpartners.com.",
    path: "/privacy",
  });
}

const email = "info@simsdigitalpartners.com";

function Email() {
  return (
    <a href={`mailto:${email}`} className={legalLinkClass}>
      {email}
    </a>
  );
}

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      lastUpdated="June 25, 2026"
      intro={
        <p>
          Sims Digital Partners LLC ("Sims Digital Partners," "we," "us," or
          "our") respects your privacy. This Privacy Policy explains what
          information we collect when you visit simsdigitalpartners.com (the
          "Site"), how we use it, and the choices you have. By using the Site,
          you agree to this Policy.
        </p>
      }
    >
      <LegalSection title="1. Information we collect">
        <p>
          <LegalLabel>Information you provide.</LegalLabel> When you submit our
          contact form, we collect the information you enter: your name, email
          address, subject, and the message you send. We use this to respond to
          your inquiry.
        </p>
        <p>
          <LegalLabel>Information collected automatically.</LegalLabel> When you
          visit the Site, certain information is collected automatically through
          third-party analytics services, including your IP address, browser and
          device type, operating system, referring website, the pages you view,
          and how you interact with the Site. One of these services may also
          record aggregated session activity — such as mouse movements, clicks,
          and scrolling — to produce heatmaps and session replays that help us
          understand how the Site is used. These services use cookies and similar
          technologies (see Section 4).
        </p>
        <p>
          <LegalLabel>Spam prevention.</LegalLabel> Our contact form is protected
          by a third-party spam-protection service, which helps verify that
          submissions come from real people. That service may process limited
          technical information (such as your IP address and browser signals) to
          provide this protection.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use information">
        <p>We use the information we collect to:</p>
        <LegalList
          items={[
            "respond to your inquiries and communicate with you;",
            "operate, maintain, and improve the Site;",
            "understand how visitors use the Site (analytics); and",
            "protect the Site against spam, abuse, and security threats.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. How information is shared">
        <p>
          We do not sell your personal information. We share information only with
          service providers that help us operate the Site and respond to you —
          including our website hosting provider, our email-delivery service, our
          analytics providers, and our spam-protection service. Contact-form
          submissions are received and stored on our own application server and
          database.
        </p>
        <p>
          We may also disclose information if required by law or to protect our
          rights, safety, or property.
        </p>
      </LegalSection>

      <LegalSection title="4. Cookies and analytics">
        <p>
          The Site uses cookies and similar technologies, primarily through our
          third-party analytics services, to measure and improve how the Site
          performs. These are loaded on the production website.
        </p>
        <p>
          You can control or disable cookies through your browser settings, and
          many analytics providers offer browser opt-out tools. Disabling cookies
          may affect some Site functionality but will not prevent you from viewing
          the Site.
        </p>
      </LegalSection>

      <LegalSection title="5. Data retention">
        <p>
          We keep contact-form submissions for as long as needed to respond to
          your inquiry and maintain our business records, and then delete or
          anonymize them. Analytics data is retained according to the providers'
          standard retention settings.
        </p>
      </LegalSection>

      <LegalSection title="6. Security">
        <p>
          We use reasonable measures to protect information, including HTTPS
          encryption and spam protection. However, no method of transmission or
          storage is completely secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="7. Children's privacy">
        <p>
          The Site is not directed to children under 13, and we do not knowingly
          collect personal information from children. If you believe a child has
          provided us information, please contact us and we will delete it.
        </p>
      </LegalSection>

      <LegalSection title="8. Third-party links">
        <p>
          The Site may link to third-party websites or services. We are not
          responsible for the privacy practices of those third parties, and we
          encourage you to review their policies.
        </p>
      </LegalSection>

      <LegalSection title="9. Your choices">
        <p>
          You may contact us at <Email /> to ask what personal information we hold
          about you, to correct it, or to request its deletion. You can also opt
          out of analytics as described in Section 4.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to this Policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we will
          revise the "Last updated" date above. Your continued use of the Site
          after changes take effect means you accept the updated Policy.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact us">
        <p>
          Questions about this Privacy Policy? Contact Sims Digital Partners LLC
          at <Email />.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
