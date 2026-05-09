"use client";

import { FileText, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, shortCid } from "@/lib/utils";
import { analyzeDocumentStatus } from "@/lib/console-helpers";
import type { ReferencedDocument } from "@/lib/types";

interface DocumentsGridProps {
  documents: ReferencedDocument[];
}

export function DocumentsGrid({ documents }: DocumentsGridProps) {
  if (documents.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border/70 bg-card/40 text-sm text-muted-foreground">
        No documents referenced on this call.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => {
        const status = doc.status ?? analyzeDocumentStatus(doc);
        return (
          <Card key={doc.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {doc.name}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {doc.type} · {doc.id}
                  </p>
                </div>
                <Badge
                  variant={
                    status === "urgent"
                      ? "destructive"
                      : status === "medium"
                        ? "warning"
                        : "success"
                  }
                  className="text-[10px]"
                >
                  {status}
                </Badge>
              </div>
              {doc.ipfs_hash && (
                <div
                  className={cn(
                    "mt-3 flex items-center justify-between rounded-md border border-border/60 bg-muted/30 px-2.5 py-1.5",
                  )}
                >
                  <span className="font-mono text-[10px] text-muted-foreground">
                    ipfs · {shortCid(doc.ipfs_hash)}
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
              >
                <FileText className="h-4 w-4" /> View document
                <ExternalLink className="ml-auto h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
