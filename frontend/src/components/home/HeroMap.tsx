"use client";

import type { Lang } from "@/lib/i18n";

// 3D Glassmorphism Bangladesh Map — Sylhet highlighted + expansion paths
export default function HeroMap({ lang }: { lang: Lang }) {
  const en = lang === "en";

  // Bangladesh divisions (simplified positions)
  const divisions = [
    { name: "Sylhet", bn: "সিলেট", x: 330, y: 105, active: true },
    { name: "Dhaka", bn: "ঢাকা", x: 210, y: 195, active: false },
    { name: "Chittagong", bn: "চট্টগ্রাম", x: 305, y: 270, active: false },
    { name: "Rajshahi", bn: "রাজশাহী", x: 110, y: 160, active: false },
    { name: "Khulna", bn: "খুলনা", x: 125, y: 270, active: false },
    { name: "Barishal", bn: "বরিশাল", x: 195, y: 285, active: false },
    { name: "Rangpur", bn: "রংপুর", x: 130, y: 85, active: false },
    { name: "Mymensingh", bn: "ময়মনসিংহ", x: 235, y: 120, active: false },
  ];

  // Sylhet sub-districts
  const sylhetDistricts = [
    { name: "সুনামগঞ্জ", x: 305, y: 115 },
    { name: "সিলেট", x: 340, y: 95 },
    { name: "হবিগঞ্জ", x: 310, y: 150 },
    { name: "মৌলভীবাজার", x: 345, y: 140 },
  ];

  // Expansion dotted paths from Sylhet to other divisions
  const expansionPaths = [
    "M330,110 Q280,140 235,120",
    "M330,110 Q270,150 210,195",
    "M330,110 Q310,180 305,270",
    "M330,110 Q230,130 130,85",
    "M330,110 Q220,180 195,285",
    "M330,110 Q220,180 125,270",
    "M330,110 Q170,130 110,160",
  ];

  // Bangladesh outline path (stylized)
  const BD_PATH = "M70,140 C72,110 95,92 125,88 C150,80 170,70 200,68 C235,62 270,75 300,95 C325,108 345,120 350,150 C358,170 360,200 345,225 C355,245 350,275 325,288 C335,305 325,330 300,328 C280,335 255,325 240,310 C210,318 180,312 160,295 C125,292 95,275 80,245 C62,215 66,175 70,140 Z";
  const SYLHET_PATH = "M255,92 C278,76 312,74 338,94 C350,107 350,126 334,136 C312,146 282,140 262,128 C250,118 248,102 255,92 Z";

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Glow behind map */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-brand-400/15 to-blood-500/10 blur-3xl" />

      {/* Labels */}
      <div className="absolute left-3 top-2 z-10 rounded-lg border border-blood-300/30 bg-blood-500/15 px-3 py-1 text-xs font-bold text-blood-300 backdrop-blur-sm">
        📍 বর্তমানে: সিলেট বিভাগ
      </div>
      <div className="absolute bottom-2 right-3 z-10 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/50 backdrop-blur-sm">
        🎯 পরবর্তী লক্ষ্য: সারাদেশ
      </div>

      <svg viewBox="0 0 400 360" className="relative w-full drop-shadow-[0_8px_30px_rgba(11,79,156,0.3)]" role="img" aria-label={en ? "Bangladesh map with Sylhet highlighted" : "বাংলাদেশ মানচিত্র — সিলেট হাইলাইটেড"}>
        <defs>
          {/* 3D glassmorphism gradient for BD */}
          <linearGradient id="bdGlass" x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#0f1e33" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.2" />
          </linearGradient>
          {/* Sylhet active gradient (brand red) */}
          <linearGradient id="sylhetActive" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#d62828" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a61e1e" stopOpacity="0.6" />
          </linearGradient>
          {/* Glow for Sylhet */}
          <radialGradient id="sylhetGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d62828" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#d62828" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#d62828" stopOpacity="0" />
          </radialGradient>
          {/* Glass highlight overlay */}
          <linearGradient id="glassHighlight" x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          {/* Drop shadow filter */}
          <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0b4f9c" floodOpacity="0.3" />
          </filter>
          <filter id="dropGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#d62828" floodOpacity="0.5" />
          </filter>
          {/* Expansion line gradient */}
          <linearGradient id="expandLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d62828" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* BD Outline — glassmorphism */}
        <g filter="url(#mapShadow)">
          <path d={BD_PATH} fill="url(#bdGlass)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Glass highlight overlay */}
          <path d={BD_PATH} fill="url(#glassHighlight)" />
        </g>

        {/* Other divisions — faded neutral markers */}
        {divisions.filter(d => !d.active).map((d, i) => (
          <g key={d.name} opacity="0.35">
            <circle cx={d.x} cy={d.y} r="4" fill="#64748b" />
            <text x={d.x} y={d.y - 8} textAnchor="middle" fill="#94a3b8" style={{ fontSize: 7, fontWeight: 500 }}>
              {en ? d.name : d.bn}
            </text>
          </g>
        ))}

        {/* Expansion dotted paths (animated) */}
        {expansionPaths.map((p, i) => (
          <path
            key={`exp${i}`}
            d={p}
            fill="none"
            stroke="url(#expandLine)"
            strokeWidth="1"
            strokeDasharray="3 5"
            opacity="0.4"
          >
            <animate attributeName="stroke-dashoffset" values="0;-40" dur="3s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </path>
        ))}

        {/* Sylhet glow pulse */}
        <circle cx="300" cy="112" r="50" fill="url(#sylhetGlow)">
          <animate attributeName="r" values="45;60;45" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Sylhet region — highlighted */}
        <path d={SYLHET_PATH} fill="url(#sylhetActive)" stroke="#ff6b6b" strokeWidth="1.5" strokeLinejoin="round" opacity="0.9">
          <animate attributeName="opacity" values="0.85;0.95;0.85" dur="2s" repeatCount="indefinite" />
        </path>

        {/* Pulsing ring around Sylhet */}
        <circle cx="300" cy="112" r="35" fill="none" stroke="#d62828" strokeWidth="1.5" opacity="0.5">
          <animate attributeName="r" values="30;50;30" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* Sylhet district markers — animated blood drops */}
        {sylhetDistricts.map((d, i) => (
          <g key={d.name}>
            {/* Drop */}
            <g filter="url(#dropGlow)">
              <circle cx={d.x} cy={d.y} r="4.5" fill="#d62828">
                <animate attributeName="r" values="4;5.5;4" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              </circle>
            </g>
            {/* Pulse ring */}
            <circle cx={d.x} cy={d.y} r="4.5" fill="none" stroke="#ff6b6b" strokeWidth="1">
              <animate attributeName="r" values="4.5;12;4.5" dur="2.5s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            </circle>
            {/* Label */}
            <text x={d.x} y={d.y - 10} textAnchor="middle" fill="#fff" style={{ fontSize: 8, fontWeight: 700 }} opacity="0.9">
              {d.name}
            </text>
          </g>
        ))}

        {/* Central hub in Sylhet */}
        <g transform="translate(295,108)">
          <circle r="3" fill="#fff" opacity="0.8">
            <animate attributeName="r" values="2.5;4;2.5" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Division labels for active region */}
        <text x="300" y="80" textAnchor="middle" fill="#ff6b6b" style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1 }} opacity="0.8">
          {en ? "SYLHET" : "সিলেট বিভাগ"}
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[10px]">
        <span className="inline-flex items-center gap-1 text-white/70">
          <span className="h-2 w-2 rounded-full bg-blood-500" /> {en ? "Active region" : "সক্রিয় অঞ্চল"}
        </span>
        <span className="inline-flex items-center gap-1 text-white/40">
          <span className="h-2 w-2 rounded-full bg-slate-500" /> {en ? "Future expansion" : "ভবিষ্যৎ সম্প্রসারণ"}
        </span>
      </div>

      {/* Expansion message */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center backdrop-blur-sm">
        <p className="text-xs leading-relaxed text-white/60">
          {en
            ? "Currently serving Sylhet Division. Our goal: reach every district of Bangladesh with emergency blood service."
            : "বর্তমানে সিলেট বিভাগের বিভিন্ন জেলায় রক্তসেবা প্রদান করছি। লক্ষ্য — বাংলাদেশের প্রতিটি জেলায় জরুরি রক্তসেবা পৌঁছে দেওয়া।"}
        </p>
      </div>
    </div>
  );
}
