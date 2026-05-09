// Single source of truth for "is the Live AI tab available right now?".
// We check both the Vercel AI Gateway API key and the auto-injected OIDC
// token that Vercel exposes when the project has the AI Gateway enabled.
//
// Server-only: do not import from client components.

export function isLiveAiAvailable(): boolean {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN,
  );
}

export const LIVE_MODEL =
  process.env.LIVE_AI_MODEL || "openai/gpt-5.4-mini";
