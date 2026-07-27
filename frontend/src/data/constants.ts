// রক্তের গ্রুপ ও সুনামগঞ্জের উপজেলা — সারা সাইটে ব্যবহৃত হবে

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

// কোন গ্রুপ কাকে রক্ত দিতে পারে (রেফারেন্সের জন্য)
export const BLOOD_GROUP_INFO: Record<string, { canDonateTo: string[]; canReceiveFrom: string[] }> = {
  "O-": { canDonateTo: ["সবাইকে (Universal Donor)"], canReceiveFrom: ["O-"] },
  "O+": { canDonateTo: ["O+", "A+", "B+", "AB+"], canReceiveFrom: ["O+", "O-"] },
  "A-": { canDonateTo: ["A-", "A+", "AB-", "AB+"], canReceiveFrom: ["A-", "O-"] },
  "A+": { canDonateTo: ["A+", "AB+"], canReceiveFrom: ["A+", "A-", "O+", "O-"] },
  "B-": { canDonateTo: ["B-", "B+", "AB-", "AB+"], canReceiveFrom: ["B-", "O-"] },
  "B+": { canDonateTo: ["B+", "AB+"], canReceiveFrom: ["B+", "B-", "O+", "O-"] },
  "AB-": { canDonateTo: ["AB-", "AB+"], canReceiveFrom: ["AB-", "A-", "B-", "O-"] },
  "AB+": { canDonateTo: ["AB+ (Universal Recipient)"], canReceiveFrom: ["সব গ্রুপ"] },
};

// সুনামগঞ্জের উপজেলাসমূহ
export const SUNAMGANJ_UPAZILAS = [
  "সুনামগঞ্জ সদর",
  "ছাতক",
  "জগন্নাথপুর",
  "দোয়ারাবাজার",
  "বিশ্বম্ভরপুর",
  "তাহিরপুর",
  "জামালগঞ্জ",
  "দিরাই",
  "সুল্লা",
  "ধর্মপাশা",
  "দক্ষিণ সুনামগঞ্জ",
] as const;

export const GENDERS = ["পুরুষ", "নারী", "অন্যান্য"] as const;

// রক্তের গ্রুপ অনুযায়ী রঙ (ব্যাজের জন্য)
export const BLOOD_GROUP_COLORS: Record<string, string> = {
  "O-": "bg-amber-100 text-amber-800 ring-amber-200",
  "O+": "bg-emerald-100 text-emerald-800 ring-emerald-200",
  "A-": "bg-sky-100 text-sky-800 ring-sky-200",
  "A+": "bg-violet-100 text-violet-800 ring-violet-200",
  "B-": "bg-rose-100 text-rose-800 ring-rose-200",
  "B+": "bg-brand-100 text-brand-800 ring-brand-200",
  "AB-": "bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-200",
  "AB+": "bg-indigo-100 text-indigo-800 ring-indigo-200",
};
