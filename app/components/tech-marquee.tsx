const items = [
  "React",
  "React Router",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Vite",
  "REST APIs",
  "PostgreSQL",
  "Automation",
  "AI / LLMs",
];

/** Infinite-scrolling strip of the stack — adds motion and density. */
export function TechMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-border bg-card/30 py-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="animate-marquee flex w-max items-center gap-12 pr-12">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-3 font-mono text-sm uppercase tracking-wider text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
