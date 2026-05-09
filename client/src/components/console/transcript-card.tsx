"use client";

import { Bot, User, UserCog } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Call } from "@/lib/types";

interface TranscriptCardProps {
  call?: Call;
}

export function TranscriptCard({ call }: TranscriptCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Chat transcript</span>
          {call && (
            <Badge variant="outline" className="font-mono text-[10px]">
              call · {call.id.slice(-12)}
            </Badge>
          )}
        </div>
        {call && (
          <Button size="sm">
            <UserCog className="h-4 w-4" /> Transfer to live agent
          </Button>
        )}
      </div>
      <ScrollArea className="h-[480px]">
        <div className="space-y-3 p-5">
          {!call ? (
            <div className="flex h-[420px] flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
              <Bot className="h-8 w-8 text-muted-foreground/40" />
              <p>Select a conversation from the sidebar.</p>
            </div>
          ) : call.transcript.length === 0 ? (
            <div className="flex h-[420px] items-center justify-center text-sm text-muted-foreground">
              No transcript captured yet.
            </div>
          ) : (
            call.transcript.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={i}
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
                    <p className="mb-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                      {m.role}
                    </p>
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {m.content}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
