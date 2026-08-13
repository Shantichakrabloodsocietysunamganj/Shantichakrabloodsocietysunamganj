// =============================================================
//  বাংলাদেশি ফোন নম্বর হেল্পার — central utility (Phase 2)
//  normalizeBdPhone() / toBdE164() / toWhatsAppNumber() / isValidBdPhone()
//
//  Supported inputs:
//    017XXXXXXXX
//    +88017XXXXXXXX
//    88017XXXXXXXX
//    017XX-XXXXXX  (dash/space/paren)
//    বাংলা digit সহ input (০১২৩...)
// =============================================================

const BN_TO_EN: Record<string, string> = {
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
  "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
};

/** বাংলা সংখ্যা → ইংরেজি সংখ্যা */
export function normalizeBdDigits(input: string): string {
  return String(input ?? "").replace(/[০-৯]/g, (d) => BN_TO_EN[d] ?? d);
}

/**
 * Canonical Bangladeshi mobile number in LOCAL format:
 *   "01XXXXXXXXX"  (11 digits, leading 0 + subscriber starting with 1)
 * Returns `null` if the input cannot be a valid BD mobile number.
 */
export function normalizeBdPhone(input: string | null | undefined): string | null {
  if (input == null) return null;
  let s = normalizeBdDigits(String(input));
  s = s.replace(/[^\d+]/g, ""); // strip spaces, dashes, parens
  if (!s) return null;
  s = s.replace(/^\+/, "");
  // drop the international country code if present
  s = s.replace(/^880/, "");
  // drop a leading 0 (local-dialing prefix)
  s = s.replace(/^0(?=1\d{9}$)/, "");
  if (!/^1\d{9}$/.test(s)) return null;
  return "0" + s;
}

/** E.164 international format: "+8801XXXXXXXXX" (or `null`). */
export function toBdE164(input: string | null | undefined): string | null {
  const local = normalizeBdPhone(input);
  return local ? "+880" + local.slice(1) : null;
}

/** Digits for wa.me links: "8801XXXXXXXXX" (12 digits, no "+", no leading 0). */
export function toWhatsAppNumber(input: string | null | undefined): string | null {
  const local = normalizeBdPhone(input);
  return local ? "880" + local.slice(1) : null;
}

/** Quick validity check for a BD mobile number. */
export function isValidBdPhone(input: string | null | undefined): boolean {
  return normalizeBdPhone(input) !== null;
}
