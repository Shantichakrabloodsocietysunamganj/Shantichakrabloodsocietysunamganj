"use client";

import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import { useTr } from "@/lib/useLang";

// BN/EN ভাষা টগল — cookie সেট করে পেজ রিফ্রেশ করে
export default function LanguageToggle({ lang }: { lang: Lang }) {
  const { t: tx } = useTr();
  const router = useRouter();

  const set = (l: Lang) => {
    document.cookie = `lang=${l};path=/;max-age=31536000;samesite=lax`;
    router.refresh();
  };

  return (
    <div className="inline-flex items-center rounded-lg bg-zinc-100 p-0.5 text-xs font-bold dark:bg-white/10">
      <button
        type="button"
        onClick={() => set("bn")}
        className={`min-h-11 min-w-11 rounded-md px-3 transition ${lang === "bn" ? "bg-white text-brand-700 shadow-sm dark:bg-brand-600 dark:text-white" : "text-ink/60 dark:text-brand-100/60"}`}
        aria-pressed={lang === "bn"}
        aria-label="বাংলা"
      >
        {tx("বাং")}
      </button>
      <button
        type="button"
        onClick={() => set("en")}
        className={`min-h-11 min-w-11 rounded-md px-3 transition ${lang === "en" ? "bg-white text-brand-700 shadow-sm dark:bg-brand-600 dark:text-white" : "text-ink/60 dark:text-brand-100/60"}`}
        aria-pressed={lang === "en"}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
