// রক্তের গ্রুপ, সামঞ্জস্যতা, এবং সিলেট বিভাগের এলাকার তথ্য

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const GENDERS = ["পুরুষ", "নারী", "অন্যান্য"] as const;

// কে কাকে রক্ত দিতে পারে / কার কাছ থেকে নিতে পারে
export const BLOOD_COMPATIBILITY: Record<
  string,
  { canDonateTo: string[]; canReceiveFrom: string[] }
> = {
  "O-": { canDonateTo: ["সব গ্রুপ (Universal Donor)"], canReceiveFrom: ["O-"] },
  "O+": { canDonateTo: ["O+", "A+", "B+", "AB+"], canReceiveFrom: ["O+", "O-"] },
  "A-": { canDonateTo: ["A+", "A-", "AB+", "AB-"], canReceiveFrom: ["A-", "O-"] },
  "A+": { canDonateTo: ["A+", "AB+"], canReceiveFrom: ["A+", "A-", "O+", "O-"] },
  "B-": { canDonateTo: ["B+", "B-", "AB+", "AB-"], canReceiveFrom: ["B-", "O-"] },
  "B+": { canDonateTo: ["B+", "AB+"], canReceiveFrom: ["B+", "B-", "O+", "O-"] },
  "AB-": { canDonateTo: ["AB+", "AB-"], canReceiveFrom: ["AB-", "A-", "B-", "O-"] },
  "AB+": { canDonateTo: ["AB+ (Universal Recipient)"], canReceiveFrom: ["সব গ্রুপ"] },
};

// গ্রুপ অনুযায়ী রঙ
export const BLOOD_GROUP_COLORS: Record<string, string> = {
  "O-": "bg-amber-100 text-amber-800 ring-amber-200",
  "O+": "bg-emerald-100 text-emerald-800 ring-emerald-200",
  "A-": "bg-sky-100 text-sky-800 ring-sky-200",
  "A+": "bg-violet-100 text-violet-800 ring-violet-200",
  "B-": "bg-rose-100 text-rose-800 ring-rose-200",
  "B+": "bg-blood-100 text-blood-700 ring-blood-200",
  "AB-": "bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-200",
  "AB+": "bg-brand-100 text-brand-700 ring-brand-200",
};

// রক্তের গ্রুপ সম্পর্কে সংক্ষিপ্ত তথ্য
export const BLOOD_GROUP_FACTS: Record<string, string> = {
  "O-": "Universal Donor — যে কাউকে দিতে পারে, বিশেষ করে জরুরি প্রয়োজনে।",
  "O+": "সবচেয়ে সাধারণ গ্রুপ — জনসংখ্যার প্রায় ৩৭%।",
  "A-": "বিরল; A ও AB গ্রুপের রোগীদের কাজে লাগে।",
  "A+": "দ্বিতীয় সর্বাধিক সাধারণ গ্রুপ।",
  "B-": "বিরল; নিয়মিত মজুত রাখা প্রয়োজন।",
  "B+": "দক্ষিণ এশিয়ায় বেশি প্রচলিত।",
  "AB-": "অত্যন্ত বিরল গ্রুপ।",
  "AB+": "Universal Recipient — সব গ্রুপের রক্ত গ্রহণ করতে পারে।",
};

// ===== সিলেট বিভাগ — জেলা ও উপজেলা =====
export const SYLHET_DISTRICTS = [
  {
    name: "সুনামগঞ্জ",
    upazilas: [
      "সুনামগঞ্জ সদর", "ছাতক", "জগন্নাথপুর", "দোয়ারাবাজার", "বিশ্বম্ভরপুর",
      "তাহিরপুর", "জামালগঞ্জ", "দিরাই", "সুল্লা", "ধর্মপাশা", "দক্ষিণ সুনামগঞ্জ",
    ],
  },
  {
    name: "সিলেট",
    upazilas: [
      "সিলেট সদর", "বালাগঞ্জ", "বিয়ানিবাজার", "বোয়ালখালী", "কোম্পানীগঞ্জ",
      "ফেঞ্চুগঞ্জ", "গোলাপগঞ্জ", "গোয়াইনঘাট", "জৈন্তাপুর", "কানাইঘাট",
      "ওসমানীনগর", "দক্ষিণ সুরমা", "জকিগঞ্জ",
    ],
  },
  {
    name: "হবিগঞ্জ",
    upazilas: [
      "হবিগঞ্জ সদর", "আজমিরীগঞ্জ", "বাহুবল", "চুনারুঘাট", "নবীগঞ্জ",
      "বানিয়াচং", "শায়েস্তাগঞ্জ", "মাধবপুর", "লাখাই",
    ],
  },
  {
    name: "মৌলভীবাজার",
    upazilas: [
      "মৌলভীবাজার সদর", "বড়লেখা", "কমলগঞ্জ", "কুলাউড়া", "রাজনগর",
      "শ্রীমঙ্গল", "জুড়ী",
    ],
  },
] as const;

export const DISTRICTS = SYLHET_DISTRICTS.map((d) => d.name);

export function upazilasOf(district: string): readonly string[] {
  return SYLHET_DISTRICTS.find((d) => d.name === district)?.upazilas ?? [];
}

// পুরোনো নামের জন্য alias (backward-compat)
export const SUNAMGANJ_UPAZILAS = SYLHET_DISTRICTS[0].upazilas;
