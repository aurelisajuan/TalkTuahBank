"use client";

import * as React from "react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Bot,
  User,
  Phone,
  PhoneOff,
  Wrench,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function LiveDemo() {
  const [input, setInput] = React.useState("");
  const [speak, setSpeak] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const recognitionRef = React.useRef<{
    stop: () => void;
  } | null>(null);
  const lastSpokenRef = React.useRef<string>("");

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  const isStreaming = status === "streaming" || status === "submitted";

  // Optional voice output for the assistant.
  React.useEffect(() => {
    if (!speak || typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    const text = last.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join(" ");
    if (!text || text === lastSpokenRef.current || isStreaming) return;
    lastSpokenRef.current = text;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [messages, speak, isStreaming]);

  // Optional voice input via Web Speech API.
  const startListening = () => {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult:
          | ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void)
          | null;
        onend: (() => void) | null;
        onerror: (() => void) | null;
        start: () => void;
        stop: () => void;
      };
      webkitSpeechRecognition?: typeof w.SpeechRecognition;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) {
        sendMessage({ text: transcript });
        setInput("");
      }
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput("");
  };

  const sttSupported =
    typeof window !== "undefined" &&
    Boolean(
      (window as unknown as { SpeechRecognition?: unknown })
        .SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown })
          .webkitSpeechRecognition,
    );

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)_360px]">
      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <Badge
              variant="ghost"
              className="gap-1.5 font-mono text-[10px]"
            >
              <Sparkles className="h-3 w-3" /> LIVE
            </Badge>
            <span className="font-mono text-[10px] text-muted-foreground">
              gateway · vercel
            </span>
          </div>

          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
            <div className="mb-1.5 flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold">
                Real LLM, real tool calls
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              The same system prompt and tool surface as the Python backend,
              but routed through the Vercel AI Gateway. Bank state is
              ephemeral — each request creates a fresh in-memory database
              clone.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Try saying
            </p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                disabled={isStreaming}
                onClick={() => sendMessage({ text: s })}
                className="block w-full rounded-md border border-border bg-card/40 px-2.5 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          <Separator />

          <div className="flex items-center gap-2">
            {sttSupported ? (
              listening ? (
                <Button
                  onClick={stopListening}
                  variant="destructive"
                  className="w-full"
                >
                  <PhoneOff className="h-4 w-4" /> Stop listening
                </Button>
              ) : (
                <Button onClick={startListening} className="w-full">
                  <Phone className="h-4 w-4" /> Speak (browser STT)
                </Button>
              )
            ) : (
              <p className="w-full rounded-md border border-dashed border-border/70 px-3 py-2 text-center text-[11px] text-muted-foreground">
                Voice input is Chromium-only — type below
              </p>
            )}
            <Button
              variant="outline"
              size="icon"
              aria-label="Toggle assistant voice"
              onClick={() => setSpeak((s) => !s)}
            >
              {speak ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-sm font-medium">
              Conversation · {messages.length} message
              {messages.length === 1 ? "" : "s"}
            </span>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            stream · ai-sdk
          </Badge>
        </div>

        <ScrollArea className="h-[480px]">
          <div className="flex flex-col gap-3 p-5 scrollbar-thin">
            {messages.length === 0 && (
              <div className="flex h-[420px] flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <Mic className="h-8 w-8 text-muted-foreground/40" />
                <p>Say or type something to start the call.</p>
              </div>
            )}
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex items-start gap-3",
                    m.role === "user" && "flex-row-reverse",
                  )}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback
                      className={cn(
                        m.role === "user"
                          ? "bg-primary/15 text-primary"
                          : "bg-muted",
                      )}
                    >
                      {m.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex max-w-[78%] flex-col gap-1.5">
                    {m.parts.map((part, idx) => {
                      if (part.type === "text") {
                        return (
                          <div
                            key={idx}
                            className={cn(
                              "rounded-2xl border px-4 py-2.5 text-sm shadow-sm",
                              m.role === "user"
                                ? "rounded-tr-sm border-primary/40 bg-primary/15 text-foreground"
                                : "rounded-tl-sm border-border bg-card text-foreground",
                            )}
                          >
                            <p className="whitespace-pre-wrap leading-relaxed">
                              {part.text}
                            </p>
                          </div>
                        );
                      }
                      if (part.type.startsWith("tool-")) {
                        const tp = part as unknown as {
                          type: string;
                          toolCallId?: string;
                          input?: unknown;
                          output?: unknown;
                          state?: string;
                        };
                        const toolName = part.type.replace("tool-", "");
                        return (
                          <div
                            key={idx}
                            className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-[11px] font-mono text-muted-foreground"
                          >
                            <div className="mb-1 flex items-center gap-1.5">
                              <Wrench className="h-3 w-3 text-warning" />
                              <span className="text-warning">
                                {toolName}
                              </span>
                              <span className="text-muted-foreground/60">
                                · {tp.state ?? "input-streaming"}
                              </span>
                            </div>
                            {tp.input != null && (
                              <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] text-[10px] leading-snug text-foreground">
                                {JSON.stringify(tp.input, null, 0)}
                              </pre>
                            )}
                            {tp.output != null && (
                              <pre className="mt-1 whitespace-pre-wrap [overflow-wrap:anywhere] text-[10px] leading-snug text-muted-foreground">
                                → {JSON.stringify(tp.output, null, 0)}
                              </pre>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error.message}
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <form onSubmit={onSubmit} className="flex items-center gap-2 p-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a balance, schedule a payment, apply for a loan…"
            className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={isStreaming || !input.trim()}
            size="icon"
            aria-label="Send"
          >
            {isStreaming ? (
              <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-primary-foreground/40 border-t-primary-foreground" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </Card>

      <LiveAgentInspector messages={messages} />
    </div>
  );
}

function LiveAgentInspector({
  messages,
}: {
  messages: ReturnType<typeof useChat>["messages"];
}) {
  const toolEvents = messages
    .filter((m) => m.role === "assistant")
    .flatMap((m) =>
      m.parts.flatMap((p) =>
        p.type.startsWith("tool-")
          ? [
              {
                msgId: m.id,
                name: p.type.replace("tool-", ""),
                part: p as unknown as {
                  input?: unknown;
                  output?: unknown;
                  state?: string;
                  toolCallId?: string;
                },
              },
            ]
          : [],
      ),
    );

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
        <span className="text-sm font-medium">Tool calls</span>
        <Badge variant="outline" className="font-mono text-[10px]">
          {toolEvents.length} call{toolEvents.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <ScrollArea className="h-[520px]">
        <div className="space-y-2 p-5">
          {toolEvents.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border/70 px-4 py-12 text-center text-xs text-muted-foreground">
              <Wrench className="h-5 w-5 text-muted-foreground/40" />
              <p>
                Tool invocations made by the LLM will appear here in real
                time.
              </p>
            </div>
          ) : (
            toolEvents.map((ev, i) => (
              <div
                key={`${ev.msgId}-${i}`}
                className="rounded-lg border border-border/70 bg-muted/20 p-3"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-foreground">
                    {ev.name}()
                  </span>
                  <Badge variant="ghost" className="text-[9px]">
                    {ev.part.state ?? "—"}
                  </Badge>
                </div>
                {ev.part.input != null && (
                  <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] font-mono text-[10px] leading-snug text-muted-foreground">
                    in: {JSON.stringify(ev.part.input, null, 2)}
                  </pre>
                )}
                {ev.part.output != null && (
                  <pre className="mt-1 whitespace-pre-wrap [overflow-wrap:anywhere] font-mono text-[10px] leading-snug text-success">
                    out: {JSON.stringify(ev.part.output, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}

const SUGGESTIONS = [
  "What is the balance on ACC892?",
  "Transfer $250 from ACC892 to ACC347.",
  "Schedule a $400 payment to ACC456 on 2024-12-01.",
  "I'd like to apply for a $10,000 personal loan over 2 years.",
];
