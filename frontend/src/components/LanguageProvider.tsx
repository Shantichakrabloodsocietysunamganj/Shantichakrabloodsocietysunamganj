"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Lang } from "@/lib/i18n";

const LangCtx = createContext<Lang>("bn");

/**
 * Makes the language chosen on the server (from the `lang` cookie)
 * available to every client component, so admin screens, the
 * dashboard and widgets render in the right language on the very
 * first paint — no Bangla flash and no hydration mismatch.
 */
export default function LanguageProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangCtx.Provider value={lang}>{children}</LangCtx.Provider>;
}

export function useLangContext(): Lang {
  return useContext(LangCtx);
}
