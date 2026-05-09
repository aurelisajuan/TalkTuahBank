# TalkTuahBank — project page

A Next.js 15 App Router site that doubles as the deployable project page for
[TalkTuahBank](https://devpost.com/software/talktuahbank), the HackUTD 2024
overall and Goldman Sachs track winner.

## Routes

| Path | What it is |
| --- | --- |
| `/` | Landing — hackathon win, problem framing, team |
| `/demo` | Interactive walkthrough (Guided + optional Live AI) |
| `/console` | Operator dashboard ported from the original admin UI |
| `/architecture` | System design with mermaid topology + annotated server source |
| `/build` | Stack, 24-hour timeline, lessons learned, self-host instructions |
| `/api/chat` | AI SDK route handler used by the Live AI tab |

## Run it

```bash
pnpm install
pnpm dev
```

Stack: **Next.js 15.5 · React 19.2 · Tailwind v4 · AI SDK v6 · pnpm 10**.

Visit http://localhost:3000.

## Live AI configuration (optional)

The Live AI tab on `/demo` is hidden automatically unless one of:

- `AI_GATEWAY_API_KEY` is set, **or**
- the deployment has the Vercel AI Gateway enabled (auto-injects
  `VERCEL_OIDC_TOKEN` at build/runtime).

The default model is `openai/gpt-5.4-mini` — override with `LIVE_AI_MODEL`.

## Deploy to Vercel

This package is the entire deployment. Set the project Root Directory to
`client/`. The repo-local [`vercel.json`](./vercel.json) pins pnpm as the
package manager and the `/api/chat` route to a 30-second function duration.

No external services or environment variables are required for the default
Guided Walkthrough.

## Code map

```
src/
  app/
    layout.tsx                Geist fonts on <html>, ThemeProvider, header/footer
    page.tsx                  Landing
    demo/page.tsx             Interactive walkthrough (Guided + Live AI)
    architecture/page.tsx     System design + annotated source
    console/page.tsx          Rebuilt operator dashboard
    build/page.tsx            Stack, timeline, lessons, self-host
    api/chat/route.ts         AI SDK streamText + tool loop
    opengraph-image.tsx       OG image
  components/
    ui/                       Radix + Tailwind primitives (button, card, tabs, …)
    site/                     Header, footer, theme toggle, award badge
    demo/                     PhonePanel, TranscriptStream, AgentStateInspector,
                              GuidedDemo, LiveDemo, useGuidedRunner
    console/                  CallList, TranscriptCard, CustomerCard, DocumentsGrid
    architecture/             MermaidDiagram, AnnotatedCode
  lib/
    mock-bank.ts              Port of server/db.py (users, accounts, payments)
    mock-scenarios.ts         Scripted multi-agent conversations
    seed-calls.ts             Calls that pre-populate the operator console
    agent-prompts.ts          Verbatim copies of the four Python agent prompts
    tools.ts                  AI SDK tool definitions for Live AI
    store.ts                  Zustand store mirroring the FastAPI WS contract
    live-mode.ts              Server-only "is Live AI available?" check
    utils.ts                  cn(), currency / phone / IPFS helpers
    types.ts                  Shared types
```
