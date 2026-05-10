import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #64A8F0 0%, #2A6FB5 100%)",
          borderRadius: 36,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
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
    ),
    size,
  );
}
