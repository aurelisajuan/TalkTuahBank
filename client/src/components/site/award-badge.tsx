import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface AwardBadgeProps {
  variant: "overall" | "track";
  className?: string;
}

export function AwardBadge({ variant, className }: AwardBadgeProps) {
  const isOverall = variant === "overall";
  return (
    <div
      className={cn(
        "group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        isOverall && "border-primary/40",
        className,
      )}
    >
      <span
        className={cn(
          "absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100",
          isOverall
            ? "bg-gradient-to-r from-primary/20 via-primary/5 to-transparent"
            : "bg-gradient-to-r from-warning/20 via-warning/5 to-transparent",
        )}
      />
      <Trophy
        className={cn(
          "h-3.5 w-3.5",
          isOverall ? "text-primary" : "text-warning",
        )}
      />
      <div className="flex flex-col leading-tight">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          {isOverall ? "Overall" : "Track Winner"}
        </span>
        <span className="text-[11px] font-semibold">
          {isOverall ? "1st Place — HackUTD 2024" : "Goldman Sachs"}
        </span>
      </div>
    </div>
  );
}
