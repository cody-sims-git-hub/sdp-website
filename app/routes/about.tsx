import { Link } from "react-router";
import { ArrowRight, FileText } from "lucide-react";
import type { Route } from "./+types/about";
import { Button } from "~/components/ui/button";
import { PageHeader } from "~/components/page-header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About — Sims Digital Partners" },
    {
      name: "description",
      content:
        "About Cody Sims — a software support engineer and developer with a background in business ownership and U.S. Marine Corps service, beginning a Master's in AI Management at Georgetown.",
    },
  ];
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
      {children}
    </p>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-sm text-foreground backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function SidePanel({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="self-start rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <ul className="mt-4 space-y-3 text-sm text-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <PageHeader
        eyebrow="About"
        title="Cody Sims"
        description="Software support engineer and developer — with a background in business ownership and military service, focused on building and supporting practical, dependable technology."
      />

      <div className="mt-16 space-y-20">
        {/* Section 1 — Who I am */}
        <section className="grid items-start gap-10 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Eyebrow>Who I am</Eyebrow>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                I'm a software support engineer and developer with a recent B.S.
                in Information and Cybersecurity Operations. What interests me
                most about technology is the intersection between systems and
                people — understanding how software behaves in the real world,
                how problems are diagnosed, and how technology can make work more
                effective rather than more complicated.
              </p>
              <p>
                Before moving into technology professionally, I spent years
                working directly with clients as an independent insurance agent.
                That experience taught me the value of listening carefully,
                communicating clearly, and understanding the real problem before
                trying to solve it. Working in a client-focused environment also
                gave me an appreciation for reliability, trust, and the
                importance of getting things right.
              </p>
              <p>
                This fall I begin a Master's in Artificial Intelligence
                Management at Georgetown University, where I'll be studying how
                software, automation, and emerging technologies can be applied in
                practical and meaningful ways.
              </p>
              <p>
                What ties it all together is a preference for thoughtful,
                dependable work — technology that serves a purpose, communication
                that's straightforward, and a willingness to keep learning as the
                field continues to evolve.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <Link to="/contact">
                  Get in touch <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/resume">
                  <FileText className="size-4" /> View resume
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm glow-blue md:mx-auto md:max-w-sm lg:mx-0 lg:max-w-none">
            <img
              src="/images/headshot.JPG"
              alt="Cody Sims"
              loading="lazy"
              className="aspect-[2/3] w-full object-cover object-top"
            />
          </div>
        </section>

        {/* Section 2 — Service & leadership */}
        <section className="grid items-stretch gap-10 lg:grid-cols-3">
          <figure className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm md:mx-auto md:max-w-sm lg:mx-0 lg:max-w-none">
            <img
              src="/images/military-photo.JPG"
              alt="Cody Sims during his service in the United States Marine Corps"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover object-left lg:aspect-auto lg:min-h-0 lg:flex-1"
            />
            <figcaption className="border-t border-border px-4 py-3 text-xs italic leading-relaxed text-muted-foreground">
              Manning the rails of the USS Bataan (LHD-5) on the Hudson during
              Fleet Week — May 26, 2016.
            </figcaption>
          </figure>
          <div className="flex flex-col justify-center space-y-5 lg:col-span-2">
            <Eyebrow>Service &amp; leadership</Eyebrow>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                My professional journey began in the United States Marine Corps.
                I don't mention it because it's unique; I mention it because it
                shaped how I approach work more than any other experience in my
                career.
              </p>
              <p>
                The Marine Corps runs on Honor, Courage, and Commitment, and on
                holding yourself accountable whether or not anyone is watching. I
                learned to stay steady under pressure, follow through on what I
                say I'll do, and take responsibility for the people and the work
                around me. That discipline and reliability still set the standard
                I hold myself to.
              </p>
            </div>
            <Pills
              items={["Discipline", "Accountability", "Reliability", "Leadership"]}
            />
          </div>
        </section>

        {/* Section 3 — A business perspective */}
        <section className="space-y-6">
          <Eyebrow>A business perspective</Eyebrow>
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground lg:col-span-2">
              <p>
                Before moving into technology professionally, I spent several
                years working directly with clients in the insurance industry.
                The industry itself isn't the point — the experience is.
              </p>
              <p>
                That work required building trust, listening carefully, and
                helping people navigate important decisions during uncertain
                moments. I learned that most problems aren't solved by talking
                more; they're solved by understanding what matters to someone and
                communicating clearly enough to help them move forward.
              </p>
              <p>
                Working with clients day after day taught me patience, empathy,
                and the importance of following through on commitments. It also
                reinforced something I still believe today: strong relationships
                are built through consistency, honesty, and a genuine willingness
                to help.
              </p>
              <p>
                Those lessons have stayed with me throughout my career and
                continue to influence how I approach both people and problems.
              </p>
            </div>
            <SidePanel
              label="What that gave me"
              items={[
                "Trust & relationships",
                "Careful listening",
                "Clear communication",
                "Patience & empathy",
                "Commitment",
              ]}
            />
          </div>
        </section>

        {/* Section 4 — Where I'm headed */}
        <section className="space-y-6">
          <Eyebrow>Where I'm headed</Eyebrow>
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground lg:col-span-2">
              <p>
                This fall I begin a Master's in Artificial Intelligence
                Management at Georgetown University. For me, it's the next step
                in understanding one of the most significant technological shifts
                of our time — not just how to use AI, but how it works, how it
                should be governed, and how organizations can adopt it
                responsibly.
              </p>
              <p>
                I'm interested in the intersection of software, automation,
                artificial intelligence, and technology strategy. I want to
                better understand both the systems that make these technologies
                possible and the opportunities they create when applied
                thoughtfully. That means learning not only what these tools can
                do today, but also their limitations, risks, and long-term
                implications.
              </p>
              <p>
                The world is changing quickly, and I see technology as a force
                that can expand human capability, create new opportunities, and
                reshape entire industries. My goal is to continue learning,
                building, and adapting so I can contribute meaningfully to that
                future while helping others navigate it responsibly.
              </p>
            </div>
            <SidePanel
              label="Focus areas"
              items={[
                "Software",
                "Automation",
                "AI systems",
                "Technology strategy",
              ]}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
