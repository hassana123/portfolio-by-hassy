import { ImageResponse } from "next/og";
import { portfolio } from "@/lib/data";
export const dynamic = "force-dynamic";
export const alt = "Hassana Abdullahi — portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OpenGraph() {
  const { settings: s, mode } = await portfolio();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 75,
        background: s.theme.ink,
        color: s.theme.accent,
      }}
    >
      <div style={{ display: "flex", fontSize: 26 }}>{s.brand} ✦</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3 }}>
          {s.name}
        </div>
        <div style={{ fontSize: 34, color: "#F7F5FF" }}>
          {s.profiles[mode].title}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 22, color: "#E7C98F" }}>
        {s.profiles[mode].heading}
      </div>
    </div>,
    size,
  );
}
