"use client";

import * as React from "react";
import { fakeIpfsCid } from "@/lib/utils";
import { useDemoStore, makeFakeDocument } from "@/lib/store";
import { getScenario, type ScenarioStepKind } from "@/lib/mock-scenarios";
import type { TranscriptItem } from "@/components/demo/transcript-stream";
import type { AgentName } from "@/lib/types";

const TYPE_SPEED_MS = 22;
const USER_DELAY_MS = 600;
const POST_TOOL_DELAY_MS = 450;

interface RunOptions {
  scenarioId: string;
  speak: boolean;
}

interface RunnerApi {
  items: TranscriptItem[];
  isRunning: boolean;
  hasFinished: boolean;
  start: (opts: RunOptions) => void;
  abort: () => void;
  reset: () => void;
}

export function useGuidedRunner(): RunnerApi {
  const store = useDemoStore();
  const [items, setItems] = React.useState<TranscriptItem[]>([]);
  const [isRunning, setIsRunning] = React.useState(false);
  const [hasFinished, setHasFinished] = React.useState(false);
  const abortRef = React.useRef<{ aborted: boolean }>({ aborted: false });

  const speak = React.useCallback((text: string, enabled: boolean) => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.05;
    utter.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, []);

  const start = React.useCallback(
    async (opts: RunOptions) => {
      const scenario = getScenario(opts.scenarioId);
      if (!scenario) return;

      abortRef.current = { aborted: false };
      setItems([]);
      setIsRunning(true);
      setHasFinished(false);
      store.resetDemo();
      const callId = `call-${Date.now()}`;
      store.startCall(callId, scenario.callerPhone);

      const sleep = (ms: number) =>
        new Promise<void>((resolve) => setTimeout(resolve, ms));

      const guard = () => abortRef.current.aborted;

      for (const step of scenario.steps) {
        if (guard()) break;
        await playStep(step, {
          callId,
          opts,
          speak,
          guard,
          appendItem: (item) =>
            setItems((prev) => [...prev, item]),
          updateItem: (id, updater) =>
            setItems((prev) =>
              prev.map((it) =>
                it.id === id && it.kind === "message"
                  ? { ...it, ...updater(it) }
                  : it,
              ),
            ),
          sleep,
          store,
        });
      }

      if (!guard()) {
        setHasFinished(true);
      }
      setIsRunning(false);
    },
    [speak, store],
  );

  const abort = React.useCallback(() => {
    abortRef.current = { aborted: true };
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsRunning(false);
    setHasFinished(true);
  }, []);

  const reset = React.useCallback(() => {
    abortRef.current = { aborted: true };
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setItems([]);
    setIsRunning(false);
    setHasFinished(false);
    store.resetDemo();
  }, [store]);

  return { items, isRunning, hasFinished, start, abort, reset };
}

interface PlayContext {
  callId: string;
  opts: RunOptions;
  speak: (text: string, enabled: boolean) => void;
  guard: () => boolean;
  appendItem: (item: TranscriptItem) => void;
  updateItem: (
    id: string,
    updater: (prev: TranscriptItem & { kind: "message" }) => Partial<
      TranscriptItem & { kind: "message" }
    >,
  ) => void;
  sleep: (ms: number) => Promise<void>;
  store: ReturnType<typeof useDemoStore.getState>;
}

async function playStep(step: ScenarioStepKind, ctx: PlayContext) {
  if (ctx.guard()) return;
  if (step.type === "say") {
    if (step.role === "user") {
      await ctx.sleep(USER_DELAY_MS);
      const id = `m-${Date.now()}-${Math.random()}`;
      ctx.appendItem({
        kind: "message",
        id,
        role: "user",
        content: step.text,
      });
      ctx.store.appendTranscript(ctx.callId, {
        role: "user",
        content: step.text,
      });
      return;
    }
    if (step.agent) ctx.store.setActiveAgent(step.agent);
    const id = `m-${Date.now()}-${Math.random()}`;
    ctx.appendItem({
      kind: "message",
      id,
      role: "assistant",
      agent: step.agent,
      content: "",
      pending: true,
    });
    let buffer = "";
    for (const ch of step.text) {
      if (ctx.guard()) return;
      buffer += ch;
      const snapshot = buffer;
      ctx.updateItem(id, () => ({ content: snapshot, pending: true }));
      await ctx.sleep(TYPE_SPEED_MS);
    }
    ctx.updateItem(id, () => ({ pending: false }));
    ctx.store.appendTranscript(ctx.callId, {
      role: "assistant",
      content: step.text,
    });
    ctx.speak(step.text, ctx.opts.speak);
    return;
  }
  if (step.type === "handoff") {
    ctx.store.setActiveAgent(step.to);
    ctx.appendItem({
      kind: "handoff",
      id: `h-${Date.now()}`,
      to: step.to,
      reason: step.reason,
    });
    await ctx.sleep(450);
    return;
  }
  if (step.type === "tool") {
    handleMutation(step, ctx);
    let summary = step.result;
    let ipfs: { cid: string; doc: string } | undefined;
    if (step.attachIpfs) {
      const cid = fakeIpfsCid();
      ipfs = { cid, doc: step.attachIpfs.docName };
      const doc = makeFakeDocument(step.attachIpfs.docName);
      doc.ipfs_hash = cid;
      ctx.store.attachDocument(ctx.callId, doc);
      summary = `${step.result} pinned at ${cid.slice(0, 12)}…`;
    }
    ctx.store.recordToolCall({
      agent: step.agent,
      name: step.name,
      args: step.args,
      result: step.result,
      ipfs,
    });
    ctx.appendItem({
      kind: "tool",
      id: `t-${Date.now()}-${Math.random()}`,
      agent: step.agent,
      name: step.name,
      summary,
    });
    await ctx.sleep(POST_TOOL_DELAY_MS);
  }
}

function handleMutation(
  step: Extract<ScenarioStepKind, { type: "tool" }>,
  ctx: PlayContext,
) {
  const m = step.mutates;
  if (!m) return;
  if (m.kind === "transfer") {
    const { from, to, amount } = m.payload as {
      from: string;
      to: string;
      amount: number;
    };
    ctx.store.applyTransfer(from, to, amount);
  } else if (m.kind === "schedule") {
    const { from, to, amount, date } = m.payload as {
      from: string;
      to: string;
      amount: number;
      date: string;
    };
    ctx.store.applySchedule(from, to, amount, date);
  } else if (m.kind === "cancel") {
    const { payment_id } = m.payload as { payment_id: string };
    ctx.store.applyCancel(payment_id);
  }
}

export function deriveAgentTrail(items: TranscriptItem[]): AgentName[] {
  const set = new Set<AgentName>();
  for (const it of items) {
    if (it.kind === "message" && it.agent) set.add(it.agent);
    else if (it.kind === "handoff") set.add(it.to);
    else if (it.kind === "tool") set.add(it.agent);
  }
  return Array.from(set);
}
