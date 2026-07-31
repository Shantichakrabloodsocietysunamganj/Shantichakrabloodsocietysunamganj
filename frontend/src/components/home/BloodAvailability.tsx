"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BLOOD_GROUPS, BLOOD_GROUP_COLORS } from "@/data/constants";
import type { Lang } from "@/lib/i18n";

export default function BloodAvailability({ lang }: { lang: Lang }) {
  const supabase = createClient();
  const router = useRouter();
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const en = lang === "en";

  useEffect(() => {
    (async () => {
      try {
        const { data: donors } = await supabase
          .from("donors")
          .select("blood_group,is_available")
          .eq("is_available", true);
        const map: Record<string, number> = {};
        BLOOD_GROUPS.forEach((g) => (map[g] = 0));
        (donors ?? []).forEach((d: any) => { if (map[d.blood_group] !== undefined) map[d.blood_group]++; });
        setData(map);
      } catch {}
      setLoading(false);
    })();
  }, [supabase]);

  const max = Math.max(...Object.values(data), 1);

  const getColor = (count: number) => {
    if (count === 0) return { bg: "bg-blood-500", text: "text-blood-600", label: en ? "Critical" : "জরুরী ঘাটতি" };
    if (count <= 2) return { bg: "bg-amber-500", text: "text-amber-600", label: en ? "Low" : "কম" };
    if (count <= 5) return { bg: "bg-sky-500", text: "text-sky-600", label: en ? "Moderate" : "মোটামুটি" };
    return { bg: "bg-success-500", text: "text-success-600", label: en ? "Good" : "ভালো" };
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {BLOOD_GROUPS.map((g) => {
        const count = data[g] ?? 0;
        const c = getColor(count);
        const pct = loading ? 0 : (count / max) * 100;
        return (
          <button
            key={g}
            onClick={() => router.push(`/donors?group=${encodeURIComponent(g)}`)}
            className="group card relative p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
          >
            {/* Click hint */}
            <span className="absolute right-2 top-2 text-[10px] font-medium text-brand-400 opacity-0 transition-opacity group-hover:opacity-100">
              {en ? "View →" : "দেখুন →"}
            </span>

            <div className="flex items-center justify-between">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ring-1 ${BLOOD_GROUP_COLORS[g]}`}>{g}</span>
              <span className={`text-xs font-semibold ${c.text}`}>{c.label}</span>
            </div>

            <div className="mt-2 flex items-end gap-1">
              <span className="font-display text-2xl font-extrabold text-ink">{loading ? "—" : count}</span>
              <span className="mb-0.5 text-xs text-ink/40">{en ? "donors" : "জন"}</span>
            </div>

            {/* Availability bar */}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
              <div className={`h-full rounded-full transition-all duration-700 ${c.bg}`} style={{ width: `${loading ? 0 : Math.max(pct, count > 0 ? 8 : 0)}%` }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
