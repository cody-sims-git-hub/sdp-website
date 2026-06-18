import { CheckCircle2, Sparkles } from "lucide-react";

/**
 * Decorative hero visual: a glowing code-editor window with floating status
 * chips. Communicates "software developer" and balances the hero composition.
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:mx-0">
      {/* Glow behind the window */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_30%,oklch(0.62_0.2_256/0.35),transparent_70%)] blur-2xl"
      />

      <div className="animate-float relative rounded-xl border border-border bg-card/70 backdrop-blur-xl ring-glow">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[oklch(0.6_0.18_25)]" />
          <span className="h-3 w-3 rounded-full bg-[oklch(0.78_0.13_85)]" />
          <span className="h-3 w-3 rounded-full bg-[oklch(0.72_0.16_150)]" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            next-chapter.ts
          </span>
          <span className="ml-auto rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] font-medium text-primary ring-1 ring-primary/30">
            MPS-AI
          </span>
        </div>

        {/* Code */}
        <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
          <code>
            <span className="text-muted-foreground">
              {"// building, learning, growing"}
            </span>
            {"\n"}
            <span className="text-primary">const</span>{" "}
            <span className="text-foreground">profile</span>
            <span className="text-muted-foreground"> = {"{"}</span>
            {"\n"}
            <span className="text-muted-foreground">{"  "}name</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-tech-cyan">"Cody Sims"</span>
            <span className="text-muted-foreground">,</span>
            {"\n"}
            <span className="text-muted-foreground">{"  "}role</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-tech-cyan">"Software Support Engineer"</span>
            <span className="text-muted-foreground">,</span>
            {"\n"}
            <span className="text-muted-foreground">{"  "}focus</span>
            <span className="text-muted-foreground">: [</span>
            {"\n"}
            <span className="text-tech-cyan">{"    "}"websites"</span>
            <span className="text-muted-foreground">,</span>
            {"\n"}
            <span className="text-tech-cyan">{"    "}"software"</span>
            <span className="text-muted-foreground">,</span>
            {"\n"}
            <span className="text-tech-cyan">{"    "}"automation"</span>
            <span className="text-muted-foreground">,</span>
            {"\n"}
            <span className="text-tech-cyan">{"    "}"ai systems"</span>
            <span className="text-muted-foreground">,</span>
            {"\n"}
            <span className="text-muted-foreground">{"  "}],</span>
            {"\n"}
            <span className="text-muted-foreground">{"  "}status</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-tech-cyan">"building"</span>
            <span className="text-muted-foreground">,</span>
            {"\n"}
            <span className="text-muted-foreground">{"}"}</span>
          </code>
        </pre>
      </div>

      {/* Floating chip — shipped */}
      <div
        className="animate-float absolute -right-4 -top-5 flex items-center gap-2 rounded-lg border border-border bg-card/90 px-3 py-2 shadow-xl backdrop-blur-xl"
        style={{ animationDelay: "1.2s" }}
      >
        <CheckCircle2 className="size-4 text-[oklch(0.72_0.16_150)]" />
        <span className="text-xs font-medium text-foreground">
          Shipped &amp; Deployed
        </span>
      </div>

      {/* Floating chip — remote */}
      <div
        className="animate-float absolute -bottom-5 -left-4 flex items-center gap-2 rounded-lg border border-border bg-card/90 px-3 py-2 shadow-xl backdrop-blur-xl"
        style={{ animationDelay: "0.6s" }}
      >
        <Sparkles className="size-4 text-primary" />
        <span className="text-xs font-medium text-foreground">
          Continuous Improvement
        </span>
      </div>
    </div>
  );
}
