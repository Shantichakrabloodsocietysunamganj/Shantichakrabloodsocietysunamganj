// =============================================================
//  রক্তদান eligibility — SINGLE source of truth (Phase 2)
//
//  Central business rule: a donor is eligible 90 days (3 months) after
//  their last donation. The same rule applies to all donors (no separate
//  male/female rule is enforced — keep this single constant as the source
//  of truth so every surface stays consistent).
//
//  All math is done on CALENDAR dates ("YYYY-MM-DD"), not `Date` objects,
//  so results never drift around the Bangladesh (UTC+6) midnight boundary.
// =============================================================

import { addDaysToDateOnly, diffDays, todayDateOnly, fmtDateOnly } from "@/lib/date";

export const ELIGIBLE_DAYS = 90;

export type Eligibility = {
  eligible: boolean;
  daysRemaining: number;
  nextEligibleDate: string | null; // "YYYY-MM-DD"
  nextEligibleText: string;
};

/**
 * Compute eligibility from a donor's last donation date.
 * `lastDonationDate` is a "YYYY-MM-DD" date-only value (or null = never donated).
 */
export function getEligibility(
  lastDonationDate: string | null | undefined,
  now: Date = new Date(),
): Eligibility {
  if (!lastDonationDate) {
    return { eligible: true, daysRemaining: 0, nextEligibleDate: null, nextEligibleText: "" };
  }
  const next = addDaysToDateOnly(lastDonationDate, ELIGIBLE_DAYS);
  const today = todayDateOnly(now);
  const remaining = diffDays(today, next); // positive if next is still ahead
  const eligible = remaining <= 0;
  const nextEligibleText = fmtDateOnly(next, "bn-BD", { day: "numeric", month: "short", year: "numeric" });
  return {
    eligible,
    daysRemaining: eligible ? 0 : remaining,
    nextEligibleDate: next,
    nextEligibleText,
  };
}

export type DonorStatus = {
  label: string;
  color: string;
  dot: string;
};

/** প্রভাবী availability — is_available ও eligibility উভয় বিবেচনা করে। */
export function getDonorStatus(
  isAvailable: boolean,
  lastDonationDate: string | null | undefined,
  en = false,
): DonorStatus {
  const elig = getEligibility(lastDonationDate);
  if (!isAvailable) {
    return {
      label: en ? "Unavailable" : "এই মুহূর্তে অনুপস্থিত",
      color: "text-zinc-400",
      dot: "bg-zinc-300",
    };
  }
  if (elig.eligible) {
    return {
      label: en ? "Available to donate" : "রক্তদানে প্রস্তুত",
      color: "text-emerald-600",
      dot: "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]",
    };
  }
  const bnDays = elig.daysRemaining.toLocaleString("bn-BD");
  return {
    label: en ? `Ready in ${elig.daysRemaining} days` : `আর ${bnDays} দিন পর প্রস্তুত`,
    color: "text-amber-600",
    dot: "bg-amber-500",
  };
}

/** True if a given "YYYY-MM-DD" donation date is in the future (data sanity check). */
export function isFutureDonationDate(lastDonationDate: string | null | undefined, now: Date = new Date()): boolean {
  if (!lastDonationDate) return false;
  return lastDonationDate > todayDateOnly(now);
}
