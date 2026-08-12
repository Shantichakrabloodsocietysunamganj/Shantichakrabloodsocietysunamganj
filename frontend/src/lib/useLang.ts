"use client";

import { useCallback, useMemo } from "react";
import type { Lang } from "@/lib/i18n";
import { tr as translate } from "@/lib/i18n";
import { useLangContext } from "@/components/LanguageProvider";

/**
 * Client-side language hook.
 *
 * The value comes from <LanguageProvider>, which the root layout
 * seeds with the `lang` cookie read on the server. That means client
 * components render in the correct language on the first paint —
 * no Bangla flash and no hydration mismatch.
 */
export function useLang(): Lang {
  return useLangContext();
}

/**
 * Returns a `t` helper bound to the current language, so components
 * can write `t("বাংলা লেখা")` without passing `lang` around.
 *
 *   const { t, en } = useTr();
 *   <h1>{t("কোনো পোস্ট নেই।")}</h1>
 *
 * `t` keeps a stable identity for as long as the language does, so it
 * is safe to list in `useMemo`/`useEffect` dependency arrays.
 */
export function useTr(): { lang: Lang; en: boolean; t: (text: string) => string } {
  const lang = useLangContext();
  const t = useCallback((text: string) => translate(text, lang), [lang]);
  return useMemo(() => ({ lang, en: lang === "en", t }), [lang, t]);
}
