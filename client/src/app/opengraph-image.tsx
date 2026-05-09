import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TalkTuahBank — Voice Banking for the Unbanked";
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
          padding: 80,
          background:
            "radial-gradient(circle at 30% 0%, #1d2533 0%, #0a0e16 60%)",
          color: "#f7f9fc",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #64A8F0 0%, #2A6FB5 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 1px rgba(100,168,240,0.4)",
            }}
          >
            <span style={{ fontSize: 32, fontWeight: 700 }}>T</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 28, fontWeight: 700 }}>
              TalkTuahBank
            </span>
            <span style={{ fontSize: 16, color: "#9aa3b2" }}>
              HackUTD 2024 · Overall 1st Place + Goldman Sachs
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 980,
            }}
          >
            Voice banking for the{" "}
            <span style={{ color: "#64A8F0" }}>1.7 billion</span> adults
            without a bank account.
          </span>
          <span style={{ fontSize: 22, color: "#aab3c2", maxWidth: 880 }}>
            A multi-agent conversational AI that runs over a regular phone
            call. Built in 24 hours. Won.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            color: "#aab3c2",
            fontSize: 18,
          }}
        >
          <span style={{ color: "#64A8F0" }}>●</span>
          <span>Retell AI · OpenAI Swarm · FastAPI · Pinata IPFS · Next.js 15</span>
        </div>
      </div>
    ),
    size,
  );
}
