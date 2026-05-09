"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Database,
  FileBox,
  Wrench,
  Copy,
  CheckCheck,
  Brain,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  TRIAGE_INSTRUCTIONS,
  ACCOUNTS_INSTRUCTIONS,
  PAYMENTS_INSTRUCTIONS,
  APPLICATIONS_INSTRUCTIONS,
  AGENT_SUMMARY,
} from "@/lib/agent-prompts";
import type { AgentName, BankDatabase, ToolCallRecord } from "@/lib/types";
import { cn, formatCurrency, shortCid } from "@/lib/utils";
import { useDemoStore } from "@/lib/store";

const PROMPT_BY_AGENT: Record<AgentName, string> = {
  "Triage Agent": TRIAGE_INSTRUCTIONS,
  "Accounts Agent": ACCOUNTS_INSTRUCTIONS,
  "Payments Agent": PAYMENTS_INSTRUCTIONS,
  "Applications Agent": APPLICATIONS_INSTRUCTIONS,
};

const VARIANT_BY_AGENT: Record<
  AgentName,
  "default" | "success" | "warning" | "destructive"
> = {
  "Triage Agent": "default",
  "Accounts Agent": "success",
  "Payments Agent": "warning",
  "Applications Agent": "destructive",
};

interface AgentStateInspectorProps {
  activeAgent: AgentName | null;
  agentTrail: AgentName[];
  toolCalls: ToolCallRecord[];
  callId: string | null;
  hasFinished: boolean;
}

export function AgentStateInspector({
  activeAgent,
  agentTrail,
  toolCalls,
  callId,
  hasFinished,
}: AgentStateInspectorProps) {
  const db = useDemoStore((s) => s.db);
  const ipfsDocs = toolCalls.filter((tc) => tc.ipfs);

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Agent state</span>
        </div>
        <Badge variant="outline" className="font-mono text-[10px]">
          openai/swarm
        </Badge>
      </div>

      <Tabs defaultValue="state" className="flex-1">
        <div className="px-5 pt-3">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="state">State</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="state" className="m-0 flex-1 overflow-hidden">
          <ScrollArea className="h-[460px]">
            <CardContent className="space-y-4 px-5 pb-5 pt-4">
              <AgentBadgeStrip
                activeAgent={activeAgent}
                agentTrail={agentTrail}
              />
              <Separator />
              <DbDeltaCard db={db} />
              {ipfsDocs.length > 0 && (
                <>
                  <Separator />
                  <IpfsCard
                    items={ipfsDocs.map((tc) => ({
                      cid: tc.ipfs!.cid,
                      doc: tc.ipfs!.doc,
                    }))}
                  />
                </>
              )}
              {hasFinished && callId && (
                <>
                  <Separator />
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Link href="/console">
                      Open in Operator Console
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="tools" className="m-0 flex-1 overflow-hidden">
          <ScrollArea className="h-[460px]">
            <CardContent className="space-y-2 px-5 pb-5 pt-4">
              {toolCalls.length === 0 ? (
                <EmptyHint icon={<Wrench className="h-4 w-4" />}>
                  Tools fired by the agents will land here.
                </EmptyHint>
              ) : (
                <AnimatePresence initial={false}>
                  {toolCalls.map((tc) => (
                    <motion.div
                      key={tc.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-lg border border-border/70 bg-muted/20 p-3"
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <Badge
                          variant={VARIANT_BY_AGENT[tc.agent]}
                          className="text-[10px]"
                        >
                          {tc.agent}
                        </Badge>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          tool_call
                        </span>
                      </div>
                      <p className="[overflow-wrap:anywhere] font-mono text-xs leading-relaxed">
                        <span className="text-foreground">{tc.name}</span>
                        <span className="text-muted-foreground">
                          ({JSON.stringify(tc.args)})
                        </span>
                      </p>
                      {tc.result && (
                        <p className="mt-1 [overflow-wrap:anywhere] font-mono text-[11px] leading-relaxed text-muted-foreground">
                          → {tc.result}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </CardContent>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="prompts" className="m-0 flex-1 overflow-hidden">
          <ScrollArea className="h-[460px]">
            <CardContent className="space-y-3 px-5 pb-5 pt-4">
              <PromptCard
                agent="Triage Agent"
                active={activeAgent === "Triage Agent"}
              />
              <PromptCard
                agent="Accounts Agent"
                active={activeAgent === "Accounts Agent"}
              />
              <PromptCard
                agent="Payments Agent"
                active={activeAgent === "Payments Agent"}
              />
              <PromptCard
                agent="Applications Agent"
                active={activeAgent === "Applications Agent"}
              />
            </CardContent>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function AgentBadgeStrip({
  activeAgent,
  agentTrail,
}: {
  activeAgent: AgentName | null;
  agentTrail: AgentName[];
}) {
  const all: AgentName[] = [
    "Triage Agent",
    "Accounts Agent",
    "Payments Agent",
    "Applications Agent",
  ];
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Active agent
      </p>
      <div className="grid grid-cols-2 gap-2">
        {all.map((agent) => {
          const isActive = activeAgent === agent;
          const inTrail = agentTrail.includes(agent);
          const summary = AGENT_SUMMARY[agent];
          return (
            <motion.div
              key={agent}
              animate={{
                scale: isActive ? 1 : 0.98,
                opacity: isActive || inTrail ? 1 : 0.55,
              }}
              transition={{ duration: 0.2 }}
              className={cn(
                "rounded-lg border px-3 py-2",
                isActive
                  ? "border-primary/60 bg-primary/10 shadow-sm shadow-primary/30"
                  : "border-border bg-card",
              )}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    isActive
                      ? "bg-primary"
                      : inTrail
                        ? "bg-muted-foreground"
                        : "bg-border",
                  )}
                />
                <span className="text-[11px] font-medium leading-none">
                  {agent.replace(" Agent", "")}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">
                {summary.blurb}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function DbDeltaCard({ db }: { db: BankDatabase }) {
  const accounts = Object.entries(db.accounts).slice(0, 4);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Bank database
        </p>
        <Badge variant="outline" className="text-[10px]">
          <Database className="mr-1 h-3 w-3" /> in-memory
        </Badge>
      </div>
      <div className="space-y-1.5">
        {accounts.map(([id, acc]) => (
          <div
            key={id}
            className="flex items-center justify-between rounded-md border border-border/60 bg-card/40 px-2.5 py-1.5"
          >
            <span className="font-mono text-[11px] text-muted-foreground">
              {id}
            </span>
            <span className="font-mono text-[11px] tabular-nums">
              {formatCurrency(acc.balance)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IpfsCard({ items }: { items: { cid: string; doc: string }[] }) {
  const [copied, setCopied] = React.useState<string | null>(null);
  const copy = async (cid: string) => {
    await navigator.clipboard.writeText(cid);
    setCopied(cid);
    setTimeout(() => setCopied(null), 1500);
  };
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Pinned to IPFS · Pinata
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.cid}
            className="rounded-lg border border-success/30 bg-success/5 p-2.5"
          >
            <div className="mb-1.5 flex items-center gap-2">
              <FileBox className="h-3.5 w-3.5 text-success" />
              <span className="text-[11px] font-medium">{item.doc}</span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded bg-background/60 px-2 py-1">
              <span className="truncate font-mono text-[10px] text-muted-foreground">
                {shortCid(item.cid)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => copy(item.cid)}
              >
                {copied === item.cid ? (
                  <CheckCheck className="h-3 w-3 text-success" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromptCard({
  agent,
  active,
}: {
  agent: AgentName;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        active ? "border-primary/60 bg-primary/5" : "border-border bg-card/40",
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-semibold">{agent}</span>
        </div>
        {active && (
          <Badge variant="ghost" className="text-[9px]">
            active
          </Badge>
        )}
      </div>
      <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-muted-foreground scrollbar-thin">
        {PROMPT_BY_AGENT[agent]}
      </pre>
    </div>
  );
}

function EmptyHint({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border/70 px-4 py-10 text-center text-xs text-muted-foreground">
      <div className="text-muted-foreground/50">{icon}</div>
      {children}
    </div>
  );
}
