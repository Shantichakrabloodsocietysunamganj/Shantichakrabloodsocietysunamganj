// =============================================================
//  Bilingual (Bangla/English) — translation dictionary + helpers
//  Client-safe (no next/headers). Server-only getLang lives in i18n-server.ts
// =============================================================

export type Lang = "bn" | "en";

export const DICT: Record<string, { bn: string; en: string }> = {
  // Nav
  "nav.home": { bn: "হোম", en: "Home" },
  "nav.donors": { bn: "রক্তদাতা", en: "Donors" },
  "nav.needBlood": { bn: "রক্ত লাগবে?", en: "Need Blood?" },
  "nav.urgent": { bn: "জরুরি", en: "Urgent" },
  "nav.gallery": { bn: "গ্যালারি", en: "Gallery" },
  "nav.blog": { bn: "ব্লগ", en: "Blog" },
  "nav.about": { bn: "আমাদের সম্পর্কে", en: "About" },
  "nav.contact": { bn: "যোগাযোগ", en: "Contact" },
  "nav.impact": { bn: "আমাদের অর্জন", en: "Our Impact" },
  "nav.media": { bn: "মিডিয়া", en: "Media" },
  "nav.events": { bn: "কর্মসূচি", en: "Events" },
  "nav.donate": { bn: "সহযোগিতা", en: "Support" },
  "nav.eligibility": { bn: "যোগ্যতা যাচাই", en: "Eligibility Check" },
  "nav.emergency": { bn: "জরুরি নম্বর", en: "Emergency Contacts" },
  "nav.login": { bn: "লগইন", en: "Login" },
  "nav.register": { bn: "অ্যাকাউন্ট তৈরি", en: "Register" },
  "nav.becomeDonor": { bn: "রক্তদাতা হোন", en: "Become Donor" },
  "nav.logout": { bn: "লগআউট", en: "Logout" },
  "nav.dashboard": { bn: "ড্যাশবোর্ড", en: "Dashboard" },
  "nav.admin": { bn: "অ্যাডমিন", en: "Admin" },
  "nav.subtype": { bn: "ব্লাড সোসাইটি", en: "Blood Society" },

  // Hero
  "hero.badge": { bn: "সিলেট বিভাগ জুড়ে স্বেচ্ছাসেবী রক্তদান নেটওয়ার্ক", en: "Voluntary blood donation network across Sylhet" },
  "hero.title1": { bn: "প্রতিটি ফোঁটা রক্তে", en: "In every drop of blood" },
  "hero.title2": { bn: "লুকিয়ে আছে একটি জীবন", en: "lies a saved life" },
  "hero.desc": { bn: "জরুরি মুহূর্তে সঠিক রক্তদাতা খুঁজে পাওয়া কঠিন। শান্তিচক্র ব্লাড সোসাইটি সিলেট বিভাগের নিবন্ধিত রক্তদাতাদের এক ছাদে এনে রক্তের অভাবে যেন কেউ প্রাণ হারায় না — তা নিশ্চিত করছে।", en: "Finding the right donor in an emergency is hard. Shantichakra Blood Society unites registered donors across Sylhet so no one loses a life for lack of blood." },
  "hero.selectGroup": { bn: "রক্তের গ্রুপ বেছে নিন", en: "Select blood group" },
  "hero.findDonors": { bn: "রক্তদাতা খুঁজুন", en: "Find Donors" },
  "hero.emergency": { bn: "🚨 জরুরি রক্তের অনুরোধ", en: "🚨 Emergency Blood Request" },
  "hero.join": { bn: "রক্তদাতা হিসেবে যুক্ত হোন →", en: "Join as a Donor →" },
  "hero.donors": { bn: "নিবন্ধিত দাতা", en: "Registered Donors" },
  "hero.requests": { bn: "চলমান অনুরোধ", en: "Active Requests" },
  "hero.urgentNow": { bn: "এই মুহূর্তে জরুরি", en: "Urgent Right Now" },
  "hero.urgentCount": { bn: "টি অনুরোধ", en: "requests" },
  "hero.urgentSub": { bn: "আপনার একটি সিদ্ধান্ত একটি পরিবারকে বাঁচাতে পারে", en: "Your one decision can save a family" },

  // Home sections
  "home.stats.donors": { bn: "নিবন্ধিত রক্তদাতা", en: "Registered Donors" },
  "home.stats.requests": { bn: "চলমান অনুরোধ", en: "Active Requests" },
  "home.stats.lives": { bn: "বাঁচানো জীবন", en: "Lives Saved" },
  "home.stats.upazilas": { bn: "উপজেলা কভারেজ", en: "Upazilas Covered" },
  "home.how.eyebrow": { bn: "কীভাবে কাজ করে", en: "How it works" },
  "home.how.title": { bn: "মাত্র ৩ ধাপে একটি জীবন বাঁচান", en: "Save a life in 3 simple steps" },
  "home.how.sub": { bn: "সহজ, দ্রুত এবং সম্পূর্ণ স্বেচ্ছাসেবী — কোনো মধ্যস্বত্বভোগী নেই।", en: "Simple, fast and fully voluntary — no middlemen." },
  "home.step1": { bn: "রক্তদাতা নিবন্ধন", en: "Register as Donor" },
  "home.step1d": { bn: "নাম, গ্রুপ ও এলাকা দিয়ে নিবন্ধন করুন। দাতা নেটওয়ার্কে যুক্ত হবেন।", en: "Register with your name, group and area. Join the donor network." },
  "home.step2": { bn: "রক্তের অনুরোধ", en: "Request Blood" },
  "home.step2d": { bn: "জরুরি প্রয়োজনে রোগীর তথ্য দিয়ে অনুরোধ পোস্ট করুন।", en: "Post a request with patient details in an emergency." },
  "home.step3": { bn: "সরাসরি যোগাযোগ", en: "Contact Directly" },
  "home.step3d": { bn: "সঠিক গ্রুপের দাতা খুঁজে সরাসরি কল করুন।", en: "Find the right group donor and call directly." },
  "home.register": { bn: "নিবন্ধন করুন", en: "Register" },
  "home.request": { bn: "অনুরোধ করুন", en: "Request" },
  "home.find": { bn: "দাতা খুঁজুন", en: "Find Donor" },
  "home.donors.eyebrow": { bn: "আমাদের নায়করা", en: "Our Heroes" },
  "home.donors.title": { bn: "নিবন্ধিত রক্তদাতা", en: "Registered Donors" },
  "home.donors.sub": { bn: "যারা নিজের রক্ত দিয়ে অচেনা মানুষের জীবন বাঁচাচ্ছেন।", en: "Those saving strangers' lives with their own blood." },
  "home.viewAll": { bn: "সব দাতা দেখুন →", en: "View all donors →" },
  "home.cta.title": { bn: "আজই একটি জীবন বাঁচানোর অংশীদার হোন", en: "Be part of saving a life today" },
  "home.cta.sub": { bn: "আপনার এক ইউনিট রক্ত তিনটি জীবন বাঁচাতে পারে।", en: "One unit of your blood can save three lives." },
  "home.cta.btn": { bn: "রক্তদাতা হিসেবে নিবন্ধন করুন", en: "Register as a Donor" },

  // Footer
  "footer.quickLinks": { bn: "দ্রুত লিংক", en: "Quick Links" },
  "footer.more": { bn: "আরও", en: "More" },
  "footer.contact": { bn: "যোগাযোগ", en: "Contact" },
  "footer.join": { bn: "আমাদের গ্রুপে যোগ দিন →", en: "Join our group →" },
  "footer.rights": { bn: "সর্বস্বত্ব সংরক্ষিত।", en: "All rights reserved." },

  // About page
  "about.eyebrow": { bn: "আমাদের গল্প", en: "Our Story" },
  "about.mission": { bn: "আমাদের লক্ষ্য", en: "Our Mission" },
  "about.vision": { bn: "আমাদের স্বপ্ন", en: "Our Vision" },
  "about.values.eyebrow": { bn: "মূল্যবোধ", en: "Core Values" },
  "about.values.title": { bn: "যে নীতিতে আমরা চলি", en: "Principles We Follow" },
  "about.team.eyebrow": { bn: "নেতৃত্ব", en: "Leadership" },
  "about.team.title": { bn: "আমাদের পরিবার", en: "Our Family" },
  "about.team.sub": { bn: "এই মানবিক উদ্যোগের পেছনে যারা আছেন।", en: "Those behind this humanitarian initiative." },
  "about.founders": { bn: "প্রতিষ্ঠাতা", en: "Founders" },
  "about.advisors": { bn: "উপদেষ্টা", en: "Advisors" },
  "about.committee": { bn: "কার্যনির্বাহী কমিটি ও স্বেচ্ছাসেবক", en: "Executive Committee & Volunteers" },
  "about.join": { bn: "যুক্ত হোন", en: "Get Involved" },
  "about.ctaTitle": { bn: "একসাথে একটি পরিবর্তন গড়ি", en: "Let's Build Change Together" },
  "about.ctaSub": { bn: "আপনার সহযোগিতা ছাড়া এই উদ্যোগ অসম্পূর্ণ। আজই রক্তদাতা হিসেবে যুক্ত হোন।", en: "This initiative is incomplete without you. Join as a donor today." },

  // Donors search page
  "donors.title": { bn: "রক্তদাতা খুঁজুন", en: "Find Blood Donors" },
  "donors.desc": { bn: "গ্রুপ ও এলাকা দিয়ে সিলেট বিভাগের নিবন্ধিত রক্তদাতা খুঁজে বের করুন।", en: "Search registered donors across Sylhet by group and area." },
  "donors.group": { bn: "রক্তের গ্রুপ", en: "Blood Group" },
  "donors.district": { bn: "জেলা", en: "District" },
  "donors.upazila": { bn: "উপজেলা", en: "Upazila" },
  "donors.allGroups": { bn: "সব গ্রুপ", en: "All Groups" },
  "donors.allDistricts": { bn: "সব জেলা", en: "All Districts" },
  "donors.allUpazilas": { bn: "সব উপজেলা", en: "All Upazilas" },
  "donors.search": { bn: "নাম / এলাকা / ফোন", en: "Name / Area / Phone" },
  "donors.available": { bn: "শুধু প্রস্তুত দাতা", en: "Available Only" },
  "donors.verified": { bn: "শুধু ভেরিফায়েড ✓ দাতা", en: "Verified ✓ Only" },
  "donors.clearFilters": { bn: "ফিল্টার মুছুন", en: "Clear Filters" },

  // Requests page
  "requests.title": { bn: "জরুরি রক্তের অনুরোধ", en: "Emergency Blood Requests" },
  "requests.desc": { bn: "সিলেট বিভাগ জুড়ে সাহায্যের অপেক্ষায় থাকা রোগীদের তালিকা।", en: "Patients waiting for help across Sylhet." },
  "requests.new": { bn: "+ নতুন অনুরোধ", en: "+ New Request" },
};

export function t(key: string, lang: Lang): string {
  return DICT[key]?.[lang] ?? key;
}

// Client-side lang reader (cookie-based)
export function useLangClient(): Lang {
  if (typeof document !== "undefined") {
    const m = document.cookie.match(/lang=(\w+)/);
    return m && m[1] === "en" ? "en" : "bn";
  }
  return "bn";
}
