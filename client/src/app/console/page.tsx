"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Info, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CallList } from "@/components/console/call-list";
import { TranscriptCard } from "@/components/console/transcript-card";
import { CustomerCard } from "@/components/console/customer-card";
import { DocumentsGrid } from "@/components/console/documents-grid";
import { useDemoStore } from "@/lib/store";

// /console is a verbatim feature port of the original
// client/src/app/page.tsx admin dashboard. The hard-coded
// `new WebSocket("ws://localhost:8000/ws?client_id=1234")` connection has
// been replaced with a Zustand subscription that mirrors the same event
// contract emitted by server/main.py:
//   - { event: "combined_response", calls, db }
//   - { event: "db_response", data: db }
//   - { event: "calls_response", data: calls }
// Re-enabling the FastAPI backend is a one-line swap: open the WebSocket and
// pipe each parsed message into useDemoStore.getState().dispatchEvent(event).

export default function ConsolePage() {
  const calls = useDemoStore((s) => s.calls);
  const db = useDemoStore((s) => s.db);
  const selectedId = useDemoStore((s) => s.selectedId);
  const select = useDemoStore((s) => s.select);
  const selected = calls[selectedId];

  return (
    <div className="container space-y-5 py-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            · Operator Console
          </span>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Watch what the support team sees, in real time.
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            The same dashboard that ran behind the live demo at HackUTD —
            calls, customer profiles, payment ledgers, and pinned application
            documents. Wired to a session-local mock that mirrors the
            FastAPI WebSocket protocol from{" "}
            <code className="rounded bg-muted px-1 font-mono text-xs">
              server/main.py
            </code>
            .
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/demo">
            Run a new call <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </header>

      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 text-primary" />
        <div className="flex-1 text-xs text-muted-foreground">
          This console is reading from a session-local mock of the FastAPI
          server. The full Python source — including the WebSocket handler,
          the OpenAI Swarm wiring, and the Pinata uploader — lives in{" "}
          <code className="rounded bg-background/60 px-1 font-mono">
            server/
          </code>{" "}
          if you want to self-host.
        </div>
        <Badge variant="ghost" className="gap-1.5 font-mono text-[10px]">
          <Server className="h-3 w-3" /> mock backend
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="lg:h-[calc(100vh-220px)]">
          <CallList
            calls={calls}
            selectedId={selectedId}
            onSelect={select}
            callerName={(uid) => db.users[uid]?.name}
          />
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <TranscriptCard call={selected} />
            <CustomerCard call={selected} db={db} />
          </div>
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Referenced documents</h2>
              {selected?.referenced_documents.length ? (
                <Badge variant="outline" className="text-[10px]">
                  {selected.referenced_documents.length} pinned
                </Badge>
              ) : null}
            </div>
            <DocumentsGrid
              documents={selected?.referenced_documents ?? []}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
