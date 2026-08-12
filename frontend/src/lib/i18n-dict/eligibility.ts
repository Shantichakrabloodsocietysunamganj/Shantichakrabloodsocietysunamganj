// =============================================================
//  Bangla → English: eligibility checker + AI assistant chips
// =============================================================

export const ELIGIBILITY: Record<string, string> = {
  // Health questions
  "এই মুহূর্তে কি জ্বর, সর্দি-কাশি বা কোনো সংক্রমণ আছে?":
    "Do you currently have a fever, a cold/cough or any infection?",
  "সম্পূর্ণ সুস্থ হওয়ার পর রক্ত দিন।": "Donate once you have fully recovered.",
  "গত ৭২ ঘণ্টায় কি দাঁত তোলা বা কোনো ডেন্টাল সার্জারি হয়েছে?":
    "Have you had a tooth extraction or dental surgery in the last 72 hours?",
  "ছোটখাটো ডেন্টাল চিকিৎসার কয়েক দিন পর রক্ত দেওয়া যায়।":
    "You can donate a few days after minor dental treatment.",
  "আপনি কি গর্ভবতী অথবা বুকের দুধ পান করছেন?":
    "Are you pregnant or breastfeeding?",
  "গর্ভাবস্থায় ও স্তন্যদানকালে রক্তদান নিরাপদ নয় — পরে আবার চেষ্টা করুন।":
    "Donating is not safe during pregnancy or breastfeeding — please try again later.",
  "গত ৬ মাসে কি বড় শল্যচিকিৎসা হয়েছে বা রক্ত/রক্তের উপাদান গ্রহণ করেছেন?":
    "In the last 6 months have you had major surgery or received blood or blood products?",
  "ঘটনার অন্তত ৬ মাস পর চিকিৎসকের পরামর্শে রক্ত দিন।":
    "Donate at least 6 months afterwards, on your doctor's advice.",
  "গত ৬ মাসে কি ট্যাটু, বডি পিয়ার্সিং করেছেন বা ব্যবহৃত সুই/সিরিঞ্জ শরীরে লেগেছে?":
    "In the last 6 months have you had a tattoo or body piercing, or been exposed to a used needle/syringe?",
  "ঘটনার অন্তত ৬ মাস পর রক্তদান করা যাবে।":
    "You may donate at least 6 months after that.",
  "হৃদরোগ, চিকিৎসাধীন উচ্চ রক্তচাপ, ডায়াবেটিস, কিডনি-লিভারের দীর্ঘস্থায়ী রোগ, হেপাটাইটিস বি/সি, এইচআইভি বা ক্যান্সারের ইতিহাস আছে কি?":
    "Do you have a history of heart disease, treated high blood pressure, diabetes, chronic kidney or liver disease, hepatitis B/C, HIV or cancer?",
  "এই অবস্থাগুলো থাকলে চিকিৎসকের সুনির্দিষ্ট পরামর্শ ছাড়া রক্তদান করবেন না — অনেক ক্ষেত্রে এটি স্থায়ীভাবে নিষেধ।":
    "With these conditions do not donate without specific medical advice — in many cases it is permanently disallowed.",
  "এই মুহূর্তে কি নিয়মিত কোনো ঔষধ (অ্যান্টিবায়োটিকসহ) সেবন করছেন?":
    "Are you currently taking any regular medication (including antibiotics)?",
  "রক্তদানের দিন ঔষধের নাম টেকনিশিয়ান/চিকিৎসককে অবশ্যই জানাবেন।":
    "Be sure to tell the technician or doctor the names of your medicines on donation day.",

  // Verdicts
  "রক্তদানের ন্যূনতম বয়স ১৮ বছর। আগ্রহের জন্য অসংখ্য ধন্যবাদ — ১৮ পূর্ণ হলে আবার আসুন!":
    "The minimum age for donating is 18. Thank you so much for your interest — come back when you turn 18!",
  "৬৫ বছরের বেশি বয়সে নিয়মিত দাতা হিসেবে চিকিৎসকের পরামর্শে রক্তদান করা যেতে পারে।":
    "Over the age of 65 you may donate as a regular donor on your doctor's advice.",
  "সাময়িক কারণে এই মুহূর্তে রক্তদানে বিরত থাকুন।":
    "For temporary reasons, please hold off donating right now.",
  "৪ মাস (১২০ দিন)": "4 months (120 days)",
  "৩ মাস (৯০ দিন)": "3 months (90 days)",
  "শেষ রক্তদানের নিরাপদ ব্যবধান পূর্ণ হয়েছে। ✓":
    "The safe interval since your last donation is complete. ✓",
  "🎉 অভিনন্দন! আপনি রক্তদানের যোগ্য": "🎉 Congratulations! You are eligible to donate",
  "⏳ একটু অপেক্ষা করুন — তারিখ ঠিক আছে": "⏳ Please wait a little — the date is fine",
  "⏳ এই মুহূর্তে একটু অপেক্ষা করুন": "⏳ Please wait a little for now",
  "👨‍⚕️ আগে চিকিৎসকের পরামর্শ নিন": "👨‍⚕️ Please consult a doctor first",
  "💛 এখন সম্ভব নয়, তবে আপনার ইচ্ছাটাই অনুপ্রেরণা":
    "💛 Not possible right now, but your willingness is inspiring",
  "আপনি আবার রক্ত দিতে পারবেন": "You can donate again on",
  "আর মাত্র": "Only",
  "দিন বাকি ⏳": "days to go ⏳",

  // Tips
  "🩸 রক্তদানের আগে মনে রাখুন:": "🩸 Before donating, remember:",
  "আগের রাতে পর্যাপ্ত ঘুম ও হালকা বেলা খাবার খান":
    "Sleep well the night before and eat a light meal",
  "পর্যাপ্ত পানি পান করুন, খালি পেটে যাবেন না":
    "Drink plenty of water and never go on an empty stomach",
  "পরিচয়পত্র (জাতীয় পরিচয়পত্র/বহনযোগ্য আইডি) সঙ্গে রাখুন":
    "Carry an ID (national ID card or other photo ID)",
  "রক্তদাতা হিসেবে নিবন্ধন করুন →": "Register as a donor →",
  "দাতারা যেমন করছেন দেখুন": "See what other donors are doing",
  "এখনই নিবন্ধন করে রাখুন →": "Register now →",
  "↻ আবার যাচাই করুন": "↻ Check again",
  "⚠️ এই যাচাই সাধারণ নির্দেশিকার ভিত্তিতে তৈরি — চূড়ান্ত সিদ্ধান্ত রক্তদান কেন্দ্রের চিকিৎসক/টেকনিশিয়ান নেবেন।":
    "⚠️ This check follows general guidance — the final decision rests with the doctor or technician at the donation centre.",

  // Form steps
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "মৌলিক তথ্য": "Basic details",
  "আপনার বয়স (বছর) *": "Your age (years) *",
  "যেমন: ২৫": "e.g. 25",
  "ওজন (কেজি) *": "Weight (kg) *",
  "যেমন: ৫২": "e.g. 52",
  "লিঙ্গ *": "Gender *",
  "(রক্তদানের নিরাপদ ব্যবধান নির্ভর করে)":
    "(the safe donation interval depends on this)",
  "পুরুষ": "Male",
  "নারী": "Female",
  "অন্যান্য": "Other",
  "আগে রক্ত দিয়েছেন?": "Have you donated before?",
  "না, এটাই প্রথম 😊": "No, this is my first time 😊",
  "হ্যাঁ, দিয়েছি": "Yes, I have",
  "সর্বশেষ রক্তদানের তারিখ *": "Date of your last donation *",
  "স্বাস্থ্য সংক্রান্ত কয়েকটি প্রশ্ন": "A few health questions",
  "হ্যাঁ": "Yes",
  "না": "No",
  "🔍 ফলাফল দেখুন": "🔍 See the result",
  "👆 সবগুলো প্রশ্নের উত্তর দিন": "👆 Please answer every question",
  "🔒 আপনার কোনো তথ্য সার্ভারে পাঠানো হয় না — হিসাবটা আপনার ব্রাউজারেই হয়।":
    "🔒 None of your data is sent to a server — everything is calculated in your browser.",

  // AI assistant quick-reply chips
  "🔎 দাতা খুঁজুন": "🔎 Find donors",
  "📞 যোগাযোগ": "📞 Contact",
  "🩸 রক্তদাতা হব": "🩸 I want to donate",
  "📊 আমাদের অর্জন": "📊 Our impact",
  "🚨 রক্ত লাগবে": "🚨 I need blood",
  "🩸 রক্ত লাগবে": "🩸 I need blood",
  "🔊 শান্তির ভয়েস": "🔊 Shanti's voice",
  "📰 মিডিয়া": "📰 Media",
  "📅 কর্মসূচি": "📅 Events",
  "🙋 স্বেচ্ছাসেবক": "🙋 Volunteer",
};
