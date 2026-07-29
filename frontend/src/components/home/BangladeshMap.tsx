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
const DIVISIONS = [
  { n: "ঢাকা", en: "Dhaka", x: 1474, y: 461 },
  { n: "চট্টগ্রাম", en: "Chittagong", x: 1491, y: 491 },
  { n: "রাজশাহী", en: "Rajshahi", x: 1463, y: 440 },
  { n: "খুলনা", en: "Khulna", x: 1465, y: 480 },
  { n: "রংপুর", en: "Rangpur", x: 1463, y: 425 },
  { n: "ময়মনসিংহ", en: "Mymensingh", x: 1474, y: 435 },
];

export default function BangladeshMap({ lang, variant = "light" }: { lang: Lang; variant?: "light" | "dark" }) {
  const en = lang === "en";
  const dark = variant === "dark";
  return (
    <div
      className={`flex flex-col items-center gap-3 p-5 ${
        dark ? "rounded-3xl border border-white/15 bg-white/[0.07] backdrop-blur-md shadow-glow" : "card bg-gradient-to-b from-brand-50/60 to-white"
      }`}
    >
      <svg
        viewBox={VB}
        className="block h-auto w-full max-w-[13rem] sm:max-w-[15rem]"
        role="img"
        aria-label={en ? "Bangladesh map — Sylhet highlighted" : "বাংলাদেশ মানচিত্র — সিলেট হাইলাইট"}
      >
        <defs>
          <linearGradient id="bdFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#256fc0" />
            <stop offset="100%" stopColor="#0b4f9c" />
          </linearGradient>
          <radialGradient id="sylhetGlow">
            <stop offset="0%" stopColor="#d62828" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#d62828" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* সিলেট অঞ্চল glow */}
        <circle cx="1484" cy="428" r="15" fill="url(#sylhetGlow)" />

        {/* বাংলাদেশ */}
        <path d={BD_PATH} fill="url(#bdFill)" stroke="#ffffff" strokeWidth="0.6" strokeLinejoin="round" />

        {/* অন্যান্য বিভাগ (হালকা সাদা ডট) */}
        {DIVISIONS.map((d) => (
          <g key={d.en} opacity="0.85">
            <circle cx={d.x} cy={d.y} r="1" fill="#ffffff" />
            <text x={d.x} y={d.y - 2} textAnchor="middle" fill="#ffffff" style={{ fontSize: 2, fontWeight: 500 }}>
              {en ? d.en : d.n}
            </text>
          </g>
        ))}

        {/* সিলেটের জেলাগুলো */}
        {SYLHET_HQ.map((d, i) => (
          <g key={d.en}>
            <circle cx={d.x} cy={d.y} r="1.6" fill="none" stroke="#ffffff" strokeWidth="0.4">
              <animate attributeName="r" values="1.6;3.4;1.6" dur="2.6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0;0.9" dur="2.6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={d.x} cy={d.y} r="1.5" fill="#d62828" stroke="#ffffff" strokeWidth="0.35" />
            <text x={d.x} y={d.y - 2.4} textAnchor="middle" fill="#ffffff" style={{ fontSize: 2.1, fontWeight: 700 }}>
              {en ? d.en : d.n}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs ${dark ? "text-white/70" : "text-ink/70"}`}>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blood-500" />{en ? "Sylhet (active)" : "সিলেট (সক্রিয়)"}</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-brand-500" />{en ? "Other divisions" : "অন্যান্য বিভাগ"}</span>
      </div>
    </div>
  );
}
