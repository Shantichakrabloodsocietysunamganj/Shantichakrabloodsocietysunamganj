"use client";

import { useTr } from "@/lib/useLang";

// হালকা SVG ডোনাট চার্ট — রক্তের গ্রুপ বিতরণ দেখাতে
const COLORS = ["#0b4f9c", "#d62828", "#16a34a", "#f59e0b", "#8b5cf6", "#0891b2", "#db2777", "#475569"];

export default function DonutChart({ data }: { data: { label: string; value: number }[] }) {
  const { t: tx } = useTr();
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = 60;
  const circ = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-8">
      <div className="relative h-44 w-44 shrink-0">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#eef2f7" strokeWidth="20" />
          {total > 0 && data.map((d, i) => {
            const len = (d.value / total) * circ;
            const seg = (
              <circle
                key={d.label}
                cx="80" cy="80" r={radius} fill="none"
                stroke={COLORS[i % COLORS.length]}
                strokeWidth="20"
                strokeDasharray={`${len} ${circ - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += len;
            return seg;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-ink">{total.toLocaleString("bn-BD")}</span>
          <span className="text-xs text-ink/50">{tx("মোট দাতা")}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="font-medium text-ink">{d.label}</span>
            <span className="text-ink/50">{d.value.toLocaleString("bn-BD")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
