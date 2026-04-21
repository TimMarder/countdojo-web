import { ImageResponse } from "next/og";

export const alt = "Count Dojo — an education in advantage play";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0b",
          backgroundImage:
            "radial-gradient(circle at 100% 0%, rgba(52,211,153,0.12) 0%, transparent 55%)",
          padding: "72px 80px",
          color: "#f5f1e8",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              fontSize: 32,
              letterSpacing: "-0.02em",
              fontWeight: 500,
            }}
          >
            Count Dojo
          </span>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: "#34d399",
              display: "flex",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontFamily: "ui-monospace, 'JetBrains Mono', Menlo, monospace",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#34d399",
            }}
          >
            § I · An education in advantage play
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 104,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              fontWeight: 500,
              maxWidth: 1040,
            }}
          >
            <span style={{ display: "flex" }}>A serious craft.</span>
            <span style={{ display: "flex", color: "#a8a29e", fontWeight: 400 }}>
              Finally taught like one.
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderTop: "1px solid #27272a",
            paddingTop: 32,
            fontFamily: "ui-monospace, 'JetBrains Mono', Menlo, monospace",
          }}
        >
          <span
            style={{
              display: "flex",
              fontSize: 16,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#a8a29e",
            }}
          >
            30+ lessons · 19 drills · 7 systems · 65 achievements
          </span>
          <span
            style={{
              display: "flex",
              fontSize: 14,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#78716c",
            }}
          >
            countdojo.com
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
