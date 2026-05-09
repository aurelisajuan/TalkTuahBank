"use client";

import * as React from "react";
import { PhonePanel } from "@/components/demo/phone-panel";
import { TranscriptStream } from "@/components/demo/transcript-stream";
import { AgentStateInspector } from "@/components/demo/agent-state-inspector";
import {
  useGuidedRunner,
  deriveAgentTrail,
} from "@/components/demo/use-guided-runner";
import { useDemoStore } from "@/lib/store";

export function GuidedDemo() {
  const [scenarioId, setScenarioId] = React.useState("transfer-funds");
  const [speak, setSpeak] = React.useState(false);
  const runner = useGuidedRunner();
  const activeAgent = useDemoStore((s) => s.activeAgent);
  const callId = useDemoStore((s) => s.activeCallId);
  const toolCalls = useDemoStore((s) => s.toolCalls);

  const handleStart = () => runner.start({ scenarioId, speak });
  const handleEnd = () => runner.abort();
  const handleReset = () => runner.reset();

  const agentTrail = React.useMemo(
    () => deriveAgentTrail(runner.items),
    [runner.items],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)_360px]">
      <PhonePanel
        scenarioId={scenarioId}
        onScenarioChange={setScenarioId}
        isRunning={runner.isRunning}
        hasFinished={runner.hasFinished}
        speakEnabled={speak}
        onToggleSpeak={() => setSpeak((s) => !s)}
        onStart={handleStart}
        onEnd={handleEnd}
        onReset={handleReset}
      />
      <TranscriptStream
        items={runner.items}
        emptyHint="Press place call to start the scenario."
      />
      <AgentStateInspector
        activeAgent={activeAgent}
        agentTrail={agentTrail}
        toolCalls={toolCalls}
        callId={callId}
        hasFinished={runner.hasFinished}
      />
    </div>
  );
}
