"use client";

import { Phone, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatPhone } from "@/lib/utils";
import type { Call } from "@/lib/types";

interface CallListProps {
  calls: Record<string, Call>;
  selectedId: string;
  onSelect: (id: string) => void;
  callerName: (userId: string) => string | undefined;
}

export function CallList({
  calls,
  selectedId,
  onSelect,
  callerName,
}: CallListProps) {
  const entries = Object.entries(calls).sort(
    ([, a], [, b]) =>
      new Date(b.time ?? 0).getTime() - new Date(a.time ?? 0).getTime(),
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Recent calls</span>
        </div>
        <Badge variant="outline" className="font-mono text-[10px]">
          {entries.length}
        </Badge>
      </div>
      <ScrollArea className="flex-1">
        <ul className="divide-y divide-border/50">
          {entries.map(([id, call]) => {
            const active = id === selectedId;
            const name = callerName(call.user_id) ?? "Unknown";
            const lastMsg = call.transcript[call.transcript.length - 1];
            const time = call.time
              ? new Date(call.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";
            return (
              <li key={id}>
                <button
                  onClick={() => onSelect(id)}
                  className={cn(
                    "group flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40",
                    active &&
                      "bg-primary/10 hover:bg-primary/15",
                  )}
                >
                  <div
                    className={cn(
                      "mt-1 h-2 w-2 shrink-0 rounded-full",
                      active ? "bg-primary" : "bg-muted-foreground/40",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{name}</p>
                      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                        {time}
                      </span>
                    </div>
                    <p className="truncate font-mono text-[10px] text-muted-foreground">
                      {formatPhone(call.user_id)}
                    </p>
                    {lastMsg && (
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {lastMsg.role === "user" ? "🗣️ " : "🤖 "}
                        {lastMsg.content}
                      </p>
                    )}
                    {call.agent_trail && call.agent_trail.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {call.agent_trail.map((agent) => (
                          <span
                            key={agent}
                            className="inline-flex items-center gap-1 rounded-full border border-border/50 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground"
                          >
                            {agent.replace(" Agent", "")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5",
                      active && "text-primary",
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </div>
  );
}
