import Link from "next/link";
import { Github, ExternalLink, Youtube } from "lucide-react";
import { Logo } from "@/components/site/logo";

const LINKS = [
  {
    label: "Devpost",
    href: "https://devpost.com/software/talktuahbank",
    icon: ExternalLink,
  },
  {
    label: "GitHub",
    href: "https://github.com/aurelisajuan/TalkTuahBank",
    icon: Github,
  },
  {
    label: "Demo Video",
    href: "https://www.youtube.com/watch?v=YsH_z1azXSA",
    icon: Youtube,
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/40">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="max-w-md text-xs text-muted-foreground">
            A 24-hour hackathon project from HackUTD 2024 · Ripple Effect.
            Overall 1st Place and Goldman Sachs Track Winner. Built by Aurelisa
            Juan, Bill Zhang, and Warren Yun.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <link.icon className="h-3.5 w-3.5" />
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/architecture"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Architecture
              </Link>
            </li>
            <li>
              <Link
                href="/build"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Build Notes
              </Link>
            </li>
          </ul>
          <p className="text-[10px] text-muted-foreground/70">
            © 2024 TalkTuahBank · Project page rebuilt with Next.js 15 +
            Vercel AI SDK
          </p>
        </div>
      </div>
    </footer>
  );
}
