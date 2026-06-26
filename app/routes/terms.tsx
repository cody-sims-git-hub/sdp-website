import { Link } from "react-router";
import type { Route } from "./+types/terms";
import { siteMeta } from "~/lib/site-meta";
import {
  LegalPage,
  LegalSection,
  LegalList,
  legalLinkClass,
} from "~/components/legal-page";

export function meta({}: Route.MetaArgs) {
  return siteMeta({
    title: "Terms of Service | Sims Digital Partners",
    description:
      "The terms that govern your use of simsdigitalpartners.com, operated by Sims Digital Partners LLC.",
    path: "/terms",
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

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      lastUpdated="June 25, 2026"
      intro={
        <p>
          These Terms of Service ("Terms") govern your use of
          simsdigitalpartners.com (the "Site"), operated by Sims Digital Partners
          LLC ("Sims Digital Partners," "we," "us," or "our"). By accessing or
          using the Site, you agree to these Terms. If you do not agree, please do
          not use the Site.
        </p>
      }
    >
      <LegalSection title="1. About the Site and our services">
        <p>
          The Site is an informational and marketing website that describes the
          services Sims Digital Partners offers, including websites, business
          applications, workflow automation, and AI-assisted tools. Information on
          the Site is provided for general purposes only. Nothing on the Site is
          an offer to enter into a contract, and no contract for services is
          formed through the Site. Any services we provide are governed by a
          separate written agreement or quote between you and us.
        </p>
      </LegalSection>

      <LegalSection title="2. Acceptable use">
        <p>You agree to use the Site lawfully and not to:</p>
        <LegalList
          items={[
            "use the Site in any way that violates applicable law or regulation;",
            "attempt to gain unauthorized access to, interfere with, or disrupt the Site or its underlying systems;",
            "introduce malware or other harmful code; or",
            "scrape, harvest, or collect data from the Site through automated means without our prior written permission.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Intellectual property">
        <p>
          All content on the Site — including text, graphics, logos, images, code
          samples, and design — is owned by Sims Digital Partners LLC or its
          licensors and is protected by intellectual-property laws. The "Sims
          Digital Partners" name and logo are our marks. You may not copy,
          reproduce, distribute, or create derivative works from Site content
          without our prior written permission, except for personal,
          non-commercial viewing of the Site.
        </p>
      </LegalSection>

      <LegalSection title="4. Third-party links">
        <p>
          The Site may contain links to third-party websites or services that we
          do not control. We provide these links for convenience and are not
          responsible for the content, products, or practices of any third-party
          site.
        </p>
      </LegalSection>

      <LegalSection title="5. Disclaimers">
        <p>
          The Site is provided "as is" and "as available," without warranties of
          any kind, whether express or implied, including warranties of
          merchantability, fitness for a particular purpose, and non-infringement.
          We do not warrant that the Site will be uninterrupted, error-free, or
          secure, or that information on it is accurate, complete, or current.
          Content on the Site is not professional advice (legal, financial,
          technical, or otherwise) and should not be relied on as such.
        </p>
      </LegalSection>

      <LegalSection title="6. Limitation of liability">
        <p>
          To the fullest extent permitted by law, Sims Digital Partners LLC and
          its owner will not be liable for any indirect, incidental, special,
          consequential, or punitive damages, or for any loss of data, profits, or
          goodwill, arising out of or related to your use of (or inability to use)
          the Site. To the fullest extent permitted by law, our total liability
          for any claim relating to the Site will not exceed one hundred U.S.
          dollars (US $100).
        </p>
      </LegalSection>

      <LegalSection title="7. Indemnification">
        <p>
          You agree to indemnify and hold harmless Sims Digital Partners LLC and
          its owner from any claims, losses, or expenses (including reasonable
          attorneys' fees) arising out of your misuse of the Site or your
          violation of these Terms.
        </p>
      </LegalSection>

      <LegalSection title="8. Privacy">
        <p>
          Your use of the Site is also governed by our{" "}
          <Link to="/privacy" className={legalLinkClass}>
            Privacy Policy
          </Link>
          , which explains how we handle information.
        </p>
      </LegalSection>

      <LegalSection title="9. Governing law">
        <p>
          These Terms are governed by the laws of the State of North Carolina,
          without regard to its conflict-of-laws rules. You agree that any dispute
          relating to the Site or these Terms will be brought exclusively in the
          state or federal courts located in North Carolina.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to these Terms">
        <p>
          We may update these Terms from time to time. When we do, we will revise
          the "Last updated" date above. Your continued use of the Site after
          changes take effect means you accept the updated Terms.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact us">
        <p>
          Questions about these Terms? Contact Sims Digital Partners LLC at{" "}
          <Email />.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
