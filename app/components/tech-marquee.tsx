// Interleaved across infrastructure, software, DevOps, AI, and tooling so the
// ticker reads as breadth of experience rather than a frontend stack.
const items = [
  "Linux",
  "PHP",
  "Docker",
  "LLMs",
  "Active Directory",
  "Laravel",
  "CI/CD",
  "CUDA",
  "Networking",
  "Python",
  "GitHub Actions",
  "OpenCV",
  "DNS",
  "PostgreSQL",
  "Vector Search",
  "VLANs",
  "REST APIs",
  "Git",
  "TypeScript",
  "Cloud",
  "ngrok",
];

/**
 * One self-contained group of items. The animation moves the track by exactly
 * one group width (-50%), so two identical groups produce a seamless loop. Each
 * group repeats the list enough to stay wider than the viewport, which prevents
 * any blank gap on large screens. The trailing padding matches the inter-item
 * gap so the seam between groups is evenly spaced.
 */
function MarqueeGroup({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-12 pr-12"
    >
      {[...items, ...items].map((item, i) => (
        <li
          key={i}
          className="flex shrink-0 items-center gap-3 font-mono text-sm uppercase tracking-wider text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Infinite-scrolling strip of the stack — adds motion and density. */
export function TechMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-border bg-card/30 py-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="animate-marquee flex w-max">
        <MarqueeGroup />
        <MarqueeGroup ariaHidden />
      </div>
    </div>
  );
}
