"use client";

import * as React from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

let initialized = false;

export function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
  const { resolvedTheme } = useTheme();
  const ref = React.useRef<HTMLDivElement>(null);
  const idRef = React.useRef(`mermaid-${Math.random().toString(36).slice(2)}`);

  React.useEffect(() => {
    const isDark = resolvedTheme === "dark";
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: isDark ? "dark" : "default",
      themeVariables: {
        background: "transparent",
        primaryColor: isDark ? "#1a1f2e" : "#eef4ff",
        primaryTextColor: isDark ? "#e6edf7" : "#0a1018",
        primaryBorderColor: "#64A8F0",
        lineColor: isDark ? "#3a4255" : "#9aa3b2",
        secondaryColor: isDark ? "#1d2533" : "#f7f9fc",
        tertiaryColor: isDark ? "#0e1320" : "#fafbfd",
        fontFamily: "var(--font-geist-mono)",
      },
      flowchart: {
        curve: "basis",
        padding: 20,
      },
    });
    initialized = true;
    let cancelled = false;
    (async () => {
      try {
        const { svg } = await mermaid.render(idRef.current, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (e) {
        if (ref.current) {
          ref.current.innerHTML = `<pre class="text-destructive text-xs">${(e as Error).message}</pre>`;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, resolvedTheme]);

  return (
    <div
      ref={ref}
      className={className}
      key={resolvedTheme}
      suppressHydrationWarning
    />
  );
}

export const MERMAID_INITIALIZED = initialized;
