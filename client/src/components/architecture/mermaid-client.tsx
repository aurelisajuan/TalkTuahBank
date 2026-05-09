"use client";

import dynamic from "next/dynamic";

export const MermaidDiagram = dynamic(
  () =>
    import("@/components/architecture/mermaid-diagram").then(
      (m) => m.MermaidDiagram,
    ),
  { ssr: false },
);
