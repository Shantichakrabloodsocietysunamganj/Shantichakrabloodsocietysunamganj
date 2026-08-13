// =============================================================
//  Central date/time helper — Asia/Dhaka aware (Phase 2)
//
//  Project convention:
//   • date-only columns (needed_date, last_donation_date, event_date …)
//     are stored as "YYYY-MM-DD" and must be treated as CALENDAR dates,
//     never parsed with `new Date("YYYY-MM-DD")` (which reads them as
//     UTC midnight and shifts a day near the Bangladesh midnight boundary).
//   • Display formatting always uses the Asia/Dhaka timezone.
// =============================================================

export const DHAKA_TIME_ZONE = "Asia/Dhaka";

export type DateParts = { y: number; m: number; d: number };

/** Parse "YYYY-MM-DD" (or a full ISO timestamp) into calendar parts — TZ safe. */
export function parseDateOnly(value: string | null | undefined): DateParts | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, m: mo, d };
}

/** Today's date in Asia/Dhaka as "YYYY-MM-DD". */
export function todayDateOnly(now: Date = new Date()): string {
  return dateToDateOnly(now);
}

/** Convert a Date to "YYYY-MM-DD" in Asia/Dhaka. */
export function dateToDateOnly(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: DHAKA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return parts; // en-CA yields "YYYY-MM-DD"
}

/** Add N days to a "YYYY-MM-DD" date, returning "YYYY-MM-DD". Pure calendar math. */
export function addDaysToDateOnly(value: string, days: number): string {
  const p = parseDateOnly(value);
  if (!p) return value;
  const date = new Date(Date.UTC(p.y, p.m - 1, p.d));
  date.setUTCDate(date.getUTCDate() + days);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Whole calendar days from `from` to `to` (positive if `to` is after `from`).
 * Both args are "YYYY-MM-DD".
 */
export function diffDays(from: string, to: string): number {
  const a = parseDateOnly(from);
  const b = parseDateOnly(to);
  if (!a || !b) return 0;
  const ta = Date.UTC(a.y, a.m - 1, a.d);
  const tb = Date.UTC(b.y, b.m - 1, b.d);
  return Math.round((tb - ta) / 86400000);
}

/** True if `value` (date-only) is strictly in the past relative to Dhaka today. */
export function isPastDateOnly(value: string, now: Date = new Date()): boolean {
  const p = parseDateOnly(value);
  if (!p) return false;
  return value < todayDateOnly(now);
}

/** True if `value` (date-only) is today or earlier in Dhaka. */
export function isTodayOrPast(value: string, now: Date = new Date()): boolean {
  const p = parseDateOnly(value);
  if (!p) return false;
  return value <= todayDateOnly(now);
}

/** Format a Date or date string in Asia/Dhaka using the given locale + options. */
export function fmtDhaka(
  value: Date | string,
  locale: string = "bn-BD",
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
): string {
  try {
    return new Intl.DateTimeFormat(locale, { ...opts, timeZone: DHAKA_TIME_ZONE }).format(
      new Date(value),
    );
  } catch {
    return String(value);
  }
}

/**
 * Format a date-only "YYYY-MM-DD" in Asia/Dhaka WITHOUT shifting a day.
 * (Avoids the UTC-midnight parse bug of `new Date("YYYY-MM-DD")`.)
 */
export function fmtDateOnly(
  value: string | null | undefined,
  locale: string = "bn-BD",
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
): string {
  const p = parseDateOnly(value);
  if (!p) return value ?? "";
  return new Intl.DateTimeFormat(locale, { ...opts, timeZone: "UTC" }).format(
    new Date(Date.UTC(p.y, p.m - 1, p.d)),
  );
}
