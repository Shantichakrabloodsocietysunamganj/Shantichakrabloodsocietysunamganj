"use client";

import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";

// BN/EN ভাষা টগল — cookie সেট করে পেজ রিফ্রেশ করে
export default function LanguageToggle({ lang }: { lang: Lang }) {
  const router = useRouter();

  const set = (l: Lang) => {
    document.cookie = `lang=${l};path=/;max-age=31536000;samesite=lax`;
    router.refresh();
  };

  return (
    <div className="inline-flex items-center rounded-lg bg-zinc-100 p-0.5 text-xs font-bold dark:bg-white/10">
      <button
        onClick={() => set("bn")}
        className={`rounded-md px-2 py-1 transition ${lang === "bn" ? "bg-white text-brand-700 shadow-sm dark:bg-brand-600 dark:text-white" : "text-ink/60 dark:text-brand-100/60"}`}
        aria-pressed={lang === "bn"}
      >
        বাং
      </button>
      <button
        onClick={() => set("en")}
        className={`rounded-md px-2 py-1 transition ${lang === "en" ? "bg-white text-brand-700 shadow-sm dark:bg-brand-600 dark:text-white" : "text-ink/60 dark:text-brand-100/60"}`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}
