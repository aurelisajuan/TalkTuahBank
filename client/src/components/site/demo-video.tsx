"use client";

import * as React from "react";
import { Play, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

type DemoVideoProps = {
  videoId: string;
  title: string;
  className?: string;
  /**
   * Optional custom poster image (e.g. a high-resolution frame extracted from
   * the source video for uploads where YouTube did not generate
   * `maxresdefault.jpg`).
   */
  poster?: string;
  /**
   * Optional WebP variant of the custom poster, used in a `<picture>` source.
   */
  posterWebp?: string;
};

export function DemoVideo({
  videoId,
  title,
  className,
  poster,
  posterWebp,
}: DemoVideoProps) {
  const [active, setActive] = React.useState(false);

  return (
    <div
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-lg ring-1 ring-border/50",
        className,
      )}
    >
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          loading="lazy"
          allow="accelerated-2d-canvas; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Play video: ${title}`}
          className="absolute inset-0 flex items-center justify-center"
        >
          <picture>
            {posterWebp && <source srcSet={posterWebp} type="image/webp" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster ?? `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.dataset.fallback) {
                  img.dataset.fallback = "1";
                  img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                }
              }}
            />
          </picture>
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
          <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/5" />

          <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 transition-transform duration-200 group-hover:scale-110 md:h-20 md:w-20">
            <Play className="h-7 w-7 translate-x-0.5 fill-current md:h-9 md:w-9" />
          </span>

          <span className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-2 text-left">
            <span className="flex items-center gap-2 text-xs font-medium text-foreground md:text-sm">
              <Youtube className="h-4 w-4 text-[#ff0000]" />
              <span>{title}</span>
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:inline">
              2 min · HackUTD 2024
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
