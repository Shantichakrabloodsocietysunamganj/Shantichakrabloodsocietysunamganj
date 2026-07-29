"use client";

import { useRouter } from "next/navigation";
import { BLOOD_GROUPS, BLOOD_GROUP_COLORS } from "@/data/constants";
import type { Lang } from "@/lib/i18n";

// Interactive clickable blood group grid — quick search
export default function BloodGroupFinder({ lang }: { lang: Lang }) {
  const router = useRouter();
  const en = lang === "en";

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      {BLOOD_GROUPS.map((g, i) => (
        <button
          key={g}
          onClick={() => router.push(`/donors?group=${g}`)}
          className="group flex flex-col items-center gap-1.5 rounded-2xl border border-zinc-100 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-base font-bold ring-1 transition-transform duration-300 group-hover:scale-110 ${BLOOD_GROUP_COLORS[g]}`}>
            {g}
          </span>
          <span className="text-[10px] font-medium text-ink/50">
            {en ? "Find" : "খুঁজুন"}
          </span>
        </button>
      ))}
    </div>
  );
}
