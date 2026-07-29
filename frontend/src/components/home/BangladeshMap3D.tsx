"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang as L } from "@/lib/i18n";

// REAL Bangladesh SVG path (from world-map-country-shapes / simplemaps.com)
const BD_PATH = "M1486.5 431.9l-4.5-10.1-1.5.1-.2 4-3.5-3.3 1.1-3.6 2.4-.4 1.6-5.3-3.4-1.1-5 .1-5.4-.9-1.2-4.4-2.7-.4-4.8-2.7-1.2 4.3 4.6 3.4-3.1 2.4-.8 2.3 3.7 1.7-.4 3.8 2.6 4.8 1.6 5.2 2.2.6 1.7.7.6-1.2 2.5 1.3 1.3-3.5-.9-2.6 5.1.2 2.8 3.7 1.5 3.1.8 3.2 2 3.3-1.1-5.1 2.1 1-.5-4.6z";

// ViewBox focused on Bangladesh
const VB = "1455 412 45 97";

// Sylhet districts (positions in raw coords — NE of BD)
const SYLHET_PT = [
  { n: "সুনামগঞ্জ", x: 1481, y: 422, hq: true },
  { n: "সিলেট", x: 1489, y: 419 },
  { n: "হবিগঞ্জ", x: 1482, y: 438 },
  { n: "মৌলভীবাজার", x: 1488, y: 433 },
  { n: "ছাতক", x: 1484, y: 416 },
  { n: "জগন্নাথপুর", x: 1478, y: 430 },
  { n: "বিয়ানিবাজার", x: 1485, y: 425 },
  { n: "গোয়াইনঘাট", x: 1491, y: 416 },
  { n: "কানাইঘাট", x: 1492, y: 424 },
  { n: "দিরাই", x: 1477, y: 435 },
  { n: "তাহিরপুর", x: 1486, y: 413 },
  { n: "ধর্মপাশা", x: 1488, y: 414 },
  { n: "জামালগঞ্জ", x: 1480, y: 426 },
  { n: "শ্রীমঙ্গল", x: 1486, y: 438 },
  { n: "বড়লেখা", x: 1491, y: 437 },
  { n: "কুলাউড়া", x: 1487, y: 436 },
  { n: "নবীগঞ্জ", x: 1476, y: 434 },
  { n: "মাধবপুর", x: 1479, y: 441 },
  { n: "চুনারুঘাট", x: 1483, y: 442 },
  { n: "কমলগঞ্জ", x: 1488, y: 441 },
];

// Other divisions (future expansion)
const DIVISIONS = [
  { n: "ঢাকা", x: 1474, y: 461 },
  { n: "চট্টগ্রাম", x: 1491, y: 491 },
  { n: "রাজশাহী", x: 1463, y: 440 },
  { n: "খুলনা", x: 1465, y: 480 },
  { n: "বরিশাল", x: 1475, y: 485 },
  { n: "রংপুর", x: 1463, y: 425 },
  { n: "ময়মনসিংহ", x: 1474, y: 435 },
];

// Sylhet region overlay (approximate NE polygon)
const SYLHET_OVERLAY = "M1476,415 L1493,412 L1495,425 L1492,440 L1480,443 L1475,430 Z";

export default function BangladeshMap3D({ lang }: { lang: L }) {
  const ref = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const en = lang === "en";
  const hq = { x: 1481, y: 422 };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setParallax({ x: (e.clientX - r.left - r.width / 2) / 60, y: (e.clientY - r.top - r.height / 2) / 60 });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-sm select-none">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-blood-500/8 to-brand-500/8 blur-3xl" />

      {/* Legend */}
      <div className="mb-3 flex flex-wrap gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-blood-400/20 bg-blood-500/10 px-3 py-1 backdrop-blur-sm">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blood-500 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-blood-500" /></span>
          <span className="text-xs font-bold text-blood-300">{en ? "Active" : "সক্রিয়"}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-slate-500" />
          <span className="text-xs font-medium text-white/40">{en ? "Upcoming" : "আসন্ন"}</span>
        </div>
      </div>

      {/* 3D Map */}
      <div className="transition-transform duration-300 ease-out" style={{ transform: `perspective(800px) rotateY(${parallax.x * 0.5}deg) rotateX(${-parallax.y * 0.5}deg)` }}>
        <svg viewBox={VB} className="w-full drop-shadow-[0_12px_40px_rgba(11,79,156,0.3)]" role="img">
          <defs>
            <linearGradient id="bdGlass3d" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a2f4e" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0d1b2e" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="glassHi" x1="0" y1="0" x2="0.8" y2="0.5">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="sylhetGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff5252" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a61e1e" stopOpacity="0.5" />
            </linearGradient>
            <radialGradient id="sylhetRadial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d62828" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#d62828" stopOpacity="0" />
            </radialGradient>
            <filter id="dropSh3d"><feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#d62828" floodOpacity="0.5" /></filter>
            <filter id="bdSh3d"><feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0b4f9c" floodOpacity="0.25" /></filter>
          </defs>

          {/* Bangladesh REAL outline */}
          <g filter="url(#bdSh3d)">
            <path d={BD_PATH} fill="url(#bdGlass3d)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.4" strokeLinejoin="round" />
            <path d={BD_PATH} fill="url(#glassHi)" />
          </g>

          {/* Sylhet glow */}
          <circle cx="1485" cy="427" r="10" fill="url(#sylhetRadial)">
            <animate attributeName="r" values="8;12;8" dur="4s" repeatCount="indefinite" />
          </circle>

          {/* Sylhet region overlay */}
          <path d={SYLHET_OVERLAY} fill="url(#sylhetGrad)" stroke="#ff6b6b" strokeWidth="0.25" strokeLinejoin="round" opacity="0.85">
            <animate attributeName="opacity" values="0.75;0.9;0.75" dur="3s" repeatCount="indefinite" />
          </path>

          {/* Other divisions — faded */}
          {DIVISIONS.map((d, i) => (
            <g key={d.n} opacity="0.3">
              <circle cx={d.x} cy={d.y} r="0.8" fill="#475569" />
              <circle cx={d.x} cy={d.y} r="0.8" fill="none" stroke="#64748b" strokeWidth="0.15" opacity="0.5">
                <animate attributeName="r" values="0.8;2;0.8" dur="5s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="5s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
              </circle>
              <text x={d.x} y={d.y - 1.5} textAnchor="middle" fill="#64748b" style={{ fontSize: 1.5, fontWeight: 500 }}>{d.n}</text>
            </g>
          ))}

          {/* Expansion dotted routes */}
          {DIVISIONS.map((d, i) => {
            const mx = hq.x + (d.x - hq.x) * 0.55;
            const my = hq.y + (d.y - hq.y) * 0.55 - 2;
            return (
              <path key={`r${i}`} d={`M${hq.x},${hq.y} Q${(hq.x + d.x) / 2},${(hq.y + d.y) / 2 - 3} ${mx},${my}`} fill="none" stroke="#d62828" strokeWidth="0.15" strokeDasharray="0.5 1" opacity="0.3">
                <animate attributeName="stroke-dashoffset" values="0;-8" dur="4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              </path>
            );
          })}

          {/* Sylhet district markers */}
          {SYLHET_PT.map((d, i) => (
            <g key={d.n}>
              {d.hq ? (
                <>
                  <circle cx={d.x} cy={d.y} r="1.8" fill="none" stroke="#fff" strokeWidth="0.25" opacity="0.4">
                    <animate attributeName="r" values="1.5;3.5;1.5" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={d.x} cy={d.y} r="1.2" fill="#fff" filter="url(#dropSh3d)">
                    <animate attributeName="r" values="1;1.5;1" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </>
              ) : (
                <>
                  <circle cx={d.x} cy={d.y} r="0.7" fill="#d62828" filter="url(#dropSh3d)">
                    <animate attributeName="r" values="0.6;0.9;0.6" dur="2s" begin={`${i * 0.08}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx={d.x} cy={d.y} r="0.7" fill="none" stroke="#ff6b6b" strokeWidth="0.15">
                    <animate attributeName="r" values="0.7;1.8;0.7" dur="3s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
                  </circle>
                </>
              )}
            </g>
          ))}

          {/* Blood flow from HQ to districts */}
          {SYLHET_PT.filter(d => !d.hq).slice(0, 12).map((d, i) => (
            <circle key={`f${i}`} r="0.5" fill="#ff5252" filter="url(#dropSh3d)" opacity="0.8">
              <animateMotion dur={`${2.5 + (i % 5) * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.15}s`} path={`M${hq.x},${hq.y} L${d.x},${d.y}`} />
              <animate attributeName="opacity" values="0;0.9;0" dur={`${2.5 + (i % 5) * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.15}s`} />
            </circle>
          ))}

          {/* Expansion flow (partial) */}
          {DIVISIONS.map((d, i) => {
            const mx = hq.x + (d.x - hq.x) * 0.55;
            const my = hq.y + (d.y - hq.y) * 0.55 - 2;
            return (
              <circle key={`ef${i}`} r="0.3" fill="#d62828" opacity="0.3">
                <animateMotion dur="5s" repeatCount="indefinite" begin={`${i * 0.5}s`} path={`M${hq.x},${hq.y} Q${(hq.x + d.x) / 2},${(hq.y + d.y) / 2 - 3} ${mx},${my}`} />
                <animate attributeName="opacity" values="0;0.4;0" dur="5s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
              </circle>
            );
          })}
        </svg>
      </div>

      {/* Message */}
      <div className="mt-3 rounded-2xl border border-white/8 bg-white/5 px-5 py-3 backdrop-blur-md">
        <p className="text-center text-xs leading-relaxed text-white/50">
          {en ? "✅ Sylhet Division fully covered — every district & upazila. 🔜 Next: all of Bangladesh." : "✅ সিলেট বিভাগের প্রতিটি জেলা ও উপজেলায় রক্তসেবা সম্পূর্ণ সক্রিয়। 🔜 পরবর্তী লক্ষ্য: সারা বাংলাদেশে সম্প্রসারণ।"}
        </p>
      </div>
    </div>
  );
}
