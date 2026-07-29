"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";

// REAL Bangladesh SVG outline (simplemaps / world-map-country-shapes) — official shape
const BD_PATH =
  "M1486.5 431.9l-4.5-10.1-1.5.1-.2 4-3.5-3.3 1.1-3.6 2.4-.4 1.6-5.3-3.4-1.1-5 .1-5.4-.9-1.2-4.4-2.7-.4-4.8-2.7-1.2 4.3 4.6 3.4-3.1 2.4-.8 2.3 3.7 1.7-.4 3.8 2.6 4.8 1.6 5.2 2.2.6 1.7.7.6-1.2 2.5 1.3 1.3-3.5-.9-2.6 5.1.2 2.8 3.7 1.5 3.1.8 3.2 2 3.3-1.1-5.1 2.1 1-.5-4.6z";
const VB = "1455 412 45 97";
// Sylhet division region (NE) — highlighted
const SYLHET_OVERLAY = "M1476,415 L1493,412 L1495,425 L1492,440 L1480,443 L1475,430 Z";

// সিলেট বিভাগের আসল উপজেলা-অবস্থান (raw coords) — রক্তপ্রবাহের গন্তব্য
const ORIGIN = { x: 1481, y: 422 }; // সুনামগঞ্জ — origin point
const SYLHET_PT = [
  { x: 1489, y: 419 }, { x: 1482, y: 438 }, { x: 1488, y: 433 }, { x: 1484, y: 416 },
  { x: 1478, y: 430 }, { x: 1485, y: 425 }, { x: 1491, y: 416 }, { x: 1492, y: 424 },
  { x: 1477, y: 435 }, { x: 1486, y: 413 }, { x: 1488, y: 414 }, { x: 1480, y: 426 },
  { x: 1486, y: 438 }, { x: 1491, y: 437 }, { x: 1487, y: 436 }, { x: 1476, y: 434 },
  { x: 1479, y: 441 }, { x: 1483, y: 442 }, { x: 1488, y: 441 },
];
// অন্যান্য বিভাগ — "coming soon" রুট
const DIVISIONS = [
  { x: 1474, y: 461 }, { x: 1491, y: 491 }, { x: 1463, y: 440 }, { x: 1465, y: 480 },
  { x: 1475, y: 485 }, { x: 1463, y: 425 }, { x: 1474, y: 435 },
];

// curved path between two points (arc upward)
const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const cx = (a.x + b.x) / 2;
  const cy = Math.min(a.y, b.y) - 2.6;
  return `M${a.x},${a.y} Q${cx.toFixed(1)},${cy.toFixed(1)} ${b.x},${b.y}`;
};
// partial point (for coming-soon routes — drop travels only partway)
const partial = (a: { x: number; y: number }, b: { x: number; y: number }, f: number) => ({
  x: a.x + (b.x - a.x) * f,
  y: a.y + (b.y - a.y) * f,
});

export default function BangladeshMap({ lang: _lang }: { lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 10, y: -7 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      setTilt({ x: 10 + dy * 8, y: -7 - dx * 10 });
    };
    const onLeave = () => setTilt({ x: 10, y: -7 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="relative mx-auto flex w-full max-w-md items-center justify-center [perspective:1000px]">
      {/* soft ambient glow */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-blood-500/10 blur-3xl" />

      {/* floating particles */}
      {[
        { l: "12%", t: "18%", d: 7 }, { l: "82%", t: "24%", d: 9 }, { l: "70%", t: "70%", d: 8 },
        { l: "22%", t: "78%", d: 10 }, { l: "50%", t: "12%", d: 11 }, { l: "90%", t: "55%", d: 7.5 },
      ].map((p, i) => (
        <span key={i} className="pointer-events-none absolute h-1 w-1 rounded-full bg-white/40" style={{ left: p.l, top: p.t, animation: `mapParticle ${p.d}s ease-in-out ${i * 0.5}s infinite` }} />
      ))}

      <div
        className="relative w-full will-change-transform"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="animate-float">
          <svg viewBox={VB} className="block h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]" role="img" aria-label="Bangladesh map — Sylhet Division highlighted">
            <defs>
              <linearGradient id="bdFace" x1="0" y1="0" x2="0.4" y2="1">
                <stop offset="0%" stopColor="#2a5586" />
                <stop offset="55%" stopColor="#163a63" />
                <stop offset="100%" stopColor="#0a2138" />
              </linearGradient>
              <linearGradient id="bdGlass" x1="0" y1="0" x2="0.7" y2="0.4">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
                <stop offset="55%" stopColor="#ffffff" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="sylhetFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
              <radialGradient id="sylhetGlow">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="originGlow">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <filter id="edgeGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="0.45" floodColor="#38bdf8" floodOpacity="0.55" />
              </filter>
              <linearGradient id="dropGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff6b6b" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>

            {/* extrude illusion (thickness) */}
            {[0.5, 0.35, 0.2].map((o, i) => (
              <path key={i} d={BD_PATH} transform={`translate(0,${0.5 + i * 0.45})`} fill="#06182b" opacity={0.9 - i * 0.18} />
            ))}

            {/* Sylhet region glow (behind face) */}
            <circle cx="1484" cy="428" r="16" fill="url(#sylhetGlow)" />

            {/* Bangladesh face */}
            <path d={BD_PATH} fill="url(#bdFace)" stroke="rgba(125,190,255,0.5)" strokeWidth="0.32" strokeLinejoin="round" />
            <path d={BD_PATH} fill="url(#bdGlass)" />

            {/* coming-soon routes (gray dashed, inactive) */}
            {DIVISIONS.map((d, i) => {
              const mid = partial(ORIGIN, d, 0.42);
              return (
                <g key={`div${i}`}>
                  <path d={curve(ORIGIN, d)} fill="none" stroke="#64748b" strokeWidth="0.18" strokeOpacity="0.5" strokeDasharray="0.7 1.1">
                    <animate attributeName="stroke-dashoffset" values="0;-9" dur="3.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                  </path>
                  <circle r="0.4" fill="#94a3b8" opacity="0.5">
                    <animateMotion dur="3.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" path={curve(ORIGIN, mid)} />
                    <animate attributeName="opacity" values="0;0.55;0" dur="3.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            {/* Sylhet region (highlighted) */}
            <path d={SYLHET_OVERLAY} fill="url(#sylhetFill)" fillOpacity="0.78" stroke="#fecaca" strokeWidth="0.2" strokeLinejoin="round">
              <animate attributeName="fill-opacity" values="0.6;0.92;0.6" dur="3.2s" repeatCount="indefinite" />
            </path>

            {/* Sylhet destination dots */}
            {SYLHET_PT.map((p, i) => (
              <circle key={`d${i}`} cx={p.x} cy={p.y} r="0.55" fill="#fecaca" opacity="0.85" />
            ))}

            {/* blood network paths (invisible) + glowing drops from Sunamganj */}
            {SYLHET_PT.map((p, i) => {
              const d = `syl${i}`;
              const dur = 2.4 + (i % 5) * 0.35;
              return (
                <g key={d}>
                  <path id={d} d={curve(ORIGIN, p)} fill="none" stroke="none" />
                  <circle r="1.05" fill="url(#dropGrad)" filter="url(#edgeGlow)">
                    <animateMotion dur={`${dur}s`} begin={`${i * 0.18}s`} repeatCount="indefinite">
                      <mpath href={`#${d}`} />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur={`${dur}s`} begin={`${i * 0.18}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            {/* origin: Sunamganj — pulsing hub */}
            <circle cx={ORIGIN.x} cy={ORIGIN.y} r="6" fill="url(#originGlow)" />
            <circle cx={ORIGIN.x} cy={ORIGIN.y} r="1.5" fill="none" stroke="#ffffff" strokeWidth="0.3">
              <animate attributeName="r" values="1.5;4;1.5" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0;0.9" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={ORIGIN.x} cy={ORIGIN.y} r="1.1" fill="#ffffff" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes mapParticle {
          0%,100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-14px) scale(1.4); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
