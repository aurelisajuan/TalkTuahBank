"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/demo", label: "Live Walkthrough" },
  { href: "/console", label: "Operator Console" },
  { href: "/architecture", label: "Architecture" },
  { href: "/build", label: "Build Notes" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <Badge
            variant="ghost"
            className="hidden gap-1.5 font-mono text-[10px] sm:inline-flex"
          >
            <Trophy className="h-3 w-3" /> HackUTD 2024 · 1st Overall
          </Badge>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  active && "bg-accent text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label="View on GitHub"
          >
            <a
              href="https://github.com/aurelisajuan/TalkTuahBank"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/demo">Try the demo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
