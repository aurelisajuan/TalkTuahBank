import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TalkTuahBank — Voice banking for the unbanked";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(circle at 25% -10%, rgba(100,168,240,0.22), transparent 55%), linear-gradient(180deg, #0a0e16 0%, #0a0e16 100%)",
          color: "#f7f9fc",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Header: brand + award */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "linear-gradient(135deg, #64A8F0 0%, #2A6FB5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 0 1px rgba(100,168,240,0.4)",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 32 32">
                <path
                  d="M9 7h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.6L8 25.5V9a2 2 0 0 1 1-2Z"
                  fill="#ffffff"
                  opacity="0.97"
                />
                <path
                  d="M12 13h8M12 16.5h5"
                  stroke="#2A6FB5"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.5 }}>
                TalkTuahBank
              </div>
              <div style={{ fontSize: 18, color: "#9aa3b2", marginTop: 4 }}>
                Voice banking for the unbanked
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 20px",
              borderRadius: 999,
              border: "1px solid rgba(100,168,240,0.4)",
              background: "rgba(100,168,240,0.1)",
              color: "#cfe2ff",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: 20 }}>🏆</span>
            HackUTD 2024 · 1st Overall
          </div>
        </div>

        {/* Hook headline — split into separate text blocks so Satori does not
            collapse them into a single overflowing line. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            maxWidth: 1056,
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2,
              color: "#f7f9fc",
            }}
          >
            1.7 billion adults
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: -1,
              color: "#9aa3b2",
            }}
          >
            still don&apos;t have a bank account.
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: -1,
              color: "#64A8F0",
              marginTop: 4,
            }}
          >
            We built one they can call.
          </div>
        </div>

        {/* Footer: tech stack */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#aab3c2",
            fontSize: 18,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#64A8F0",
              boxShadow: "0 0 12px #64A8F0",
            }}
          />
          <span>
            Retell AI · OpenAI Swarm · FastAPI · Pinata IPFS · Next.js 15 ·
            Vercel AI SDK
          </span>
        </div>
      </div>
    ),
    size,
  );
}
