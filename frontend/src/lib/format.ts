// =============================================================
//  বাংলা সংখ্যা / তারিখ / ফোন ফরম্যাট হেল্পার
// =============================================================

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** ইংরেজি সংখ্যা → বাংলা সংখ্যা (যেমন 25 → "২৫") */
export function bn(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/** তারিখ → বাংলা লং ফরম্যাট (যেমন "২৪ সেপ্টেম্বর ২০২৬") */
export function bnDate(d: Date | string): string {
  try {
    return new Date(d).toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return String(d);
  }
}

/** ফোন নম্বর → tel: লিংকের জন্য পরিষ্কার ("0821-717055" → "0821717055") */
export function telHref(p: string): string {
  return p.replace(/[^0-9+]/g, "");
}
