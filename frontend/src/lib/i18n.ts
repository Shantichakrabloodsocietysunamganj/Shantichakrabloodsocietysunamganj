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
  "hero.needBlood": { bn: "রক্তের অনুরোধ করুন", en: "Need Blood?" },
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
  "about.values.humanity": { bn: "মানবিকতা", en: "Humanity" },
  "about.values.humanityDesc": { bn: "ধর্ম, বর্ণ বা পেশা ভেদে নয় — প্রতিটি জীবনের পাশে দাঁড়াই।", en: "Regardless of religion or caste — we stand by every life." },
  "about.values.speed": { bn: "দ্রুততা", en: "Speed" },
  "about.values.speedDesc": { bn: "জরুরি মুহূর্তে সবচেয়ে কম সময়ে সঠিক দাতায় পৌঁছাই।", en: "In emergencies, we reach the right donor in the shortest time." },
  "about.values.security": { bn: "নিরাপত্তা", en: "Security" },
  "about.values.securityDesc": { bn: "দাতা ও গ্রহীতার তথ্য সুরক্ষিত ও দায়িত্বশীলভাবে ব্যবহৃত হয়।", en: "Donor and recipient info is kept secure and used responsibly." },
  "about.values.volunteerism": { bn: "স্বেচ্ছাসেবা", en: "Volunteerism" },
  "about.values.volunteerismDesc": { bn: "কোনো আর্থিক লেনদেশন নেই — পুরোপুরি স্বেচ্ছাসেবী নেটওয়ার্ক।", en: "No financial transactions — fully voluntary network." },
  "about.values.locality": { bn: "স্থানীয়তা", en: "Locality" },
  "about.values.localityDesc": { bn: "সিলেট বিভাগের মানুষের জন্য, সিলেটের মানুষের দ্বারা।", en: "For the people of Sylhet, by the people of Sylhet." },
  "about.values.continuity": { bn: "নিরবচ্ছিন্নতা", en: "Continuity" },
  "about.values.continuityDesc": { bn: "২৪/৭ অনুরোধ গ্রহণ ও সমন্বয় — কখনো থামি না।", en: "24/7 request handling — we never stop." },

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

  // Blood seekers (রক্তপ্রার্থী) — live directory
  "nav.seekers": { bn: "রক্তপ্রার্থী", en: "Blood Seekers" },
  "seekers.title": { bn: "রক্তপ্রার্থী তালিকা", en: "Blood Seekers" },
  "seekers.desc": {
    bn: "যাঁরা এই মুহূর্তে রক্ত খুঁজছেন — তাঁদের লাইভ তালিকা। নতুন অনুরোধ এলে সাথে সাথেই এখানে যুক্ত হয়।",
    en: "People searching for blood right now — the list updates live as new requests arrive.",
  },
  "seekers.new": { bn: "+ রক্তের অনুরোধ দিন", en: "+ Post a Request" },
  "seekers.search": { bn: "রোগী / হাসপাতাল / ফোন", en: "Patient / Hospital / Phone" },
  "seekers.onlyUrgent": { bn: "শুধু জরুরি অনুরোধ", en: "Urgent only" },
  "seekers.includeClosed": { bn: "সম্পন্ন/বাতিলসহ দেখুন", en: "Include fulfilled/cancelled" },
  "seekers.eyebrow": { bn: "লাইভ রক্তপ্রার্থী", en: "Live Blood Seekers" },
  "seekers.homeTitle": { bn: "এই মুহূর্তে যাঁরা রক্ত খুঁজছেন", en: "Who needs blood right now" },
  "seekers.homeSub": {
    bn: "রক্তদাতাদের মতোই — অনুরোধকারীরাও এখানে লাইভ। নতুন অনুরোধ এলে সাথে সাথে দেখতে পাবেন।",
    en: "Just like donors — requesters appear live here the moment they post.",
  },
  "seekers.viewAll": { bn: "সব রক্তপ্রার্থী দেখুন →", en: "View all seekers →" },
  "seekers.postRequest": { bn: "রক্তের অনুরোধ করুন", en: "Post Blood Request" },
  "seekers.gotIt": { bn: "দেখলাম ✓", en: "Got it ✓" },

  // Common
  "common.loading": { bn: "লোড হচ্ছে…", en: "Loading…" },
  "common.home": { bn: "হোম", en: "Home" },
  "common.cancel": { bn: "বাতিল", en: "Cancel" },
  "common.search": { bn: "খুঁজুন", en: "Search" },
  "common.noData": { bn: "কোনো তথ্য নেই", en: "No data" },
  "common.error": { bn: "কিছু ভুল হয়েছে", en: "Something went wrong" },
  "common.save": { bn: "সংরক্ষণ করুন", en: "Save" },
  "common.submit": { bn: "জমা দিন", en: "Submit" },
  "common.close": { bn: "বন্ধ", en: "Close" },

  // Eligibility page
  "eligibility.eyebrow": { bn: "যোগ্যতা যাচাই", en: "Eligibility Check" },
  "eligibility.title": { bn: "আমি কি এখন রক্ত দিতে পারব?", en: "Can I donate blood now?" },
  "eligibility.sub": { bn: "কয়েকটি সহজ প্রশ্নের উত্তর দিয়ে মুহূর্তেই জেনে নিন — কোনো তথ্য সেভ হয় না।", en: "Answer a few simple questions instantly — no data is saved." },

  // Emergency page
  "emergency.eyebrow": { bn: "জরুরি ডিরেক্টরি", en: "Emergency Directory" },
  "emergency.title": { bn: "জরুরি নম্বর, হাসপাতাল ও ব্লাড ব্যাংক", en: "Emergency Numbers, Hospitals & Blood Banks" },
  "emergency.sub": { bn: "জরুরি মুহূর্তে প্রয়োজনীয় সব ফোন নম্বর এক জায়গায়। যেকোনো নম্বরে চাপ দিলেই কল যাবে।", en: "All essential emergency numbers in one place. Tap any number to call." },
  "emergency.national": { bn: "☎️ জাতীয় জরুরি হটলাইন", en: "☎️ National Emergency Hotlines" },
  "emergency.sunamganj": { bn: "🏥 সুনামগঞ্জ জেলা", en: "🏥 Sunamganj District" },
  "emergency.sylhet": { bn: "🩸 সিলেটের হাসপাতাল ও ব্লাড ব্যাংক", en: "🩸 Hospitals & Blood Banks in Sylhet" },
  "emergency.bloodBadge": { bn: "🩸 চিহ্নিত প্রতিষ্ঠানে ব্লাড ব্যাংক আছে", en: "🩸 Marked facilities have blood banks" },
  "emergency.ambulance": { bn: "🚑 অ্যাম্বুলেন্স কীভাবে পাবেন?", en: "🚑 How to Get an Ambulance?" },
  "emergency.ctaTitle": { bn: "🩸 জরুরি রক্ত প্রয়োজন?", en: "🩸 Need Emergency Blood?" },
  "emergency.ctaDesc": { bn: "হাসপাতালে রক্ত না পেলে আমাদের ওয়েবসাইটে অনুরোধ পোস্ট করুন — নিবন্ধিত দাতারা দ্রুত সাড়া দেন।", en: "If you can't find blood at the hospital, post a request on our website — registered donors respond quickly." },
  "emergency.bloodRequest": { bn: "রক্তের অনুরোধ করুন", en: "Request Blood" },
  "emergency.findDonor": { bn: "রক্তদাতা খুঁজুন", en: "Find Donors" },

  // Donate page
  "donate.eyebrow": { bn: "সহযোগিতা", en: "Support" },
  "donate.title": { bn: "আপনার সহযোগিতায় এগিয়ে যাক এই উদ্যোগ", en: "Help this initiative grow with your support" },
  "donate.sub": { bn: "রক্তদান সম্পূর্ণ বিনামূল্যে — তবে শিবির আয়োজন, রক্তের গ্রুপ টেস্ট কিট ও প্রচারণার খরচ চলে শুধু আপনাদের ভালোবাসায়।", en: "Blood donation is completely free — but camps, test kits and campaigns run on your love." },
  "donate.methodsTitle": { bn: "অনুদান পাঠানোর মাধ্যম", en: "Donation Methods" },
  "donate.wantToSupport": { bn: "সরাসরি সহযোগিতা করতে চান?", en: "Want to support directly?" },
  "donate.contactVolunteer": { bn: "আমাদের স্বেচ্ছাসেবকদের সাথে সরাসরি কথা বলে সহায়তার মাধ্যম জেনে নিন", en: "Talk directly to our volunteers to know how you can help" },
  "donate.commitmentTitle": { bn: "আমাদের অঙ্গীকার", en: "Our Commitment" },
  "donate.commitmentDesc": { bn: "শান্তিচক্র ব্লাড সোসাইটি সম্পূর্ণ স্বেচ্ছাসেবী ও অলাভজনক সংগঠন। আর্থিক সহযোগিতার প্রতিটি টাকা খরচ হয় শুধুমাত্র রক্তদান শিবির ও সচেতনতামূলক কার্যক্রমে।", en: "Shantichakra Blood Society is fully voluntary and non-profit. Every donation is spent only on blood camps and awareness activities." },
  "donate.biggestDonation": { bn: "সবচেয়ে বড় দান: আপনার রক্ত", en: "The biggest donation: Your Blood" },
  "donate.bloodDesc": { bn: "টাকার চেয়েও মূল্যবান হলো আপনার এক ব্যাগ রক্ত — যা বাঁচাতে পারে তিনটি প্রাণ।", en: "More valuable than money is one bag of your blood — it can save three lives." },
  "donate.becomeDonor": { bn: "রক্তদাতা হোন", en: "Become a Donor" },
  "donate.checkEligibility": { bn: "যোগ্যতা যাচাই করুন", en: "Check Eligibility" },

  // Volunteer page
  "volunteer.eyebrow": { bn: "স্বেচ্ছাসেবক হোন", en: "Become a Volunteer" },
  "volunteer.title": { bn: "স্বেচ্ছাসেবক হিসেবে যুক্ত হোন", en: "Join as a Volunteer" },
  "volunteer.sub": { bn: "রক্তদান কার্যক্রমে সরাসরি অংশ নিন, জীবন বাঁচানোর এই মিশনের অংশীদার হোন।", en: "Take part directly in blood donation activities, be a partner in saving lives." },
  "volunteer.thanks": { bn: "ধন্যবাদ! 🙌", en: "Thank you! 🙌" },
  "volunteer.thanksDesc": { bn: "আপনার স্বেচ্ছাসেবক আবেদন গৃহীত হয়েছে। অ্যাডমিন অনুমোদন করলে যোগাযোগ করা হবে।", en: "Your volunteer application has been received. We'll contact you after admin approval." },
  "volunteer.backHome": { bn: "হোমে ফিরুন", en: "Back to Home" },
  "volunteer.fullName": { bn: "পুরো নাম *", en: "Full Name *" },
  "volunteer.mobile": { bn: "মোবাইল *", en: "Mobile *" },
  "volunteer.email": { bn: "ইমেইল", en: "Email" },
  "volunteer.upazila": { bn: "উপজেলা", en: "Upazila" },
  "volunteer.select": { bn: "নির্বাচন করুন", en: "Select" },
  "volunteer.howHelp": { bn: "আপনি কীভাবে সাহায্য করতে চান?", en: "How do you want to help?" },
  "volunteer.placeholder": { bn: "যেমন: রক্তদাতা সমন্বয়, প্রচার, ইভেন্ট ব্যবস্থাপনা", en: "e.g.: Donor coordination, promotion, event management" },
  "volunteer.submitting": { bn: "পাঠানো হচ্ছে…", en: "Submitting…" },
  "volunteer.submit": { bn: "আবেদন জমা দিন", en: "Submit Application" },
  "volunteer.error": { bn: "নিবন্ধনে সমস্যা হয়েছে", en: "There was a problem with registration" },

  // Gallery page
  "gallery.eyebrow": { bn: "গ্যালারি", en: "Gallery" },
  "gallery.title": { bn: "আমাদের মুহূর্তগুলো", en: "Our Moments" },
  "gallery.sub": { bn: "রক্তদান শিবির, কর্মসূচি ও সমিতির কার্যক্রমের ছবি।", en: "Photos from blood camps, programs and activities." },
  "gallery.loadFail": { bn: "গ্যালারি লোড করা যায়নি।", en: "Failed to load gallery." },
  "gallery.noPhoto": { bn: "এখনো কোনো ছবি যোগ করা হয়নি", en: "No photos added yet" },
  "gallery.adminAdd": { bn: "অ্যাডমিন ড্যাশবোর্ড থেকে ছবি যোগ করা হবে।", en: "Photos will be added from the admin dashboard." },

  // FAQ page
  "faq.eyebrow": { bn: "FAQ", en: "FAQ" },
  "faq.title": { bn: "সাধারণ জিজ্ঞাসিত প্রশ্ন", en: "Frequently Asked Questions" },
  "faq.sub": { bn: "রক্তদান সম্পর্কে আপনার সব প্রশ্নের উত্তর এক জায়গায়।", en: "All your questions about blood donation in one place." },
  "faq.moreQ": { bn: "আরও প্রশ্ন আছে?", en: "Have more questions?" },
  "faq.contactDirect": { bn: "আমাদের সাথে সরাসরি যোগাযোগ করুন।", en: "Contact us directly." },
  "faq.contactBtn": { bn: "যোগাযোগ করুন", en: "Contact Us" },

  // Blog page
  "blog.eyebrow": { bn: "ব্লগ ও খবর", en: "Blog & News" },
  "blog.title": { bn: "রক্তদান ও স্বাস্থ্য সচেতনতা ব্লগ", en: "Blood Donation & Health Awareness Blog" },
  "blog.sub": { bn: "রক্তদান, স্বাস্থ্য ও সমিতির কার্যক্রম সম্পর্কে প্রয়োজনীয় নিবন্ধ ও খবর।", en: "Essential articles and news about blood donation, health and our activities." },

  // Certificate page
  "cert.title": { bn: "সম্মাননা সনদ", en: "Certificate of Appreciation" },
  "cert.certSub": { bn: "Certificate of Appreciation", en: "Certificate of Appreciation" },
  "cert.presented": { bn: "এই সনদ প্রদান করা হলো", en: "This certificate is presented to" },
  "cert.bloodGroup": { bn: "রক্তের গ্রুপ", en: "Blood Group" },
  "cert.thanks": { bn: "মানবিক সেবায় অবদান রাখায় ও নিস্বার্থভাবে", en: "For contributing to humanitarian service and selflessly donating" },
  "cert.unit": { bn: "ইউনিট", en: "units" },
  "cert.thanks2": { bn: "রক্ত দান করার জন্য শান্তিচক্র ব্লাড সোসাইটি তাঁকে গভীর কৃতজ্ঞতা জানায়। প্রতিটি ফোঁটা রক্ত একটি বাঁচানো জীবন।", en: "blood, Shantichakra Blood Society expresses deep gratitude. Every drop saves a life." },
  "cert.totalDonations": { bn: "মোট রক্তদান", en: "Total Donations" },
  "cert.totalUnits": { bn: "মোট ইউনিট", en: "Total Units" },
  "cert.president": { bn: "সভাপতি", en: "President" },
  "cert.secretary": { bn: "সাধারণ সম্পাদক", en: "General Secretary" },
  "cert.date": { bn: "প্রদানের তারিখ", en: "Issue Date" },
  "cert.needDonor": { bn: "সার্টিফিকেটের জন্য রক্তদাতা হিসেবে নিবন্ধন করুন।", en: "Register as a donor to get your certificate." },
  "cert.becomeDonor": { bn: "রক্তদাতা হোন", en: "Become Donor" },
  "cert.dashboard": { bn: "ড্যাশবোর্ড", en: "Dashboard" },
  "cert.download": { bn: "সার্টিফিকেট ডাউনলোড/প্রিন্ট", en: "Download / Print Certificate" },

  // Cookie Banner
  "cookie.msg": { bn: "এই সাইট আপনার অভিজ্ঞতা উন্নত করতে কুকি ব্যবহার করে। চালিয়ে যাওয়া মানে আপনি এতে সম্মত।", en: "This site uses cookies to improve your experience. Continuing means you agree." },
  "cookie.details": { bn: "বিস্তারিত", en: "Details" },
  "cookie.ok": { bn: "ঠিক আছে", en: "OK" },

  // Newsletter
  "newsletter.title": { bn: "আপডেট পেতে চান?", en: "Want updates?" },
  "newsletter.sub": { bn: "রক্তদান শিবির, জরুরি অনুরোধ ও সমিতির খবর সরাসরি আপনার ইনবক্সে পান।", en: "Get blood camps, urgent requests and society news directly in your inbox." },
  "newsletter.placeholder": { bn: "আপনার ইমেইল", en: "Your email" },
  "newsletter.btn": { bn: "সাবস্ক্রাইব", en: "Subscribe" },
  "newsletter.success": { bn: "ধন্যবাদ! আপনি নিউজলেটারে যুক্ত হয়েছেন।", en: "Thank you! You have joined the newsletter." },

  // Faq default
  "faq.q1": { bn: "রক্তদাতা হিসেবে নিবন্ধন করতে কী লাগে?", en: "What do I need to register as a donor?" },
  "faq.a1": { bn: "শুধু আপনার নাম, সক্রিয় মোবাইল নম্বর, রক্তের গ্রুপ ও এলাকা প্রয়োজন। 'রক্তদাতা হোন' ফর্ম পূরণ করলেই হবে। সম্পূর্ণ ফ্রি।", en: "Just your name, active mobile number, blood group and area. Fill the 'Become a Donor' form. Completely free." },
  "faq.q2": { bn: "রক্ত দিতে বয়সের সীমা কত?", en: "What is the age limit for blood donation?" },
  "faq.a2": { bn: "সাধারণত ১৮ থেকে ৬০ বছর, ওজন কমপক্ষে ৪৫ কেজি এবং সুস্থ থাকলে রক্ত দেওয়া নিরাপদ।", en: "Generally 18 to 60 years, at least 45 kg weight and healthy to donate safely." },
  "faq.q3": { bn: "কতদিন পর পর রক্ত দেওয়া যায়?", en: "How often can I donate blood?" },
  "faq.a3": { bn: "সুস্থ পুরুষ ৩ মাস এবং নারী ৪ মাস পর পর রক্ত দিতে পারেন। বছরে সর্বোচ্চ ৪ বার।", en: "Healthy men can donate every 3 months and women every 4 months. Maximum 4 times a year." },
  "faq.q4": { bn: "জরুরি রক্ত লাগলে কীভাবে অনুরোধ করব?", en: "How do I request emergency blood?" },
  "faq.a4": { bn: "'রক্ত লাগবে?' পেজে রোগীর তথ্য দিয়ে অনুরোধ পোস্ট করুন। তাৎক্ষণিকভাবে সারা সিলেটের দাতাদের কাছে তা পৌঁছে যাবে।", en: "Post a request with patient info on 'Need Blood?' page. It will instantly reach donors across Sylhet." },
  "faq.q5": { bn: "আমার তথ্য কি নিরাপদ?", en: "Is my information safe?" },
  "faq.a5": { bn: "হ্যাঁ। শুধু রক্তদান সমন্বয়ের জন্য আপনার তথ্য ব্যবহৃত হয়। কেউ আপনার তথ্য মুছতে বা পরিবর্তন করতে পারবে না।", en: "Yes. Your info is used only for donation coordination. No one can delete or alter it improperly." },
  "faq.q6": { bn: "এই পরিষেবা কি ফ্রি?", en: "Is this service free?" },
  "faq.a6": { bn: "সম্পূর্ণ ফ্রি ও স্বেচ্ছাসেবী। কোনো আর্থিক লেনদেশ এই প্ল্যাটফর্মে নেই।", en: "Completely free and voluntary. No financial transactions on this platform." },

  // Misc
  "backToTop": { bn: "উপরে যান", en: "Go to top" },
  "moderator": { bn: "মডারেটর", en: "Moderator" },
  "menu": { bn: "মেনু", en: "Menu" },
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
