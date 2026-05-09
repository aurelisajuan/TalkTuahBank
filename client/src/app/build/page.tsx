import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Github,
  Lightbulb,
  Phone,
  Wrench,
  Zap,
  Youtube,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata = {
  title: "Build Notes",
  description:
    "What we shipped in 24 hours, why we shipped it that way, and what we'd do next. Tech stack and lessons learned from HackUTD 2024.",
};

const STACK = [
  {
    group: "Original backend",
    items: [
      { name: "FastAPI", purpose: "WebSocket bridge for Retell + console" },
      { name: "Retell AI", purpose: "Telephony, STT, TTS, barge-in" },
      { name: "OpenAI Swarm", purpose: "Multi-agent handoffs" },
      { name: "OpenAI Chat", purpose: "GPT-4o for triage + specialists" },
      { name: "pdflatex", purpose: "Server-side application docs" },
      { name: "Pinata · IPFS", purpose: "Pin and address application PDFs" },
    ],
  },
  {
    group: "Frontend (rebuilt)",
    items: [
      { name: "Next.js 15", purpose: "App Router + RSC + route handlers" },
      { name: "React 19", purpose: "Concurrent rendering for streamed UIs" },
      { name: "Tailwind v4", purpose: "@theme inline tokens, OKLCH palette" },
      {
        name: "shadcn/ui patterns",
        purpose: "Composable Radix + Tailwind primitives",
      },
      { name: "Framer Motion", purpose: "Page transitions + agent handoff" },
      { name: "Lucide", purpose: "Icon set" },
      { name: "Mermaid", purpose: "Architecture topology diagram" },
    ],
  },
  {
    group: "Live AI tab",
    items: [
      { name: "Vercel AI SDK v6", purpose: "streamText + tool loop" },
      {
        name: "Vercel AI Gateway",
        purpose: "OIDC auth, model routing, observability",
      },
      { name: "@ai-sdk/react · useChat", purpose: "Streaming UI hook" },
      { name: "Zod", purpose: "Tool input schemas" },
      { name: "Zustand", purpose: "Console + demo store, mirrors WS contract" },
    ],
  },
];

const TIMELINE = [
  {
    when: "H+0 → H+4",
    what: "Idea + scope lock",
    detail:
      "Picked the unbanked angle. Outlined four agents and the operator console. Stubbed the FastAPI WebSocket loop and got a Retell test call to echo a hard-coded response.",
  },
  {
    when: "H+4 → H+10",
    what: "Multi-agent skeleton",
    detail:
      "Wired OpenAI Swarm with Triage → {Accounts, Payments, Applications}. Got the first end-to-end balance lookup over a real call.",
  },
  {
    when: "H+10 → H+16",
    what: "Money + applications",
    detail:
      "Implemented transfer, schedule, cancel against the in-memory ledger. Built the LaTeX → PDF → Pinata pipeline for loan and credit-card flows.",
  },
  {
    when: "H+16 → H+22",
    what: "Operator console",
    detail:
      "Second WebSocket from FastAPI to a Next.js dashboard. Live transcripts, customer profile, sensitive-info masking, document grid with status pills.",
  },
  {
    when: "H+22 → H+24",
    what: "Polish + demo prep",
    detail:
      "Tightened prompts, smoothed handoffs, killed echo. Recorded the 2-min video. Slept for ~45 min. Won.",
  },
];

const LESSONS = [
  {
    icon: <Phone className="h-4 w-4 text-primary" />,
    title: "The interface is the moat.",
    body: "Picking phone-call as the surface forced every other decision: short responses, barge-in handling, deterministic tool calls, no markdown. It also made the demo legible to non-technical judges.",
  },
  {
    icon: <Wrench className="h-4 w-4 text-primary" />,
    title: "Handoff-as-a-tool stays sane under fatigue.",
    body: "Treating agent transitions as plain function calls meant we could reason about the flow at 3am the same way we did at 9am. No hidden state in a router.",
  },
  {
    icon: <Zap className="h-4 w-4 text-primary" />,
    title: "Two streams beat one fat one.",
    body: "Splitting the Retell LLM socket from the operator-console socket let the UI evolve without renegotiating the agent contract. We could rebuild the dashboard the next day without touching the agents.",
  },
  {
    icon: <Lightbulb className="h-4 w-4 text-primary" />,
    title: "IPFS gave us a free narrative.",
    body: "The CID is the demo's hero detail. Tamper-evident, content-addressed, and provably the same artifact the underwriter pulls up. Pinata made it a 30-line integration instead of a weekend.",
  },
];

const NEXT = [
  "Replace the in-memory dictionary with Postgres + Prisma; keep the same shape so the agent tools don't change.",
  "Add real authentication on the operator console (Clerk or NextAuth).",
  "Promote the Live AI tab to a fully voice-driven mode: STT → tool loop → SSML → TTS, all via the AI SDK.",
  "Build a playback feature in the operator console — replay any scripted scenario at adjustable speed.",
  "Wire SGP tracing on every tool call so we get a per-step latency + cost breakdown for free.",
];

export default function BuildPage() {
  return (
    <div className="container space-y-12 py-10">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          · Build Notes
        </span>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Twenty-four hours, three engineers, four agents.
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          A retrospective on what we built at HackUTD 2024, why we built it
          that way, and what stayed in for the rebuilt project page you're
          reading right now.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Button asChild size="sm">
            <Link href="/demo">
              Try the demo <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a
              href="https://devpost.com/software/talktuahbank"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Devpost submission
            </a>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <a
              href="https://www.youtube.com/watch?v=YsH_z1azXSA"
              target="_blank"
              rel="noreferrer"
            >
              <Youtube className="h-3.5 w-3.5" /> Demo video
            </a>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <a
              href="https://github.com/aurelisajuan/TalkTuahBank"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-3.5 w-3.5" /> Source
            </a>
          </Button>
        </div>
      </header>

      {/* Stack */}
      <section className="space-y-4">
        <SectionHeading
          eyebrow="01 · Stack"
          title="What we picked, and what we picked it for."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {STACK.map((group) => (
            <Card key={group.group}>
              <CardContent className="p-5">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {group.group}
                </p>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-start justify-between gap-3 border-b border-border/40 pb-2 last:border-0 last:pb-0"
                    >
                      <span className="text-sm font-medium">
                        {item.name}
                      </span>
                      <span className="text-right text-[11px] text-muted-foreground">
                        {item.purpose}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="space-y-4">
        <SectionHeading
          eyebrow="02 · 24-hour timeline"
          title="What we shipped, by clock-hour."
        />
        <div className="relative space-y-3">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border md:left-[110px]" />
          {TIMELINE.map((step, i) => (
            <div
              key={i}
              className="relative grid grid-cols-[16px_minmax(0,1fr)] items-start gap-4 md:grid-cols-[120px_16px_minmax(0,1fr)]"
            >
              <span className="hidden font-mono text-[11px] text-muted-foreground md:block">
                {step.when}
              </span>
              <span className="relative z-10 mt-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-primary bg-background">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <Card>
                <CardContent className="space-y-1 p-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="ghost"
                      className="font-mono text-[10px] md:hidden"
                    >
                      <Clock className="h-3 w-3" /> {step.when}
                    </Badge>
                    <span className="text-sm font-semibold">
                      {step.what}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {step.detail}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Lessons */}
      <section className="space-y-4">
        <SectionHeading
          eyebrow="03 · Lessons"
          title="What we'd repeat on the next 24-hour build."
        />
        <div className="grid gap-3 md:grid-cols-2">
          {LESSONS.map((l) => (
            <Card key={l.title}>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                    {l.icon}
                  </div>
                  <span className="text-sm font-semibold">{l.title}</span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {l.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* What's next */}
      <section className="space-y-4">
        <SectionHeading
          eyebrow="04 · What's next"
          title="Things we'd do if we had another weekend."
        />
        <Card>
          <CardContent className="p-5">
            <ul className="space-y-2.5">
              {NEXT.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Self-host */}
      <Separator />
      <section className="space-y-3">
        <SectionHeading
          eyebrow="05 · Self-host"
          title="Run the original Python backend."
          description="The full FastAPI server is in server/ with a one-step launcher and an .env-driven config."
        />
        <Card>
          <CardContent className="space-y-4 p-5">
            <pre className="overflow-x-auto rounded-lg bg-muted/40 p-4 font-mono text-xs leading-relaxed">
              <code>{`# Terminal A — backend
cd server
pip install -r requirements.txt
export RETELL_API_KEY=...      # required for telephony
export OPENAI_API_KEY=...      # required for the LLM
export PINATA_API_KEY=...      # required for IPFS pinning
export PINATA_API_SECRET=...
uvicorn main:app --reload --port 8000

# Terminal B — operator console
cd client
pnpm install
# (optional) AI_GATEWAY_API_KEY=... to enable the Live AI tab
pnpm dev`}</code>
            </pre>
            <p className="text-xs text-muted-foreground">
              To re-enable the live FastAPI WebSocket on the operator console,
              open a connection in <code className="rounded bg-muted px-1 font-mono">src/lib/store.ts</code>{" "}
              and pipe each parsed JSON message into{" "}
              <code className="rounded bg-muted px-1 font-mono">
                useDemoStore.getState().dispatchEvent(event)
              </code>
              . The store reducer already speaks the original
              <code className="rounded bg-muted px-1 font-mono">
                combined_response
              </code>
              {" / "}
              <code className="rounded bg-muted px-1 font-mono">
                db_response
              </code>
              {" / "}
              <code className="rounded bg-muted px-1 font-mono">
                calls_response
              </code>{" "}
              shape from <code className="rounded bg-muted px-1 font-mono">server/main.py</code>.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
