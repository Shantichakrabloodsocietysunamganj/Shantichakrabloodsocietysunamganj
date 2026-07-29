"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import bdData from "@/data/geo/bangladesh.json";

// Real outline bounds (lng/lat)
const LNG0 = 88.02, LNG1 = 92.64, LAT0 = 20.74, LAT1 = 26.62;
const VB_W = 360, PAD = 16;
const VB_H = Math.round(VB_W * ((LAT1 - LAT0) / (LNG1 - LNG0)));
const sx = (lng: number) => PAD + ((lng - LNG0) / (LNG1 - LNG0)) * (VB_W - 2 * PAD);
const sy = (lat: number) => VB_H - (PAD + ((lat - LAT0) / (LAT1 - LAT0)) * (VB_H - 2 * PAD));

// real coords
const ORIGIN: [number, number] = [91.3951, 25.0657]; // Sunamganj
const SYLHET: [number, number][] = [
  [91.8687, 24.8949], [91.4147, 24.3758], [91.7833, 24.4833], [91.67, 25.04],
  [91.32, 24.78], [91.16, 25.12], [91.18, 24.85], [90.97, 25.06],
  [91.36, 24.77], [91.82, 24.78], [91.7, 24.82], [91.88, 25.01],
  [91.51, 24.56], [91.63, 24.41], [91.73, 24.31], [91.83, 24.3],
  [91.97, 24.52], [91.58, 24.38],
];
const DIVISIONS: [number, number][] = [
  [90.4125, 23.8103], [91.7832, 22.3569], [89.5403, 22.8456], [88.6241, 24.3636],
  [90.3535, 22.701], [89.2752, 25.7439], [90.4203, 24.7471],
];
const SYLHET_CENTER: [number, number] = [91.62, 24.72];

function ringToPath(ring: number[][]): string {
  return ring
    .map((p, i) => `${i === 0 ? "M" : "L"}${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`)
    .join(" ") + " Z";
}
const curve = (a: [number, number], b: [number, number]) => {
  const cx = (sx(a[0]) + sx(b[0])) / 2;
  const cy = (sy(a[1]) + sy(b[1])) / 2 - 14;
  return `M${sx(a[0])},${sy(a[1])} Q${cx.toFixed(1)},${cy.toFixed(1)} ${sx(b[0])},${sy(b[1])}`;
};
const partialEnd = (a: [number, number], b: [number, number], f: number) => [
  a[0] + (b[0] - a[0]) * f,
  a[1] + (b[1] - a[1]) * f,
] as [number, number];

export default function BangladeshMapSVG({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 12, y: -8 });

  const { main, islands } = useMemo(() => {
    const geom = bdData.features[0].geometry as any;
    const polys: number[][][][] = geom.type === "MultiPolygon" ? geom.coordinates : [geom.coordinates];
    const big: string[] = [];
    const small: string[] = [];
    for (const poly of polys) {
      const d = ringToPath(poly[0]) + poly.slice(1).map((h) => ringToPath(h)).join(" ");
      (poly[0].length >= 12 ? big : small).push(d);
    }
    return { main: big, islands: small };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      setTilt({ x: 12 + dy * 8, y: -8 - dx * 10 });
    };
    const onLeave = () => setTilt({ x: 12, y: -8 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={`relative flex w-full items-center justify-center [perspective:900px] ${className}`}>
      <div className="pointer-events-none absolute inset-0 rounded-full bg-blood-500/10 blur-3xl" />
      {[
        { l: "14%", t: "20%", d: 7 }, { l: "80%", t: "28%", d: 9 }, { l: "70%", t: "72%", d: 8 },
        { l: "24%", t: "76%", d: 10 }, { l: "52%", t: "14%", d: 11 },
      ].map((p, i) => (
        <span key={i} className="pointer-events-none absolute h-1 w-1 rounded-full bg-white/40" style={{ left: p.l, top: p.t, animation: `svgP ${p.d}s ease-in-out ${i * 0.5}s infinite` }} />
      ))}

      <div className="animate-float w-full max-w-[15rem] sm:max-w-[17rem]" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)" }}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="block h-auto w-full drop-shadow-[0_24px_34px_rgba(0,0,0,0.5)]" role="img" aria-label="Bangladesh — Sylhet Division highlighted">
          <defs>
            <linearGradient id="sf-face" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#2a5586" />
              <stop offset="55%" stopColor="#163a63" />
              <stop offset="100%" stopColor="#0a2138" />
            </linearGradient>
            <linearGradient id="sf-glass" x1="0" y1="0" x2="0.7" y2="0.4">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="sf-sylhet">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <filter id="sf-edge" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.2" floodColor="#38bdf8" floodOpacity="0.5" />
            </filter>
            <linearGradient id="sf-drop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6b6b" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>

          {/* Sylhet glow */}
          <circle cx={sx(SYLHET_CENTER[0])} cy={sy(SYLHET_CENTER[1])} r="64" fill="url(#sf-sylhet)" />

          {/* extrude illusion */}
          {main.map((d, i) => (
            <path key={`x${i}`} d={d} transform="translate(0,5)" fill="#06182b" opacity="0.85" />
          ))}

          {/* Bangladesh real shape */}
          {main.map((d, i) => (
            <path key={`m${i}`} d={d} fill="url(#sf-face)" stroke="rgba(125,190,255,0.45)" strokeWidth="1.1" strokeLinejoin="round" />
          ))}
          {main.map((d, i) => (
            <path key={`g${i}`} d={d} fill="url(#sf-glass)" />
          ))}
          {islands.map((d, i) => (
            <path key={`is${i}`} d={d} fill="url(#sf-face)" stroke="rgba(125,190,255,0.35)" strokeWidth="0.8" />
          ))}

          {/* coming-soon routes (gray dashed) */}
          {DIVISIONS.map((d, i) => (
            <path key={`r${i}`} d={curve(ORIGIN, d)} fill="none" stroke="#64748b" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 5">
              <animate attributeName="stroke-dashoffset" values="0;-32" dur="3.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </path>
          ))}
          {DIVISIONS.map((d, i) => (
            <circle key={`rp${i}`} r="2.4" fill="#94a3b8" opacity="0.5">
              <animateMotion dur="3.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" path={curve(ORIGIN, partialEnd(ORIGIN, d, 0.42))} />
              <animate attributeName="opacity" values="0;0.55;0" dur="3.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Sylhet destination dots */}
          {SYLHET.map((p, i) => (
            <circle key={`n${i}`} cx={sx(p[0])} cy={sy(p[1])} r="3" fill="#fecaca" opacity="0.9" />
          ))}

          {/* blood network paths + drops from Sunamganj */}
          {SYLHET.map((p, i) => {
            const id = `sfbp${i}`;
            const dur = 2.4 + (i % 5) * 0.35;
            return (
              <g key={id}>
                <path id={id} d={curve(ORIGIN, p)} fill="none" stroke="none" />
                <circle r="4.5" fill="url(#sf-drop)" filter="url(#sf-edge)">
                  <animateMotion dur={`${dur}s`} begin={`${i * 0.18}s`} repeatCount="indefinite">
                    <mpath href={`#${id}`} />
                  </animateMotion>
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur={`${dur}s`} begin={`${i * 0.18}s`} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}

          {/* origin hub: Sunamganj */}
          <circle cx={sx(ORIGIN[0])} cy={sy(ORIGIN[1])} r="14" fill="url(#sf-sylhet)" />
          <circle cx={sx(ORIGIN[0])} cy={sy(ORIGIN[1])} r="6" fill="none" stroke="#ffffff" strokeWidth="1.4">
            <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0;0.9" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={sx(ORIGIN[0])} cy={sy(ORIGIN[1])} r="4" fill="#ffffff" />
        </svg>
      </div>

      <style>{`@keyframes svgP { 0%,100%{transform:translateY(0) scale(1);opacity:.2} 50%{transform:translateY(-12px) scale(1.4);opacity:.55} }`}</style>
    </div>
  );
}
