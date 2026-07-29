"use client";

import type { Lang } from "@/lib/i18n";

// আরও নির্ভুল বাংলাদেশের আউটলাইন + সিলেট অঞ্চল + প্রবাহিত রক্তের ফোঁটা
const BD_PATH =
  "M70,150 L120,120 L175,95 C200,85 230,80 255,75 C285,72 305,78 318,95 C330,110 338,130 332,155 " +
  "C340,175 345,200 338,225 C348,240 352,265 342,290 C350,305 345,325 330,335 C315,345 295,338 280,325 " +
  "C255,340 225,345 195,340 C165,350 135,355 115,345 C95,335 80,315 78,285 C68,255 65,220 68,185 C66,168 67,158 70,150 Z";
const SYLHET_PATH = "M255,95 C285,88 318,92 333,112 C339,132 333,156 320,166 C300,174 274,166 261,151 C250,135 248,110 255,95 Z";

const DISTRICTS = [
  { name: { bn: "সুনামগঞ্জ", en: "Sunamganj" }, x: 272, y: 128 },
  { name: { bn: "সিলেট", en: "Sylhet" }, x: 316, y: 108 },
  { name: { bn: "হবিগঞ্জ", en: "Habiganj" }, x: 286, y: 162 },
  { name: { bn: "মৌলভীবাজার", en: "Moulvibazar" }, x: 322, y: 148 },
];
// প্রেক্ষাপটে অন্যান্য বড় শহর (হালকা)
const CITIES = [
  { name: { bn: "ঢাকা", en: "Dhaka" }, x: 200, y: 220 },
  { name: { bn: "চট্টগ্রাম", en: "Chittagong" }, x: 318, y: 262 },
  { name: { bn: "রাজশাহী", en: "Rajshahi" }, x: 105, y: 175 },
  { name: { bn: "খুলনা", en: "Khulna" }, x: 130, y: 295 },
];
const HUB = { x: 200, y: 220 };

export default function BloodFlowMap({ lang }: { lang: Lang }) {
  const flowPath = (d: { x: number; y: number }) =>
    `M${d.x},${d.y} Q${(d.x + HUB.x) / 2},${Math.min(d.y, HUB.y) - 40} ${HUB.x},${HUB.y}`;

  // প্রতি জেলায় একাধিক ফোঁটা (staggered) — ঘন প্রবাহ
  const drops: { i: number; k: number }[] = [];
  DISTRICTS.forEach((_, i) => {
    for (let k = 0; k < 3; k++) drops.push({ i, k });
  });

  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* ব্যাকগ্রাউন্ড glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-200/20 blur-3xl" />

      <svg viewBox="0 0 400 400" className="relative w-full" role="img" aria-label={lang === "en" ? "Sylhet blood flow map" : "সিলেট রক্ত প্রবাহ মানচিত্র"}>
        <defs>
          <linearGradient id="bdFill2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0b4f9c" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#0b4f9c" stopOpacity="0.05" />
          </linearGradient>
          <radialGradient id="hubGlow2">
            <stop offset="0%" stopColor="#d62828" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#d62828" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dropGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#a61e1e" />
          </linearGradient>
          <filter id="ds2" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#d62828" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* বাংলাদেশ */}
        <path d={BD_PATH} fill="url(#bdFill2)" stroke="#0b4f9c" strokeWidth="2.2" strokeLinejoin="round" />
        {/* সিলেট অঞ্চল */}
        <path d={SYLHET_PATH} fill="#d62828" fillOpacity="0.16" stroke="#d62828" strokeWidth="1.6" strokeDasharray="3 3" />

        {/* অন্যান্য শহর (হালকা পয়েন্ট) */}
        {CITIES.map((c, i) => (
          <g key={`c${i}`}>
            <circle cx={c.x} cy={c.y} r="2.5" fill="#0b4f9c" fillOpacity="0.4" />
            <text x={c.x} y={c.y - 6} textAnchor="middle" fill="#0b4f9c" fillOpacity="0.45" style={{ fontSize: 7.5 }}>
              {c.name[lang]}
            </text>
          </g>
        ))}

        {/* flow paths */}
        {DISTRICTS.map((d, i) => (
          <path key={`p${i}`} id={`flow${i}`} d={flowPath(d)} fill="none" stroke="#d62828" strokeWidth="1.2" strokeOpacity="0.22" strokeDasharray="2 4" />
        ))}

        {/* কেন্দ্র — pulsing heart */}
        <circle cx={HUB.x} cy={HUB.y} r="36" fill="url(#hubGlow2)">
          <animate attributeName="r" values="30;44;30" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <g transform={`translate(${HUB.x - 15},${HUB.y - 14})`} filter="url(#ds2)">
          <svg width="30" height="30" viewBox="0 0 24 24">
            <path d="M12 21s-7-4.6-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 4 2.3 0.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.4 12 21 12 21z" fill="#d62828">
              <animate attributeName="opacity" values="1;0.65;1" dur="1.1s" repeatCount="indefinite" />
            </path>
          </svg>
        </g>

        {/* জেলার ডট */}
        {DISTRICTS.map((d, i) => (
          <g key={`d${i}`}>
            <circle cx={d.x} cy={d.y} r="5.5" fill="#d62828" filter="url(#ds2)" />
            <circle cx={d.x} cy={d.y} r="5.5" fill="none" stroke="#d62828" strokeOpacity="0.5">
              <animate attributeName="r" values="5.5;13;5.5" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </circle>
            <text x={d.x} y={d.y - 11} textAnchor="middle" className="fill-ink" style={{ fontSize: 9.5, fontWeight: 700 }}>
              {d.name[lang]}
            </text>
          </g>
        ))}

        {/* প্রবাহিত রক্তের ফোঁটা (ঘন) */}
        {drops.map(({ i, k }, idx) => {
          const dur = 2.6 + i * 0.25;
          const begin = i * 0.45 + k * (dur / 3);
          return (
            <g key={`f${idx}`}>
              {/* ফোঁটা ট্রেইল */}
              <circle r="3.5" fill="url(#dropGrad)" filter="url(#ds2)" opacity="0.95">
                <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${begin}s`} rotate="auto">
                  <mpath href={`#flow${i}`} />
                </animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" dur={`${dur}s`} repeatCount="indefinite" begin={`${begin}s`} />
              </circle>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-ink/60">
        <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-blood-500" />{lang === "en" ? "Sylhet districts" : "সিলেটের জেলা"}</span>
        <span className="inline-flex items-center gap-1"><span>❤️</span>{lang === "en" ? "Network hub" : "নেটওয়ার্ক কেন্দ্র"}</span>
        <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-brand-400/50" />{lang === "en" ? "Other cities" : "অন্যান্য শহর"}</span>
      </div>
    </div>
  );
}
