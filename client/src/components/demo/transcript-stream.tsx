"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, ArrowRightLeft, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { AgentName } from "@/lib/types";

export type TranscriptItem =
  | {
      kind: "message";
      id: string;
      role: "user" | "assistant";
      content: string;
      agent?: AgentName;
      pending?: boolean;
    }
  | {
      kind: "handoff";
      id: string;
      to: AgentName;
      reason: string;
    }
  | {
      kind: "tool";
      id: string;
      agent: AgentName;
      name: string;
      summary: string;
    };

interface TranscriptStreamProps {
  items: TranscriptItem[];
  emptyHint?: string;
}

export function TranscriptStream({ items, emptyHint }: TranscriptStreamProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [items]);

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-sm font-medium">Live transcript</span>
        </div>
        <Badge variant="outline" className="font-mono text-[10px]">
          ws://retell-llm
        </Badge>
      </div>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-[520px]">
          <div ref={scrollRef} className="flex flex-col gap-3 p-5 scrollbar-thin">
            {items.length === 0 && (
              <div className="flex h-[460px] flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <Bot className="h-8 w-8 text-muted-foreground/40" />
                <p>{emptyHint ?? "No active call."}</p>
              </div>
            )}

            <AnimatePresence initial={false}>
              {items.map((item) => {
                if (item.kind === "handoff") {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3"
                    >
                      <div className="h-px flex-1 bg-border" />
                      <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                        <ArrowRightLeft className="h-3 w-3" />
                        Handoff → {item.to}
                      </div>
                      <div className="h-px flex-1 bg-border" />
                    </motion.div>
                  );
                }

                if (item.kind === "tool") {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-12 flex items-start gap-2 rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
                    >
                      <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                      <div className="min-w-0 flex-1 break-words font-mono text-[11px] leading-relaxed">
                        <span className="text-warning">{item.agent}</span>
                        <span className="text-muted-foreground/60"> · </span>
                        <span className="text-foreground">{item.name}()</span>
                        <span className="text-muted-foreground/60"> → </span>
                        <span className="text-muted-foreground">
                          {item.summary}
                        </span>
                      </div>
                    </motion.div>
                  );
                }

                const isUser = item.role === "user";
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex items-start gap-3",
                      isUser && "flex-row-reverse",
                    )}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback
                        className={cn(
                          isUser ? "bg-primary/15 text-primary" : "bg-muted",
                        )}
                      >
                        {isUser ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "max-w-[78%] rounded-2xl border px-4 py-2.5 text-sm shadow-sm",
                        isUser
                          ? "rounded-tr-sm border-primary/40 bg-primary/15 text-foreground"
                          : "rounded-tl-sm border-border bg-card text-foreground",
                      )}
                    >
                      {!isUser && item.agent && (
                        <p className="mb-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                          {item.agent}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {item.content}
                        {item.pending && <Caret />}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function Caret() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-primary align-middle"
    />
  );
}
