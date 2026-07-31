"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import bdData from "@/data/geo/bangladesh.json";

// REAL outline (world-atlas natural-earth). Bounds + latitude-corrected projection.
const LNG0 = 88.02, LNG1 = 92.64, LAT0 = 20.74, LAT1 = 26.62, CLAT = 23.7;
const COS = Math.cos((CLAT * Math.PI) / 180);
const LNG_SPAN = (LNG1 - LNG0) * COS; // east-west corrected
const LAT_SPAN = LAT1 - LAT0;
const VB_W = 360, PAD = 16;
const VB_H = Math.round(VB_W * (LAT_SPAN / LNG_SPAN));
const sx = (lng: number) => PAD + (((lng - LNG0) * COS) / LNG_SPAN) * (VB_W - 2 * PAD);
const sy = (lat: number) => VB_H - (PAD + ((lat - LAT0) / LAT_SPAN) * (VB_H - 2 * PAD));

const ORIGIN: [number, number] = [91.3951, 25.0657]; // Sunamganj

const SYLHET_DISTRICTS: [number, number][] = [
  [91.8687, 24.8949], // Sylhet
  [91.4147, 24.3758], // Habiganj
  [91.7833, 24.4833], // Moulvibazar
  [91.3951, 25.0657], // Sunamganj
  [91.32, 24.78], [91.16, 25.12], [91.18, 24.85], [90.97, 25.06],
  [91.36, 24.77], [91.82, 24.78], [91.7, 24.82], [91.88, 25.01],
  [91.51, 24.56], [91.63, 24.41], [91.73, 24.31], [91.83, 24.3],
  [91.97, 24.52], [91.58, 24.38],
];

export interface DivisionInfo {
  id: string;
  nameBn: string;
  nameEn: string;
  coords: [number, number];
  isActive?: boolean;
  statusBn: string;
  statusEn: string;
  dx: number; // label x offset in SVG space
  dy: number; // label y offset in SVG space
}

export const ALL_DIVISIONS: DivisionInfo[] = [
  {
    id: "sylhet",
    nameBn: "সিলেট",
    nameEn: "Sylhet",
    coords: [91.8687, 24.8949],
    isActive: true,
    statusBn: "১০০% সম্পূর্ণ সক্রিয় (রক্ত সেবা চালু)",
    statusEn: "100% Fully Active Division",
    dx: 12,
    dy: -8,
  },
  {
    id: "dhaka",
    nameBn: "ঢাকা",
    nameEn: "Dhaka",
    coords: [90.4125, 23.8103],
    statusBn: "রাজধানী বিভাগ (পরবর্তী লক্ষ্য)",
    statusEn: "Capital Division (Expansion Target)",
    dx: 10,
    dy: 0,
  },
  {
    id: "chattogram",
    nameBn: "চট্টগ্রাম",
    nameEn: "Chattogram",
    coords: [91.7832, 22.3569],
    statusBn: "চট্টগ্রাম বিভাগ (আসন্ন কভারেজ)",
    statusEn: "Chattogram Division (Coming Soon)",
    dx: 10,
    dy: 4,
  },
  {
    id: "rajshahi",
    nameBn: "রাজশাহী",
    nameEn: "Rajshahi",
    coords: [88.6241, 24.3636],
    statusBn: "রাজশাহী বিভাগ (আসন্ন কভারেজ)",
    statusEn: "Rajshahi Division (Coming Soon)",
    dx: -45,
    dy: 0,
  },
  {
    id: "khulna",
    nameBn: "খুলনা",
    nameEn: "Khulna",
    coords: [89.5403, 22.8456],
    statusBn: "খুলনা বিভাগ (আসন্ন কভারেজ)",
    statusEn: "Khulna Division (Coming Soon)",
    dx: -42,
    dy: 2,
  },
  {
    id: "barishal",
    nameBn: "বরিশাল",
    nameEn: "Barishal",
    coords: [90.3535, 22.7010],
    statusBn: "বরিশাল বিভাগ (আসন্ন কভারেজ)",
    statusEn: "Barishal Division (Coming Soon)",
    dx: -15,
    dy: 14,
  },
  {
    id: "rangpur",
    nameBn: "রংপুর",
    nameEn: "Rangpur",
    coords: [89.2752, 25.7439],
    statusBn: "রংপুর বিভাগ (আসন্ন কভারেজ)",
    statusEn: "Rangpur Division (Coming Soon)",
    dx: -15,
    dy: -12,
  },
  {
    id: "mymensingh",
    nameBn: "ময়মনসিংহ",
    nameEn: "Mymensingh",
    coords: [90.4203, 24.7471],
    statusBn: "ময়মনসিংহ বিভাগ (আসন্ন কভারেজ)",
    statusEn: "Mymensingh Division (Coming Soon)",
    dx: -25,
    dy: -12,
  },
];

const SYLHET_CENTER: [number, number] = [91.62, 24.72];

const ringToPath = (ring: number[][]) =>
  ring.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(" ") + " Z";

const curve = (a: [number, number], b: [number, number]) => {
  const cx = (sx(a[0]) + sx(b[0])) / 2;
  const cy = (sy(a[1]) + sy(b[1])) / 2 - 16;
  return `M${sx(a[0])},${sy(a[1])} Q${cx.toFixed(1)},${cy.toFixed(1)} ${sx(b[0])},${sy(b[1])}`;
};

const partialEnd = (a: [number, number], b: [number, number], f: number) =>
  [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f] as [number, number];

export default function BangladeshMapSVG() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 12, y: -6 });
  const [hoveredDiv, setHoveredDiv] = useState<DivisionInfo | null>(null);
  const [is3D, setIs3D] = useState(true);

  const mainPath = useMemo(() => {
    const geom = bdData.features[0].geometry as any;
    const polys: number[][][][] = geom.type === "MultiPolygon" ? geom.coordinates : [geom.coordinates];
    const largest = polys.reduce((a, b) => (b[0].length > a[0].length ? b : a)); // mainland only
    return ringToPath(largest[0]) + largest.slice(1).map((h) => ringToPath(h)).join(" ");
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !is3D) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      setTilt({ x: 12 + dy * 8, y: -6 - dx * 10 });
    };
    const onLeave = () => setTilt({ x: 12, y: -6 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [is3D]);

  const nonSylhetDivisions = useMemo(() => ALL_DIVISIONS.filter((d) => !d.isActive), []);

  return (
    <div ref={ref} className="group relative flex flex-col items-center justify-center [perspective:1000px]">
      {/* 3D Map Header Controls */}
      <div className="mb-2 flex items-center justify-between w-full px-2 text-xs">
        <span className="font-semibold text-brand-200/90 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          বাংলাদেশের ৮টি বিভাগ (Division Map)
        </span>
        <button
          type="button"
          onClick={() => setIs3D(!is3D)}
          className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-white/20 backdrop-blur-sm"
        >
          {is3D ? "📐 3D Perspective" : "🗺️ 2D View"}
        </button>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-full bg-blood-500/10 blur-3xl" />
      {[
        { l: "14%", t: "20%", d: 7 },
        { l: "80%", t: "28%", d: 9 },
        { l: "70%", t: "72%", d: 8 },
        { l: "24%", t: "76%", d: 10 },
        { l: "52%", t: "14%", d: 11 },
      ].map((p, i) => (
        <span
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-white/40"
          style={{ left: p.l, top: p.t, animation: `svgP ${p.d}s ease-in-out ${i * 0.5}s infinite` }}
        />
      ))}

      <div
        className="animate-float w-full max-w-[16rem] transition-transform duration-500 group-hover:scale-[1.03] sm:max-w-[18.5rem]"
        style={{
          transform: is3D ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : "none",
          transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="block h-auto w-full drop-shadow-[0_26px_36px_rgba(0,0,0,0.55)]"
          role="img"
          aria-label="বাংলাদেশের ৩ডি ম্যাপ ও বিভাগসমূহ"
        >
          <defs>
            <linearGradient id="sf-face" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#2a5586" />
              <stop offset="55%" stopColor="#163a63" />
              <stop offset="100%" stopColor="#0a2138" />
            </linearGradient>
            <linearGradient id="sf-glass" x1="0" y1="0" x2="0.7" y2="0.4">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="sf-sylhet">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <filter id="sf-edge" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.4" floodColor="#38bdf8" floodOpacity="0.5" />
            </filter>
            <linearGradient id="sf-drop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6b6b" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <filter id="glow-badge" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Sylhet active area glow */}
          <circle cx={sx(SYLHET_CENTER[0])} cy={sy(SYLHET_CENTER[1])} r="64" fill="url(#sf-sylhet)" />

          {/* 3D Extrude depth illusion layers */}
          {is3D && (
            <>
              <path d={mainPath} transform="translate(0,7)" fill="#030d1a" opacity="0.9" />
              <path d={mainPath} transform="translate(0,4)" fill="#06182b" opacity="0.85" />
            </>
          )}

          {/* Bangladesh real shape */}
          <path d={mainPath} fill="url(#sf-face)" stroke="rgba(125,190,255,0.55)" strokeWidth="1.3" strokeLinejoin="round" />
          <path d={mainPath} fill="url(#sf-glass)" />

          {/* Coming-soon routes to 7 divisions */}
          {nonSylhetDivisions.map((div, i) => (
            <g key={`route-${div.id}`}>
              <path d={curve(ORIGIN, div.coords)} fill="none" stroke="#64748b" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 5">
                <animate attributeName="stroke-dashoffset" values="0;-32" dur="3.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              </path>
              <circle r="2.4" fill="#94a3b8" opacity="0.5">
                <animateMotion dur="3.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" path={curve(ORIGIN, partialEnd(ORIGIN, div.coords, 0.42))} />
                <animate attributeName="opacity" values="0;0.55;0" dur="3.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}

          {/* Sylhet destination dots */}
          {SYLHET_DISTRICTS.map((p, i) => (
            <circle key={`n${i}`} cx={sx(p[0])} cy={sy(p[1])} r="3" fill="#fecaca" opacity="0.9" />
          ))}

          {/* Blood network from Sunamganj */}
          {SYLHET_DISTRICTS.map((p, i) => {
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

          {/* Origin hub: Sunamganj */}
          <circle cx={sx(ORIGIN[0])} cy={sy(ORIGIN[1])} r="14" fill="url(#sf-sylhet)" />
          <circle cx={sx(ORIGIN[0])} cy={sy(ORIGIN[1])} r="6" fill="none" stroke="#ffffff" strokeWidth="1.4">
            <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0;0.9" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={sx(ORIGIN[0])} cy={sy(ORIGIN[1])} r="4" fill="#ffffff" />

          {/* DIVISION LABELS & PINS FOR ALL 8 DIVISIONS */}
          {ALL_DIVISIONS.map((div) => {
            const px = sx(div.coords[0]);
            const py = sy(div.coords[1]);
            const isSelected = hoveredDiv?.id === div.id;

            return (
              <g
                key={`div-node-${div.id}`}
                className="cursor-pointer transition-transform duration-200"
                onMouseEnter={() => setHoveredDiv(div)}
                onMouseLeave={() => setHoveredDiv(null)}
              >
                {/* Division Pin Marker */}
                {div.isActive ? (
                  <>
                    <circle cx={px} cy={py} r="7" fill="#ef4444" opacity="0.4">
                      <animate attributeName="r" values="5;10;5" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={px} cy={py} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.2" />
                  </>
                ) : (
                  <circle cx={px} cy={py} r="3" fill={isSelected ? "#38bdf8" : "#94a3b8"} stroke="#1e293b" strokeWidth="0.8" />
                )}

                {/* Division Name Badge / Label */}
                <g transform={`translate(${px + div.dx}, ${py + div.dy})`} filter="url(#glow-badge)">
                  <rect
                    x="-2"
                    y="-10"
                    width={div.nameBn.length * 9 + (div.isActive ? 22 : 12)}
                    height="15"
                    rx="4"
                    fill={div.isActive ? "#991b1b" : isSelected ? "#0f172a" : "#020617"}
                    fillOpacity={div.isActive ? "0.92" : "0.78"}
                    stroke={div.isActive ? "#f87171" : isSelected ? "#38bdf8" : "#334155"}
                    strokeWidth={div.isActive ? "1.2" : "0.8"}
                  />
                  {div.isActive && (
                    <circle cx="5" cy="-2.5" r="2.5" fill="#34d399">
                      <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <text
                    x={div.isActive ? "12" : "3"}
                    y="1"
                    fontSize="9.5"
                    fontWeight="700"
                    fill={div.isActive ? "#ffffff" : isSelected ? "#38bdf8" : "#cbd5e1"}
                    fontFamily="inherit"
                  >
                    {div.nameBn}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover Info Banner / Tooltip Card */}
      <div className="mt-3 flex flex-col items-center text-center text-xs">
        {hoveredDiv ? (
          <div className="rounded-xl border border-brand-300/30 bg-brand-950/80 px-3.5 py-1.5 backdrop-blur-md transition-all shadow-lg">
            <p className="font-bold text-white flex items-center gap-1.5 justify-center">
              <span>{hoveredDiv.isActive ? "🟢" : "🔜"}</span>
              <span>{hoveredDiv.nameBn} বিভাগ ({hoveredDiv.nameEn})</span>
            </p>
            <p className="mt-0.5 text-[11px] text-brand-200/90">{hoveredDiv.statusBn}</p>
          </div>
        ) : (
          <div className="transition-all">
            <p className="font-bold text-white">✅ সিলেট বিভাগ সম্পূর্ণ সক্রিয় (৮টি বিভাগ চিহ্নিত)</p>
            <p className="mt-0.5 text-brand-200/70">🔜 পরবর্তী লক্ষ্য: সারা বাংলাদেশে রক্তসেবা সম্প্রসারণ</p>
          </div>
        )}
      </div>

      <style>{`@keyframes svgP { 0%,100%{transform:translateY(0) scale(1);opacity:.2} 50%{transform:translateY(-12px) scale(1.4);opacity:.55} }`}</style>
    </div>
  );
}
