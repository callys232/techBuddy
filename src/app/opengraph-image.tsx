import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/* Site-wide share image — rendered to PNG because Facebook, X, LinkedIn and
   WhatsApp don't display SVG previews. Child routes inherit it.
*/

export const alt = "TechBuddy — software studio in Lagos, Nigeria";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(path.join(process.cwd(), "public/logo-mark.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#FAF8F5",
          borderBottom: "12px solid #1E3A8A",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={333} height={120} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 800, color: "#1C1917", lineHeight: 1.08, letterSpacing: -2 }}>
            Make your business easier to run
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, color: "#1E3A8A", lineHeight: 1.08, letterSpacing: -2 }}>
            and easier to grow.
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#6B6560", letterSpacing: 1 }}>
          WEB · MOBILE · AI · FINTECH — LAGOS, NIGERIA
        </div>
      </div>
    ),
    size,
  );
}
