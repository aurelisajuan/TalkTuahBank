"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  PhoneOff,
  Phone,
  Volume2,
  VolumeX,
  PlayCircle,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SCENARIOS, type Scenario } from "@/lib/mock-scenarios";
import { initialDatabase } from "@/lib/mock-bank";
import { formatPhone } from "@/lib/utils";

interface PhonePanelProps {
  scenarioId: string;
  onScenarioChange: (id: string) => void;
  isRunning: boolean;
  hasFinished: boolean;
  speakEnabled: boolean;
  onToggleSpeak: () => void;
  onStart: () => void;
  onEnd: () => void;
  onReset: () => void;
}

export function PhonePanel({
  scenarioId,
  onScenarioChange,
  isRunning,
  hasFinished,
  speakEnabled,
  onToggleSpeak,
  onStart,
  onEnd,
  onReset,
}: PhonePanelProps) {
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) as Scenario;
  const caller = initialDatabase.users[scenario.callerPhone];
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    if (!isRunning) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isRunning]);

  React.useEffect(() => {
    if (!isRunning && !hasFinished) setSeconds(0);
  }, [isRunning, hasFinished]);

  const initials = caller?.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <Badge variant="ghost" className="font-mono text-[10px]">
            {scenario.intentTag}
          </Badge>
          <span className="font-mono text-[10px] text-muted-foreground">
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-primary/30">
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials ?? "??"}
              </AvatarFallback>
            </Avatar>
            {isRunning && (
              <span className="absolute -inset-0.5 animate-pulse-ring rounded-full" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {caller?.name ?? "Unknown caller"}
            </p>
            <p className="truncate font-mono text-xs text-muted-foreground">
              {formatPhone(scenario.callerPhone)}
            </p>
          </div>
        </div>

        <Waveform active={isRunning} />

        <Separator />

        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Scenario
          </label>
          <Select
            value={scenarioId}
            onValueChange={onScenarioChange}
            disabled={isRunning}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SCENARIOS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {scenario.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isRunning && !hasFinished && (
            <Button onClick={onStart} className="w-full" size="lg">
              <Phone className="h-4 w-4" /> Place call
            </Button>
          )}
          {isRunning && (
            <Button
              onClick={onEnd}
              variant="destructive"
              size="lg"
              className="w-full"
            >
              <PhoneOff className="h-4 w-4" /> End call
            </Button>
          )}
          {!isRunning && hasFinished && (
            <Button
              onClick={onReset}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4" /> Run another scenario
            </Button>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleSpeak}
                aria-label="Toggle voice"
              >
                {speakEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {speakEnabled
                ? "Voice on (browser SpeechSynthesis)"
                : "Voice off"}
            </TooltipContent>
          </Tooltip>
        </div>

        {!isRunning && !hasFinished && (
          <div className="rounded-lg border border-dashed border-border/70 bg-card/40 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <PlayCircle className="h-3.5 w-3.5 text-primary" />
              Press place call to dial in. Transcript and agent state stream on
              the right.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Waveform({ active }: { active: boolean }) {
  const bars = React.useMemo(() => Array.from({ length: 28 }), []);
  return (
    <div className="flex h-12 items-end justify-between gap-[3px] rounded-md bg-muted/50 px-2 py-2">
      {bars.map((_, i) => (
        <motion.span
          key={i}
          className="block w-[3px] rounded-full bg-primary/70"
          animate={{
            height: active
              ? [
                  4 + Math.random() * 8,
                  10 + Math.random() * 24,
                  4 + Math.random() * 8,
                ]
              : 4,
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.04,
          }}
        />
      ))}
    </div>
  );
}
