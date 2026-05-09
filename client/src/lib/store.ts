"use client";

import { create } from "zustand";
import type {
  AgentName,
  BankDatabase,
  Call,
  ChatMessage,
  ReferencedDocument,
  ToolCallRecord,
} from "@/lib/types";
import { cloneDatabase, nextPaymentId } from "@/lib/mock-bank";
import { SEED_CALLS } from "@/lib/seed-calls";
import { fakeIpfsCid } from "@/lib/utils";

// The store is shaped to mirror the original WebSocket protocol from
// server/main.py so re-enabling the FastAPI backend is a one-line swap.
// Wire events: { event: "combined_response" | "db_response" | "calls_response" }

export type BackendEvent =
  | { event: "combined_response"; calls: Record<string, Call>; db: BankDatabase }
  | { event: "db_response"; data: BankDatabase }
  | { event: "calls_response"; data: Record<string, Call> };

interface DemoState {
  // Mirrors the FastAPI backend
  calls: Record<string, Call>;
  db: BankDatabase;
  selectedId: string;

  // Live demo state
  activeAgent: AgentName | null;
  activeCallId: string | null;
  toolCalls: ToolCallRecord[];

  // Actions
  select: (id: string) => void;
  dispatchEvent: (event: BackendEvent) => void;
  startCall: (callId: string, userPhone: string) => void;
  appendTranscript: (callId: string, message: ChatMessage) => void;
  setActiveAgent: (agent: AgentName | null) => void;
  recordToolCall: (rec: Omit<ToolCallRecord, "id" | "timestamp">) => string;
  attachDocument: (callId: string, doc: ReferencedDocument) => void;
  applyTransfer: (from: string, to: string, amount: number) => string;
  applySchedule: (from: string, to: string, amount: number, date: string) => string;
  applyCancel: (paymentId: string) => string;
  resetDemo: () => void;
}

export const useDemoStore = create<DemoState>((set, get) => ({
  calls: { ...SEED_CALLS },
  db: cloneDatabase(),
  selectedId: Object.keys(SEED_CALLS)[0] ?? "",
  activeAgent: null,
  activeCallId: null,
  toolCalls: [],

  select: (id) => set({ selectedId: id }),

  dispatchEvent: (event) => {
    if (event.event === "combined_response") {
      set({ calls: event.calls, db: event.db });
    } else if (event.event === "db_response") {
      set({ db: event.data });
    } else if (event.event === "calls_response") {
      set({ calls: event.data });
    }
  },

  startCall: (callId, userPhone) =>
    set((state) => ({
      activeCallId: callId,
      activeAgent: "Triage Agent",
      toolCalls: [],
      calls: {
        ...state.calls,
        [callId]: {
          id: callId,
          user_id: userPhone,
          time: new Date().toISOString(),
          transcript: [],
          referenced_documents: [],
          agent_trail: ["Triage Agent"],
        },
      },
      selectedId: callId,
    })),

  appendTranscript: (callId, message) =>
    set((state) => {
      const call = state.calls[callId];
      if (!call) return state;
      return {
        calls: {
          ...state.calls,
          [callId]: { ...call, transcript: [...call.transcript, message] },
        },
      };
    }),

  setActiveAgent: (agent) =>
    set((state) => {
      const callId = state.activeCallId;
      if (!callId || !agent) return { activeAgent: agent };
      const call = state.calls[callId];
      if (!call) return { activeAgent: agent };
      const trail = call.agent_trail ?? [];
      const lastAgent = trail[trail.length - 1];
      const nextTrail = lastAgent === agent ? trail : [...trail, agent];
      return {
        activeAgent: agent,
        calls: {
          ...state.calls,
          [callId]: { ...call, agent_trail: nextTrail },
        },
      };
    }),

  recordToolCall: (rec) => {
    const id = `tc-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
    const full: ToolCallRecord = { ...rec, id, timestamp: Date.now() };
    set((state) => ({ toolCalls: [...state.toolCalls, full] }));
    return id;
  },

  attachDocument: (callId, doc) =>
    set((state) => {
      const call = state.calls[callId];
      if (!call) return state;
      return {
        calls: {
          ...state.calls,
          [callId]: {
            ...call,
            referenced_documents: [...call.referenced_documents, doc],
          },
        },
      };
    }),

  applyTransfer: (from, to, amount) => {
    const id = nextPaymentId();
    set((state) => {
      const db = JSON.parse(JSON.stringify(state.db)) as BankDatabase;
      if (db.accounts[from]) db.accounts[from].balance -= amount;
      if (db.accounts[to]) db.accounts[to].balance += amount;
      db.payments[id] = {
        from_account: from,
        to_account: to,
        amount,
        date: new Date().toISOString().slice(0, 10),
        status: "Completed",
      };
      return { db };
    });
    return id;
  },

  applySchedule: (from, to, amount, date) => {
    const id = nextPaymentId();
    set((state) => {
      const db = JSON.parse(JSON.stringify(state.db)) as BankDatabase;
      if (db.accounts[from]) db.accounts[from].balance -= amount;
      db.payments[id] = {
        from_account: from,
        to_account: to,
        amount,
        date,
        status: "Scheduled",
      };
      return { db };
    });
    return id;
  },

  applyCancel: (paymentId) => {
    let refundedTo = "";
    set((state) => {
      const db = JSON.parse(JSON.stringify(state.db)) as BankDatabase;
      const pay = db.payments[paymentId];
      if (!pay) return { db };
      pay.status = "Canceled";
      if (db.accounts[pay.from_account]) {
        db.accounts[pay.from_account].balance += pay.amount;
      }
      refundedTo = pay.from_account;
      return { db };
    });
    return refundedTo;
  },

  resetDemo: () =>
    set({
      calls: { ...SEED_CALLS },
      db: cloneDatabase(),
      activeAgent: null,
      activeCallId: null,
      toolCalls: [],
      selectedId: Object.keys(SEED_CALLS)[0] ?? "",
    }),
}));

export function makeFakeDocument(name: string): ReferencedDocument {
  return {
    id: `DOC-${Math.floor(Math.random() * 100000)}`,
    name,
    type: "PDF",
    status: name.toLowerCase().includes("dispute") ? "urgent" : "medium",
    ipfs_hash: fakeIpfsCid(),
  };
}
