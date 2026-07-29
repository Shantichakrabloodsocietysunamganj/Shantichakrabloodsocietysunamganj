import type { Lang } from "@/lib/i18n";

// REAL Bangladesh SVG path (simplemaps/world-map-country-shapes)
const BD_PATH =
  "M1486.5 431.9l-4.5-10.1-1.5.1-.2 4-3.5-3.3 1.1-3.6 2.4-.4 1.6-5.3-3.4-1.1-5 .1-5.4-.9-1.2-4.4-2.7-.4-4.8-2.7-1.2 4.3 4.6 3.4-3.1 2.4-.8 2.3 3.7 1.7-.4 3.8 2.6 4.8 1.6 5.2 2.2.6 1.7.7.6-1.2 2.5 1.3 1.3-3.5-.9-2.6 5.1.2 2.8 3.7 1.5 3.1.8 3.2 2 3.3-1.1-5.1 2.1 1-.5-4.6z";
const VB = "1455 412 45 97";

// সিলেট বিভাগের আসল জেলা-অবস্থান (raw coords)
const SYLHET_HQ = [
  { n: "সুনামগঞ্জ", en: "Sunamganj", x: 1481, y: 422 },
  { n: "সিলেট", en: "Sylhet", x: 1489, y: 419 },
  { n: "হবিগঞ্জ", en: "Habiganj", x: 1482, y: 438 },
  { n: "মৌলভীবাজার", en: "Moulvibazar", x: 1488, y: 433 },
];
// অন্যান্য বিভাগ (হালকা রেফারেন্স)
const DIVISIONS = [
  { n: "ঢাকা", en: "Dhaka", x: 1474, y: 461 },
  { n: "চট্টগ্রাম", en: "Chittagong", x: 1491, y: 491 },
  { n: "রাজশাহী", en: "Rajshahi", x: 1463, y: 440 },
  { n: "খুলনা", en: "Khulna", x: 1465, y: 480 },
  { n: "রংপুর", en: "Rangpur", x: 1463, y: 425 },
  { n: "ময়মনসিংহ", en: "Mymensingh", x: 1474, y: 435 },
];

export default function BangladeshMap({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-200/25 blur-3xl" />

      <svg viewBox={VB} className="relative w-full drop-shadow-[0_10px_30px_rgba(11,79,156,0.25)]" role="img" aria-label={en ? "Bangladesh map — Sylhet highlighted" : "বাংলাদেশ মানচিত্র — সিলেট হাইলাইট"}>
        <defs>
          <linearGradient id="bdFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a2f4e" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0d1b2e" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="bdRim" x1="0" y1="0" x2="0.8" y2="0.5">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="sylhetGlow">
            <stop offset="0%" stopColor="#d62828" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#d62828" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* বাংলাদেশ */}
        <path d={BD_PATH} fill="url(#bdFill)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.35" strokeLinejoin="round" />
        <path d={BD_PATH} fill="url(#bdRim)" />

        {/* সিলেট অঞ্চল glow */}
        <circle cx="1484" cy="428" r="13" fill="url(#sylhetGlow)" />

        {/* অন্যান্য বিভাগ (হালকা) */}
        {DIVISIONS.map((d, i) => (
          <g key={d.en} opacity="0.5">
            <circle cx={d.x} cy={d.y} r="0.7" fill="#64748b" />
            <text x={d.x} y={d.y - 1.6} textAnchor="middle" fill="#64748b" style={{ fontSize: 1.7, fontWeight: 500 }}>
              {en ? d.en : d.n}
            </text>
          </g>
        ))}

        {/* সিলেটের জেলাগুলো */}
        {SYLHET_HQ.map((d, i) => (
          <g key={d.en}>
            <circle cx={d.x} cy={d.y} r="1.4" fill="none" stroke="#ff6b6b" strokeWidth="0.25">
              <animate attributeName="r" values="1.4;3;1.4" dur="2.6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0;0.7" dur="2.6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={d.x} cy={d.y} r="1.1" fill="#d62828" />
            <text x={d.x} y={d.y - 2.1} textAnchor="middle" fill="#0f172a" style={{ fontSize: 2, fontWeight: 700 }}>
              {en ? d.en : d.n}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-ink/60">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blood-500" />{en ? "Sylhet (active)" : "সিলেট (সক্রিয়)"}</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-400" />{en ? "Other divisions (upcoming)" : "অন্যান্য বিভাগ (আসন্ন)"}</span>
      </div>
    </div>
  );
}
