"use client";

import * as React from "react";
import { Copy, CheckCheck, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AnnotatedCodeProps {
  filename: string;
  language: "python" | "typescript" | "ts" | "tsx" | "json" | "bash";
  code: string;
  highlight?: number[];
  callouts?: { line: number; note: string }[];
  caption?: string;
  className?: string;
}

export function AnnotatedCode({
  filename,
  language,
  code,
  highlight = [],
  callouts = [],
  caption,
  className,
}: AnnotatedCodeProps) {
  const [copied, setCopied] = React.useState(false);
  const lines = code.split("\n");
  const calloutMap = new Map(callouts.map((c) => [c.line, c.note]));
  const highlightSet = new Set(highlight);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <FileCode2 className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-xs">{filename}</span>
          <Badge variant="outline" className="font-mono text-[9px]">
            {language}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={copy}>
          {copied ? (
            <CheckCheck className="h-3.5 w-3.5 text-success" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] overflow-x-auto font-mono text-[12px] leading-relaxed">
        <div className="select-none border-r border-border/60 bg-muted/20 px-3 py-3 text-right text-muted-foreground/70">
          {lines.map((_, i) => (
            <div key={i} className="tabular-nums">
              {i + 1}
            </div>
          ))}
        </div>
        <div className="px-4 py-3">
          {lines.map((line, i) => {
            const lineNo = i + 1;
            const isH = highlightSet.has(lineNo);
            const callout = calloutMap.get(lineNo);
            return (
              <div
                key={i}
                className={cn(
                  "whitespace-pre",
                  isH &&
                    "-mx-4 border-l-2 border-primary bg-primary/5 px-4",
                )}
              >
                <span className="text-foreground/90">{line || " "}</span>
                {callout && (
                  <span className="ml-3 inline-block rounded bg-warning/15 px-1.5 py-0.5 text-[10px] text-warning">
                    ◀ {callout}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {caption && (
        <div className="border-t border-border/60 bg-muted/10 px-4 py-2 text-xs text-muted-foreground">
          {caption}
        </div>
      )}
    </div>
  );
}
