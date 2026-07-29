"use client";

import type { Lang } from "@/lib/i18n";

// অ্যানিমেটেড ECG/heartbeat লাইন — "live activity" ফিল
export default function HeartbeatLine({ lang }: { lang: Lang }) {
  const path = "M0,24 L40,24 L48,24 L54,10 L62,38 L70,4 L78,44 L86,24 L130,24 L138,24 L144,12 L152,36 L160,24 L210,24 L218,24 L224,8 L232,40 L240,24 L300,24";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-blood-200 bg-blood-50/60 px-4 py-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blood-500 text-white">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 21s-7-4.6-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 4 2.3 0.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.4 12 21 12 21z" /></svg>
      </span>
      <div className="relative h-10 flex-1 overflow-hidden">
        <svg viewBox="0 0 300 48" className="h-full w-full" preserveAspectRatio="none">
          <path d={path} fill="none" stroke="#d62828" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="600" className="ecg-trace" />
        </svg>
      </div>
      <span className="text-xs font-semibold text-blood-700">{lang === "en" ? "Live" : "লাইভ"}</span>
      <style>{`
        .ecg-trace { stroke-dashoffset: 600; animation: ecgDraw 2.6s linear infinite; }
        @keyframes ecgDraw { 0% { stroke-dashoffset: 600; } 100% { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}
