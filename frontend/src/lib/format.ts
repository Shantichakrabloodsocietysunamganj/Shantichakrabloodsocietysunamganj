// =============================================================
//  বাংলা সংখ্যা / তারিখ / ফোন ফরম্যাট হেল্পার
//  Number / date / phone formatting helpers (Bangla + English)
// =============================================================

import type { Lang } from "@/lib/i18n";

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** ইংরেজি সংখ্যা → বাংলা সংখ্যা (যেমন 25 → "২৫") */
export function bn(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/**
 * Locale-aware digits: Bangla numerals in Bangla, plain digits in
 * English. Use this instead of `bn()` wherever a language is known.
 */
export function num(n: number | string, lang: Lang = "bn"): string {
  return lang === "en" ? String(n) : bn(n);
}

/** The Intl locale that matches the selected UI language. */
export function localeOf(lang: Lang = "bn"): string {
  return lang === "en" ? "en-GB" : "bn-BD";
}

/** তারিখ → বাংলা লং ফরম্যাট (যেমন "২৪ সেপ্টেম্বর ২০২৬") */
export function bnDate(d: Date | string, lang: Lang = "bn"): string {
  return fmtDate(d, lang, { day: "numeric", month: "long", year: "numeric" });
}

/** Short date, e.g. "২৪ সেপ্ট ২০২৬" / "24 Sep 2026". */
export function shortDate(d: Date | string, lang: Lang = "bn"): string {
  return fmtDate(d, lang, { day: "numeric", month: "short", year: "numeric" });
}

/** Format a date in the current UI language, falling back to the raw value. */
export function fmtDate(
  d: Date | string,
  lang: Lang = "bn",
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
): string {
  try {
    return new Date(d).toLocaleDateString(localeOf(lang), opts);
  } catch {
    return String(d);
  }
}

/** ফোন নম্বর → tel: লিংকের জন্য পরিষ্কার ("0821-717055" → "0821717055") */
export function telHref(p: string): string {
  return p.replace(/[^0-9+]/g, "");
}
