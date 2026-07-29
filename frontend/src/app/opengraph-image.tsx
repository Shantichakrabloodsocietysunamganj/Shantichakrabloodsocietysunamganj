import { ImageResponse } from "next/og";

export const alt = "Shantichakra Blood Society — Donate Blood, Save Lives";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#08244a",
          backgroundImage:
            "linear-gradient(135deg, #093f7d 0%, #0b4f9c 55%, #630e0e 130%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              backgroundColor: "#d62828",
              marginRight: "20px",
              boxShadow: "0 0 0 6px rgba(214,40,40,0.22)",
            }}
          />
          <div
            style={{
              fontSize: "30px",
              opacity: "0.85",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Sunamganj · Sylhet Division · Bangladesh
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "84px", fontWeight: 800, lineHeight: "1.05" }}>
            Shantichakra
          </div>
          <div style={{ fontSize: "84px", fontWeight: 800, lineHeight: "1.05", color: "#fecaca" }}>
            Blood Society
          </div>
          <div style={{ fontSize: "38px", opacity: "0.92", marginTop: "20px" }}>
            Donate Blood, Save Lives.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "26px",
            opacity: "0.7",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: "24px",
          }}
        >
          <div>Voluntary blood donation network</div>
          <div>01626224878</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
