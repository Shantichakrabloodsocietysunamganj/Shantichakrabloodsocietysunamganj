// রক্তদান eligibility হিসাব — শেষ দানের ৯০ দিন (৩ মাস) পর প্রস্তুত
export const ELIGIBLE_DAYS = 90;

export type Eligibility = {
  eligible: boolean;
  daysRemaining: number;
  nextEligibleDate: Date | null;
  nextEligibleText: string;
};

export function getEligibility(lastDonationDate: string | null, en = false): Eligibility {
  if (!lastDonationDate) {
    return { eligible: true, daysRemaining: 0, nextEligibleDate: null, nextEligibleText: "" };
  }
  const last = new Date(lastDonationDate);
  const next = new Date(last.getTime() + ELIGIBLE_DAYS * 24 * 3600 * 1000);
  const now = new Date();
  const eligible = next <= now;
  const daysRemaining = eligible ? 0 : Math.ceil((next.getTime() - now.getTime()) / (24 * 3600 * 1000));
  const nextEligibleText = next.toLocaleDateString(en ? "en-US" : "bn-BD", { day: "numeric", month: "short", year: "numeric" });
  return { eligible, daysRemaining, nextEligibleDate: next, nextEligibleText };
}

// প্রভাবী availability — is_available ও eligibility উভয় বিবেচনা করে
export function getDonorStatus(
  isAvailable: boolean,
  lastDonationDate: string | null,
  en = false,
): { label: string; color: string; dot: string } {
  const elig = getEligibility(lastDonationDate, en);
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
  // eligible নয় — দিন বাকি
  const bnDays = elig.daysRemaining.toLocaleString("bn-BD");
  return {
    label: en ? `Ready in ${elig.daysRemaining} days` : `আর ${bnDays} দিন পর প্রস্তুত`,
    color: "text-amber-600",
    dot: "bg-amber-500",
  };
}
