"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang as L } from "@/lib/i18n";

// Sylhet division districts with positions (relative to BD viewBox)
const SYLHET_DISTRICTS = [
  { n: "সুনামগঞ্জ", x: 270, y: 118, hq: true },
  { n: "ছাতক", x: 250, y: 100 },
  { n: "জগন্নাথপুর", x: 248, y: 130 },
  { n: "দোয়ারাবাজার", x: 235, y: 108 },
  { n: "বিশ্বম্ভরপুর", x: 258, y: 92 },
  { n: "তাহিরপুর", x: 272, y: 82 },
  { n: "জামালগঞ্জ", x: 256, y: 108 },
  { n: "দিরাই", x: 260, y: 138 },
  { n: "সুল্লা", x: 240, y: 145 },
  { n: "ধর্মপাশা", x: 282, y: 88 },
  { n: "দক্ষিণ সুনামগঞ্জ", x: 262, y: 150 },
  { n: "সিলেট সদর", x: 310, y: 100 },
  { n: "গোয়াইনঘাট", x: 322, y: 88 },
  { n: "কানাইঘাট", x: 330, y: 108 },
  { n: "জৈন্তাপুর", x: 315, y: 85 },
  { n: "বালাগঞ্জ", x: 288, y: 115 },
  { n: "ফেঞ্চুগঞ্জ", x: 298, y: 108 },
  { n: "গোলাপগঞ্জ", x: 305, y: 122 },
  { n: "বিয়ানিবাজার", x: 282, y: 100 },
  { n: "বোয়ালখালী", x: 275, y: 88 },
  { n: "ওসমানীনগর", x: 295, y: 95 },
  { n: "দক্ষিণ সুরমা", x: 305, y: 92 },
  { n: "জকিগঞ্জ", x: 325, y: 95 },
  { n: "কোম্পানীগঞ্জ", x: 318, y: 118 },
  { n: "হবিগঞ্জ সদর", x: 278, y: 155 },
  { n: "আজমিরীগঞ্জ", x: 258, y: 158 },
  { n: "বাহুবল", x: 268, y: 172 },
  { n: "চুনারুঘাট", x: 290, y: 168 },
  { n: "নবীগঞ্জ", x: 260, y: 142 },
  { n: "বানিয়াচং", x: 248, y: 150 },
  { n: "শায়েস্তাগঞ্জ", x: 285, y: 150 },
  { n: "মাধবপুর", x: 268, y: 162 },
  { n: "লাখাই", x: 252, y: 145 },
  { n: "মৌলভীবাজার সদর", x: 318, y: 138 },
  { n: "বড়লেখা", x: 335, y: 148 },
  { n: "কমলগঞ্জ", x: 322, y: 160 },
  { n: "কুলাউড়া", x: 308, y: 152 },
  { n: "রাজনগর", x: 300, y: 140 },
  { n: "শ্রীমঙ্গল", x: 292, y: 158 },
  { n: "জুড়ী", x: 338, y: 155 },
];

// Other divisions (future)
const OTHER_DIVISIONS = [
  { n: "ঢাকা", x: 205, y: 195 }, { n: "চট্টগ্রাম", x: 305, y: 265 },
  { n: "রাজশাহী", x: 115, y: 155 }, { n: "খুলনা", x: 130, y: 275 },
  { n: "বরিশাল", x: 195, y: 285 }, { n: "রংপুর", x: 130, y: 85 },
  { n: "ময়মনসিংহ", x: 232, y: 120 },
];

const BD_PATH = "M70,140 C72,110 95,92 125,88 C150,80 170,70 200,68 C235,62 270,75 300,95 C325,108 345,120 350,150 C358,170 360,200 345,225 C355,245 350,275 325,288 C335,305 325,330 300,328 C280,335 255,325 240,310 C210,318 180,312 160,295 C125,292 95,275 80,245 C62,215 66,175 70,140 Z";
const SYLHET_PATH = "M245,80 C265,68 290,62 320,68 C345,74 355,88 352,108 C350,128 340,148 322,158 C300,168 272,165 252,152 C238,140 230,118 235,100 C238,88 240,82 245,80 Z";

export default function BangladeshMap3D({ lang }: { lang: L }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      setParallax({ x: (e.clientX - cx) / 50, y: (e.clientY - cy) / 50 });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Expansion paths from Sunamganj (HQ) to other divisions
  const hqX = 270, hqY = 118;
  const expansionPaths = OTHER_DIVISIONS.map(d =>
    `M${hqX},${hqY} Q${(hqX + d.x) / 2},${(hqY + d.y) / 2 - 30} ${d.x},${d.y}`
  );

  // Connection lines from HQ to each Sylhet district
  const sylhetConnections = SYLHET_DISTRICTS.filter(d => !d.hq).map(d =>
    `M${hqX},${hqY} L${d.x},${d.y}`
  );

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-lg select-none">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/10 via-blood-500/8 to-transparent blur-3xl" />

      {/* Status Legend */}
      <div className="mb-3 flex flex-wrap gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-blood-400/20 bg-blood-500/10 px-3 py-1 backdrop-blur-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blood-500 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blood-500" />
          </span>
          <span className="text-xs font-bold text-blood-300">{lang === "en" ? "Active Coverage" : "সক্রিয় অঞ্চল"}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
          <span className="text-xs font-medium text-white/40">{lang === "en" ? "Upcoming" : "আসন্ন"}</span>
        </div>
      </div>

      {/* 3D Map */}
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(800px) rotateY(${parallax.x * 0.5}deg) rotateX(${-parallax.y * 0.5}deg) translateZ(0)`,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease-out, transform 0.3s ease-out",
        }}
      >
        <svg viewBox="0 0 400 360" className="w-full drop-shadow-[0_20px_50px_rgba(11,79,156,0.35)]" role="img">
          <defs>
            <linearGradient id="bd3d" x1="0.3" y1="0" x2="0.7" y2="1">
              <stop offset="0%" stopColor="#1a2f4e" stopOpacity="0.5" />
              <stop offset="40%" stopColor="#0d1b2e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1a2f4e" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="glass3d" x1="0" y1="0" x2="0.8" y2="0.6">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="sylhet3d" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff5252" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#d62828" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#a61e1e" stopOpacity="0.55" />
            </linearGradient>
            <radialGradient id="sylhetGlow3d" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#d62828" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#d62828" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#d62828" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="expandGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d62828" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.1" />
            </linearGradient>
            <filter id="dropShadow3d"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#d62828" floodOpacity="0.5" /></filter>
            <filter id="bdShadow3d"><feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0b4f9c" floodOpacity="0.25" /></filter>
          </defs>

          {/* BD outline */}
          <g filter="url(#bdShadow3d)">
            <path d={BD_PATH} fill="url(#bd3d)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d={BD_PATH} fill="url(#glass3d)" />
          </g>

          {/* Sylhet glow */}
          <ellipse cx="290" cy="115" rx="65" ry="55" fill="url(#sylhetGlow3d)">
            <animate attributeName="rx" values="60;72;60" dur="4s" repeatCount="indefinite" />
            <animate attributeName="ry" values="50;60;50" dur="4s" repeatCount="indefinite" />
          </ellipse>

          {/* Sylhet region */}
          <path d={SYLHET_PATH} fill="url(#sylhet3d)" stroke="#ff6b6b" strokeWidth="1.2" strokeLinejoin="round" opacity="0.9">
            <animate attributeName="opacity" values="0.82;0.95;0.82" dur="3s" repeatCount="indefinite" />
          </path>

          {/* Sylhet internal connection lines (from HQ to each district) */}
          {sylhetConnections.map((p, i) => (
            <path key={`sc${i}`} d={p} fill="none" stroke="#ff6b6b" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="1 2">
              <animate attributeName="stroke-dashoffset" values="0;-6" dur="2s" begin={`${i * 0.05}s`} repeatCount="indefinite" />
            </path>
          ))}

          {/* Expansion dotted routes (future) */}
          {expansionPaths.map((p, i) => (
            <path key={`exp${i}`} d={p} fill="none" stroke="url(#expandGrad)" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.3">
              <animate attributeName="stroke-dashoffset" values="0;-30" dur="4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </path>
          ))}

          {/* Other divisions — faded markers */}
          {OTHER_DIVISIONS.map((d, i) => (
            <g key={d.n} opacity="0.3">
              <circle cx={d.x} cy={d.y} r="3" fill="#475569" />
              <circle cx={d.x} cy={d.y} r="3" fill="none" stroke="#64748b" strokeWidth="0.8" opacity="0.5">
                <animate attributeName="r" values="3;7;3" dur="5s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="5s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
              </circle>
              <text x={d.x} y={d.y - 7} textAnchor="middle" fill="#64748b" style={{ fontSize: 6, fontWeight: 500 }}>{d.n}</text>
            </g>
          ))}

          {/* Sylhet district markers — animated blood drops */}
          {SYLHET_DISTRICTS.map((d, i) => (
            <g key={d.n}>
              {d.hq ? (
                <>
                  {/* HQ — Sunamganj — special marker */}
                  <circle cx={d.x} cy={d.y} r="8" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4">
                    <animate attributeName="r" values="6;14;6" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={d.x} cy={d.y} r="5" fill="#fff" filter="url(#dropShadow3d)">
                    <animate attributeName="r" values="4.5;6;4.5" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </>
              ) : (
                <>
                  <circle cx={d.x} cy={d.y} r="3" fill="#d62828" filter="url(#dropShadow3d)">
                    <animate attributeName="r" values="2.5;3.5;2.5" dur="2s" begin={`${i * 0.08}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx={d.x} cy={d.y} r="3" fill="none" stroke="#ff6b6b" strokeWidth="0.6">
                    <animate attributeName="r" values="3;7;3" dur="3s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
                  </circle>
                </>
              )}
            </g>
          ))}

          {/* Blood flow animation — from HQ to districts */}
          {SYLHET_DISTRICTS.filter(d => !d.hq).slice(0, 15).map((d, i) => {
            const dur = 2.5 + (i % 5) * 0.3;
            const begin = i * 0.15;
            return (
              <circle key={`flow${i}`} r="2" fill="#ff5252" filter="url(#dropShadow3d)" opacity="0.8">
                <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${begin}s`} path={`M${hqX},${hqY} L${d.x},${d.y}`} />
                <animate attributeName="opacity" values="0;0.9;0" dur={`${dur}s`} repeatCount="indefinite" begin={`${begin}s`} />
              </circle>
            );
          })}

          {/* Expansion flow — from HQ toward other divisions (partial) */}
          {OTHER_DIVISIONS.map((d, i) => {
            const mx = hqX + (d.x - hqX) * 0.6; // 60% of the way
            const my = hqY + (d.y - hqY) * 0.6 - 15;
            return (
              <circle key={`eflow${i}`} r="1.5" fill="#d62828" opacity="0.3">
                <animateMotion dur="5s" repeatCount="indefinite" begin={`${i * 0.5}s`} path={`M${hqX},${hqY} Q${(hqX + d.x) / 2},${(hqY + d.y) / 2 - 30} ${mx},${my}`} />
                <animate attributeName="opacity" values="0;0.4;0" dur="5s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
              </circle>
            );
          })}

          {/* Labels */}
          <text x="290" y="70" textAnchor="middle" fill="#ff6b6b" style={{ fontSize: 8, fontWeight: 800, letterSpacing: 2 }} opacity="0.7">
            {lang === "en" ? "SYLHET DIVISION" : "সিলেট বিভাগ"}
          </text>
          <text x="205" y="210" textAnchor="middle" fill="#64748b" style={{ fontSize: 7, fontWeight: 600 }} opacity="0.25">ঢাকা</text>
        </svg>
      </div>

      {/* Expansion message */}
      <div className="mt-3 rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-transparent px-5 py-3 backdrop-blur-md">
        <p className="text-center text-xs leading-relaxed text-white/50">
          {lang === "en"
            ? "✅ Every district & upazila of Sylhet Division is fully covered. 🔜 Next mission: expand across all of Bangladesh."
            : "✅ সিলেট বিভাগের প্রতিটি জেলা ও উপজেলায় রক্তসেবা সম্পূর্ণ সক্রিয়। 🔜 পরবর্তী লক্ষ্য: সারা বাংলাদেশে সম্প্রসারণ।"}
        </p>
      </div>
    </div>
  );
}
