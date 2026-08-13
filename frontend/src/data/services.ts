// =============================================================
//  Public service catalogue — single source of truth
//  Used by /services, the navbar mega-menu, command palette
//  and the homepage preview so labels never drift.
// =============================================================

import type { Lang } from "@/lib/i18n";

export type ServiceCategory = "emergency" | "donor" | "tools" | "org";

export type ServiceItem = {
  id: string;
  href: string;
  icon: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  category: ServiceCategory;
  keywords: string[];
  featured?: boolean;
  badgeBn?: string;
  badgeEn?: string;
};

export const SERVICE_CATEGORIES: {
  id: ServiceCategory;
  titleBn: string;
  titleEn: string;
  blurbBn: string;
  blurbEn: string;
}[] = [
  {
    id: "emergency",
    titleBn: "জরুরি সাহায্য",
    titleEn: "Emergency help",
    blurbBn: "রক্ত লাগলে এখনই যা করবেন",
    blurbEn: "What to do when blood is needed now",
  },
  {
    id: "donor",
    titleBn: "রক্তদাতা সেবা",
    titleEn: "Donor services",
    blurbBn: "দাতা হোন, যোগ্যতা যাচাই করুন",
    blurbEn: "Become a donor and check eligibility",
  },
  {
    id: "tools",
    titleBn: "স্মার্ট টুলস",
    titleEn: "Smart tools",
    blurbBn: "সামঞ্জস্যতা, ট্র্যাক, SOS ও গাইড",
    blurbEn: "Compatibility, tracking, SOS and guides",
  },
  {
    id: "org",
    titleBn: "সংগঠন",
    titleEn: "The society",
    blurbBn: "আমাদের কাজ, খবর ও যোগাযোগ",
    blurbEn: "Our work, news and contact",
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: "request-blood",
    href: "/request-blood",
    icon: "🚨",
    titleBn: "জরুরি রক্তের অনুরোধ",
    titleEn: "Emergency blood request",
    descBn: "রোগীর তথ্য দিয়ে অনুরোধ পোস্ট করুন — সাথে সাথে দাতাদের কাছে পৌঁছাবে।",
    descEn: "Post a request with patient details — it reaches donors instantly.",
    category: "emergency",
    keywords: ["রক্ত লাগবে", "অনুরোধ", "emergency", "request", "urgent", "জরুরি"],
    featured: true,
    badgeBn: "২৪/৭",
    badgeEn: "24/7",
  },
  {
    id: "donors",
    href: "/donors",
    icon: "🔎",
    titleBn: "রক্তদাতা খুঁজুন",
    titleEn: "Find a blood donor",
    descBn: "গ্রুপ, জেলা ও উপজেলা দিয়ে প্রস্তুত দাতা খুঁজে সরাসরি কল করুন।",
    descEn: "Search ready donors by group, district and upazila, then call directly.",
    category: "emergency",
    keywords: ["দাতা", "সার্চ", "find", "donor", "search", "A+", "O+", "B+"],
    featured: true,
  },
  {
    id: "requests",
    href: "/requests",
    icon: "📋",
    titleBn: "জরুরি অনুরোধ তালিকা",
    titleEn: "Urgent request list",
    descBn: "এই মুহূর্তে সাহায্যের অপেক্ষায় থাকা রোগীদের তালিকা।",
    descEn: "Patients waiting for help right now.",
    category: "emergency",
    keywords: ["তালিকা", "requests", "urgent list"],
  },
  {
    id: "seekers",
    href: "/blood-seekers",
    icon: "🔴",
    titleBn: "লাইভ রক্তপ্রার্থী",
    titleEn: "Live blood seekers",
    descBn: "নতুন অনুরোধ এলে সাথে সাথে দেখুন — কল ও WhatsApp করুন।",
    descEn: "See new requests the moment they arrive — call or WhatsApp.",
    category: "emergency",
    keywords: ["প্রার্থী", "live", "seekers", "realtime"],
    featured: true,
  },
  {
    id: "emergency",
    href: "/emergency",
    icon: "☎️",
    titleBn: "জরুরি ডিরেক্টরি",
    titleEn: "Emergency directory",
    descBn: "৯৯৯, হাসপাতাল, ব্লাড ব্যাংক ও অ্যাম্বুলেন্স — এক ক্লিকে কল।",
    descEn: "999, hospitals, blood banks and ambulances — tap to call.",
    category: "emergency",
    keywords: ["হাসপাতাল", "ব্লাড ব্যাংক", "৯৯৯", "ambulance", "hotline", "hospital"],
    featured: true,
  },
  {
    id: "match",
    href: "/match",
    icon: "🧭",
    titleBn: "দ্রুত সহায়তা উইজার্ড",
    titleEn: "Quick help wizard",
    descBn: "৩টি প্রশ্নে বলুন কী লাগবে — আমরা সঠিক সেবায় নিয়ে যাব।",
    descEn: "Answer 3 questions and we will take you to the right service.",
    category: "emergency",
    keywords: ["উইজার্ড", "wizard", "help", "কী করব", "শুরু"],
    featured: true,
    badgeBn: "নতুন",
    badgeEn: "New",
  },
  {
    id: "track",
    href: "/track",
    icon: "📡",
    titleBn: "অনুরোধ ট্র্যাক করুন",
    titleEn: "Track a request",
    descBn: "রোগীর নাম, হাসপাতাল বা আইডি দিয়ে অনুরোধের স্ট্যাটাস দেখুন।",
    descEn: "Check a request’s status by patient name, hospital or ID.",
    category: "tools",
    keywords: ["ট্র্যাক", "track", "status", "স্ট্যাটাস", "অনুসরণ"],
    featured: true,
    badgeBn: "নতুন",
    badgeEn: "New",
  },
  {
    id: "sos",
    href: "/sos",
    icon: "📣",
    titleBn: "SOS শেয়ার মেসেজ",
    titleEn: "SOS share message",
    descBn: "WhatsApp, SMS ও Facebook-এ পাঠানোর জন্য প্রস্তুত জরুরি বার্তা তৈরি করুন।",
    descEn: "Build a ready emergency message for WhatsApp, SMS and Facebook.",
    category: "tools",
    keywords: ["শেয়ার", "whatsapp", "sms", "facebook", "মেসেজ", "sos"],
    featured: true,
    badgeBn: "নতুন",
    badgeEn: "New",
  },
  {
    id: "compatibility",
    href: "/compatibility",
    icon: "🧬",
    titleBn: "রক্ত সামঞ্জস্যতা",
    titleEn: "Blood compatibility",
    descBn: "আপনার গ্রুপ কাকে দিতে পারে, কার কাছ থেকে নিতে পারে — মুহূর্তে দেখুন।",
    descEn: "See instantly who you can donate to and receive from.",
    category: "tools",
    keywords: ["সামঞ্জস্য", "compatibility", "universal", "O-", "AB+", "মিল"],
    featured: true,
    badgeBn: "নতুন",
    badgeEn: "New",
  },
  {
    id: "guide",
    href: "/guide",
    icon: "📘",
    titleBn: "রক্তদান গাইড",
    titleEn: "Donation guide",
    descBn: "দানের আগে-পরে কী খাবেন, কী এড়াবেন — চেকলিস্ট ও পরবর্তী তারিখ।",
    descEn: "What to eat, what to avoid, a checklist and your next eligible date.",
    category: "donor",
    keywords: ["গাইড", "guide", "চেকলিস্ট", "খাদ্য", "prepare", "aftercare"],
    featured: true,
    badgeBn: "নতুন",
    badgeEn: "New",
  },
  {
    id: "eligibility",
    href: "/eligibility",
    icon: "✅",
    titleBn: "যোগ্যতা যাচাই",
    titleEn: "Eligibility check",
    descBn: "বয়স, ওজন ও স্বাস্থ্য প্রশ্নে জেনে নিন আপনি এখন রক্ত দিতে পারবেন কি না।",
    descEn: "Find out if you can donate now from age, weight and health questions.",
    category: "donor",
    keywords: ["যোগ্যতা", "eligibility", "ক্যান আই", "can i donate"],
    featured: true,
  },
  {
    id: "become-donor",
    href: "/become-donor",
    icon: "🩸",
    titleBn: "রক্তদাতা নিবন্ধন",
    titleEn: "Become a donor",
    descBn: "নাম, গ্রুপ ও এলাকা দিয়ে ফ্রিতে নিবন্ধন — নেটওয়ার্কে যুক্ত হোন।",
    descEn: "Register free with your name, group and area — join the network.",
    category: "donor",
    keywords: ["নিবন্ধন", "register", "become", "দাতা হোন"],
  },
  {
    id: "certificate",
    href: "/certificate",
    icon: "🏅",
    titleBn: "সম্মাননা সনদ",
    titleEn: "Appreciation certificate",
    descBn: "নিবন্ধিত দাতারা তাঁদের রক্তদানের সনদ প্রিন্ট করতে পারেন।",
    descEn: "Registered donors can print a certificate of their donations.",
    category: "donor",
    keywords: ["সার্টিফিকেট", "certificate", "সনদ"],
  },
  {
    id: "volunteer",
    href: "/volunteer",
    icon: "🙋",
    titleBn: "স্বেচ্ছাসেবক হোন",
    titleEn: "Become a volunteer",
    descBn: "শিবির, সমন্বয় ও প্রচারে যুক্ত হয়ে জীবন বাঁচানোর অংশীদার হোন।",
    descEn: "Join camps, coordination and outreach — help save lives.",
    category: "donor",
    keywords: ["স্বেচ্ছাসেবক", "volunteer", "সাহায্য"],
  },
  {
    id: "donate",
    href: "/donate",
    icon: "🤝",
    titleBn: "আর্থিক সহযোগিতা",
    titleEn: "Financial support",
    descBn: "শিবির, গ্রুপ টেস্ট কিট ও প্রচারণায় bKash/Nagad-এ সহযোগিতা করুন।",
    descEn: "Support camps, test kits and campaigns via bKash or Nagad.",
    category: "org",
    keywords: ["ডোনেশন", "donate", "bkash", "nagad", "টাকা"],
  },
  {
    id: "events",
    href: "/events",
    icon: "📅",
    titleBn: "রক্তদান কর্মসূচি",
    titleEn: "Donation events",
    descBn: "আসন্ন শিবির ও কর্মসূচিতে যোগ দিন।",
    descEn: "Join upcoming camps and programmes.",
    category: "org",
    keywords: ["ইভেন্ট", "events", "শিবির", "camp"],
  },
  {
    id: "gallery",
    href: "/gallery",
    icon: "🖼️",
    titleBn: "গ্যালারি",
    titleEn: "Gallery",
    descBn: "শিবির ও কার্যক্রমের মুহূর্তগুলো।",
    descEn: "Moments from our camps and activities.",
    category: "org",
    keywords: ["ছবি", "gallery", "photo"],
  },
  {
    id: "blog",
    href: "/blog",
    icon: "📰",
    titleBn: "ব্লগ ও সচেতনতা",
    titleEn: "Blog & awareness",
    descBn: "রক্তদান, স্বাস্থ্য ও সমিতির খবর পড়ুন।",
    descEn: "Read about donation, health and society news.",
    category: "org",
    keywords: ["ব্লগ", "blog", "খবর", "article"],
  },
  {
    id: "about",
    href: "/about",
    icon: "💙",
    titleBn: "আমাদের সম্পর্কে",
    titleEn: "About us",
    descBn: "মিশন, মূল্যবোধ ও যে পরিবার এই নেটওয়ার্ক চালায়।",
    descEn: "Our mission, values and the people behind the network.",
    category: "org",
    keywords: ["সম্পর্কে", "about", "মিশন"],
  },
  {
    id: "impact",
    href: "/impact",
    icon: "📊",
    titleBn: "আমাদের অর্জন",
    titleEn: "Our impact",
    descBn: "দাতা, বাঁচানো জীবন ও কার্যক্রমের স্বচ্ছ হিসাব।",
    descEn: "A transparent account of donors, lives saved and our work.",
    category: "org",
    keywords: ["অর্জন", "impact", "stats"],
  },
  {
    id: "media",
    href: "/media",
    icon: "📺",
    titleBn: "মিডিয়া কভারেজ",
    titleEn: "Media coverage",
    descBn: "গণমাধ্যমে শান্তিচক্রের খবর।",
    descEn: "Shantichakra in the press.",
    category: "org",
    keywords: ["মিডিয়া", "media", "news"],
  },
  {
    id: "faq",
    href: "/faq",
    icon: "❓",
    titleBn: "সাধারণ প্রশ্ন",
    titleEn: "FAQ",
    descBn: "রক্তদান নিয়ে আপনার সব প্রশ্নের উত্তর।",
    descEn: "Answers to common questions about donating blood.",
    category: "org",
    keywords: ["faq", "প্রশ্ন", "question"],
  },
  {
    id: "contact",
    href: "/contact",
    icon: "📞",
    titleBn: "যোগাযোগ",
    titleEn: "Contact us",
    descBn: "ফোন, ইমেইল বা ফর্ম দিয়ে আমাদের কাছে পৌঁছান।",
    descEn: "Reach us by phone, email or the contact form.",
    category: "org",
    keywords: ["যোগাযোগ", "contact", "phone", "email"],
  },
];

export function serviceTitle(s: ServiceItem, lang: Lang): string {
  return lang === "en" ? s.titleEn : s.titleBn;
}

export function serviceDesc(s: ServiceItem, lang: Lang): string {
  return lang === "en" ? s.descEn : s.descBn;
}

export function serviceBadge(s: ServiceItem, lang: Lang): string | undefined {
  return lang === "en" ? s.badgeEn : s.badgeBn;
}

export function servicesIn(category: ServiceCategory): ServiceItem[] {
  return SERVICES.filter((s) => s.category === category);
}

export function featuredServices(): ServiceItem[] {
  return SERVICES.filter((s) => s.featured);
}

function norm(s: string): string {
  return s.normalize("NFC").toLowerCase().trim();
}

/** Ranked search across titles, descriptions and keywords. */
export function searchServices(query: string): ServiceItem[] {
  const q = norm(query);
  if (!q) return SERVICES;
  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = SERVICES.map((s) => {
    const hay = norm(
      [s.titleBn, s.titleEn, s.descBn, s.descEn, s.href, s.id, ...s.keywords].join(" "),
    );
    let score = 0;
    for (const token of tokens) {
      if (norm(s.titleBn) === token || norm(s.titleEn) === token) score += 8;
      else if (norm(s.titleBn).includes(token) || norm(s.titleEn).includes(token)) score += 5;
      else if (s.keywords.some((k) => norm(k).includes(token))) score += 3;
      else if (hay.includes(token)) score += 1;
      else return { s, score: 0 };
    }
    return { s, score };
  });

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.s);
}
