import { Suspense } from "react";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GuidedDemo } from "@/components/demo/guided-demo";
import { LiveDemo } from "@/components/demo/live-demo";
import { isLiveAiAvailable } from "@/lib/live-mode";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";

export const metadata = {
  title: "Live Walkthrough",
  description:
    "An interactive walkthrough of the TalkTuahBank multi-agent flow. Pick a scenario or talk to a live LLM that uses the same tool surface as the original Python backend.",
};

export default function DemoPage() {
  const liveAvailable = isLiveAiAvailable();

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" />
      <div className="container space-y-6 py-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              · Interactive Walkthrough
            </span>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Listen in on a TalkTuahBank call.
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Six pre-canned scenarios stream the same multi-agent transcript
              the Python backend produces, plus an optional Live AI tab that
              runs the same tool loop against a real LLM.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/architecture">
                <BookOpen className="h-4 w-4" /> Read the architecture
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/console">
                Open the operator console <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        <Tabs defaultValue="guided" className="w-full">
          <div className="flex items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="guided">Guided Walkthrough</TabsTrigger>
              <TabsTrigger value="live" disabled={!liveAvailable}>
                Live AI
                {!liveAvailable && (
                  <Badge
                    variant="outline"
                    className="ml-2 h-4 px-1.5 text-[9px]"
                  >
                    needs key
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
              {liveAvailable
                ? "live ai · vercel ai gateway"
                : "live ai · disabled (no AI_GATEWAY_API_KEY)"}
            </span>
          </div>

          <TabsContent value="guided">
            <GuidedDemo />
          </TabsContent>

          <TabsContent value="live">
            {liveAvailable ? (
              <Suspense fallback={null}>
                <LiveDemo />
              </Suspense>
            ) : (
              <LiveDisabledState />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function LiveDisabledState() {
  return (
    <div className="flex items-center justify-center rounded-xl border border-dashed border-border/70 bg-card/30 px-6 py-16">
      <div className="max-w-md text-center">
        <Sparkles className="mx-auto mb-3 h-6 w-6 text-primary" />
        <h3 className="text-base font-semibold">
          Live AI is disabled on this deployment
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          To enable real LLM tool calls, set{" "}
          <code className="rounded bg-muted px-1 font-mono text-xs">
            AI_GATEWAY_API_KEY
          </code>{" "}
          or enable the Vercel AI Gateway on the deployment. The Guided
          Walkthrough tab above runs the full multi-agent flow locally —
          no key required.
        </p>
      </div>
    </div>
  );
}
