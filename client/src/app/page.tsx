import Link from "next/link";
import {
  ArrowRight,
  Phone,
  Workflow,
  Cloud,
  Github,
  Youtube,
  ExternalLink,
  MapPin,
  CalendarDays,
  Users,
  Trophy,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AwardBadge } from "@/components/site/award-badge";
import { SectionHeading } from "@/components/site/section-heading";
import { DemoVideo } from "@/components/site/demo-video";

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-50" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,var(--color-primary),transparent_70%)] opacity-20" />

        <div className="container py-16 md:py-24">
          <div className="mx-auto flex max-w-4xl flex-col items-start gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <AwardBadge variant="overall" />
              <AwardBadge variant="track" />
            </div>
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Voice banking for the{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-foreground bg-clip-text text-transparent">
                1.7 billion
              </span>{" "}
              adults without a bank account.
            </h1>
            <p className="max-w-2xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
              TalkTuahBank is a multi-agent conversational AI that runs over a
              regular phone call — no internet, no smartphone, no banking
              app. Built in 24 hours and crowned overall champion at HackUTD
              2024 across more than 1,100 hackers.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="xl">
                <Link href="/demo">
                  Try the walkthrough <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <a href="#demo-reel">
                  <Youtube className="h-4 w-4" /> Watch the 2-min demo
                </a>
              </Button>
              <Button asChild size="xl" variant="ghost">
                <a
                  href="https://github.com/aurelisajuan/TalkTuahBank"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github className="h-4 w-4" /> View source
                </a>
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="font-mono uppercase tracking-wider text-muted-foreground/70">
                Stack
              </span>
              {[
                "Retell AI",
                "OpenAI Swarm",
                "FastAPI",
                "Pinata · IPFS",
                "Next.js 15",
                "Vercel AI SDK",
              ].map((s) => (
                <Badge
                  key={s}
                  variant="outline"
                  className="font-mono text-[10px]"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo reel */}
      <section id="demo-reel" className="container scroll-mt-24 -mt-2 pb-16">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Demo reel"
            title="Two minutes of the agent on a real call."
            description="A live phone call routed through Retell AI into the multi-agent FastAPI server. Caller verifies their identity, transfers funds, applies for a loan, and the operator console updates in real time."
            className="mb-6"
          />
          <DemoVideo
            videoId="YsH_z1azXSA"
            title="TalkTuahBank · HackUTD 2024 demo"
          />
        </div>
      </section>

      {/* What this is */}
      <section className="container py-16">
        <SectionHeading
          eyebrow="What this is"
          title="A 24-hour project that took the right shortcuts."
          description="Three production-quality decisions stacked together and held to a phone-call interface. Each card links to the system design page."
          className="mb-10"
        />
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<Phone className="h-5 w-5 text-primary" />}
            title="Telephony, not chat."
            body="Inbound PSTN calls land in Retell AI, which streams transcript chunks over a bidirectional WebSocket to the FastAPI server."
          />
          <FeatureCard
            icon={<Workflow className="h-5 w-5 text-primary" />}
            title="A swarm of focused agents."
            body="Triage, Accounts, Payments, and Applications agents — each with their own prompt and tool surface — coordinated via OpenAI Swarm handoff functions."
          />
          <FeatureCard
            icon={<Cloud className="h-5 w-5 text-primary" />}
            title="Tamper-evident artifacts."
            body="Loan and credit-card application PDFs are rendered server-side with LaTeX and pinned to IPFS through Pinata. The CID flows through to the operator console."
          />
        </div>
      </section>

      {/* How we won */}
      <section className="container py-16">
        <Card className="overflow-hidden">
          <CardContent className="grid gap-6 p-8 md:grid-cols-[auto_1fr] md:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 ring-2 ring-primary/30">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  HackUTD 2024 · Ripple Effect
                </p>
                <p className="text-base font-semibold">
                  Overall 1st Place · Goldman Sachs Track Winner
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Stat
                icon={<CalendarDays className="h-3.5 w-3.5" />}
                label="Dates"
                value="Nov 16 – 17, 2024"
              />
              <Stat
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Venue"
                value="ECSW · UT Dallas"
              />
              <Stat
                icon={<Users className="h-3.5 w-3.5" />}
                label="Hackers"
                value="1,100+"
              />
              <Stat
                icon={<Sparkles className="h-3.5 w-3.5" />}
                label="Prize pool"
                value="$120,810"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Team */}
      <section className="container py-16">
        <SectionHeading
          eyebrow="Team"
          title="Three engineers, one weekend."
          className="mb-8"
        />
        <div className="grid gap-3 md:grid-cols-3">
          <TeamCard
            name="Aurelisa Juan"
            handle="aurelisajuan"
            role="Voice agent design + product"
            link="https://devpost.com/aurelisajuan"
          />
          <TeamCard
            name="Bill Zhang"
            handle="IdkwhatImD0ing"
            role="Swarm + backend orchestration"
            link="https://devpost.com/IdkwhatImD0ing"
          />
          <TeamCard
            name="Warren Yun"
            handle="NebuDev14"
            role="Operator console + IPFS pipeline"
            link="https://devpost.com/NebuDev14"
          />
        </div>
      </section>

      {/* Three doors */}
      <section className="container py-16">
        <Separator className="mb-10" />
        <div className="grid gap-3 md:grid-cols-3">
          <NavDoor
            href="/demo"
            label="Try the demo"
            description="A guided walkthrough of every multi-agent scenario, plus an optional Live AI tab."
          />
          <NavDoor
            href="/architecture"
            label="Read the architecture"
            description="Annotated excerpts from the real Python source, mermaid topology, and design tradeoffs."
          />
          <NavDoor
            href="/build"
            label="See the build notes"
            description="What we shipped in 24 hours, what we learned, and what we'd do next."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Link href="/architecture" className="group block">
      <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md">
        <CardContent className="space-y-3 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            {icon}
          </div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {body}
          </p>
          <div className="flex items-center gap-1.5 pt-2 text-xs font-medium text-primary">
            See the system design{" "}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="mt-0.5 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function TeamCard({
  name,
  handle,
  role,
  link,
}: {
  name: string;
  handle: string;
  role: string;
  link: string;
}) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
  return (
    <a href={link} target="_blank" rel="noreferrer" className="group block">
      <Card className="transition-colors group-hover:border-primary/40">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-mono text-sm text-primary">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{name}</p>
            <p className="font-mono text-[11px] text-muted-foreground">
              @{handle}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{role}</p>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 transition-colors group-hover:text-primary" />
        </CardContent>
      </Card>
    </a>
  );
}

function NavDoor({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md">
        <CardContent className="space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">{label}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
