import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operator Console",
  description:
    "The same dashboard that ran behind the live HackUTD demo — calls, customer profiles, payment ledgers, and pinned application documents. Wired to a session-local mock that mirrors the original FastAPI WebSocket protocol.",
  alternates: { canonical: "/console" },
};

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
