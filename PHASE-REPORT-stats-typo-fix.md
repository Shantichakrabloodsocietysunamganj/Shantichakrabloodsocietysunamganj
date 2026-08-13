# Phase Report: হোমপেজ Stats "০" বাগ + "লেনদেশ" বানান ঠিক

**তারিখ:** ২০২৬-০৮-১৩ · **Branch:** `arena/019ff9b8-shantichakrabloodsocietysunamg` · **স্কোপ:** ২টা bug fix (site-wide analysis ফলো-আপ)

---

## 🐛 Bug 1: হোমপেজ stats সবসময় "০"

### লক্ষণ
হোমপেজের stats গ্রিডে (hero-এর নিচে, "লাইভ স্ট্যাটাস" সেকশনের উপরে) — **নিবন্ধিত রক্তদাতা / চলমান অনুরোধ / বাঁচানো জীবন / উপজেলা কভারেজ** — সবসময় "০" দেখাত। কিন্তু একই পেজের TrustBand সেকশনে ("সহযোগিতা করুন"-এর উপরে) সঠিক সংখ্যা "১৩ দাতা · ৪ অনুরোধ" দেখাত।

### Root cause
দুইটা সেকশনই ছিল না, data source ছিল **একটাই** — `src/app/page.tsx`-এর `getData()` একবার Supabase query করে `donorCount`/`openRequestCount` দুই জায়গায়ই props হিসেবে পাঠায়। পার্থক্য ছিল **render mechanism**-এ:

| সেকশন | Component | Render |
|---|---|---|
| TrustBand ("১৩ দাতা · ৪ অনুরোধ") | `src/components/home/TrustBand.tsx` | Plain SSR text → HTML-এই আসল সংখ্যা থাকে → সবসময় সঠিক |
| Stats grid | `page.tsx` → `Stat()` → **`CountUp`** (`src/components/CountUp.tsx`) | SSR-এ hardcoded `"০"` placeholder দিত; আসল সংখ্যা বসত *শুধু* client-side JS চললে (`useEffect` → `IntersectionObserver` → `requestAnimationFrame` → সরাসরি `el.textContent` mutation) |

অর্থাৎ stats গ্রিডের সংখ্যা দেখানো পুরোপুরি নির্ভর করত fragile client-side animation pipeline-এর উপর। Pipeline ব্যর্থ হলে (hydration ব্যর্থতা, JS chunk লোড না হওয়া, বা buggy animation code) ভিজিটর চিরকাল "০"-ই দেখত — যদিও supabase-এর data একদম ঠিকঠাক আসছিল।

**Production-এ পাওয়া প্রমাণ:** JS-enabled page extraction-এ হোমপেজের প্রতিটা `CountUp` (stats গ্রিড + DonationSection-এর ৪টা counter) "০"-তেই আটকে ছিল, আর `/impact` পেজের counter-গুলো অসম্ভব **negative সংখ্যা** দেখাচ্ছিল (`−১৭৭`, `−০`, `−৫৪`) — যা বর্তমান repo-র CountUp কোড দিয়ে তৈরি হওয়া সম্ভব নয় (positive `end` থেকে negative frame আসতে পারে না)। এটা নির্দেশ করে live deployment-এ পুরনো/অসিঙ্ক bundle চলছিল, যার count-up math-ই ভাঙা ছিল।

### Fix (approved Option A — progressive enhancement)
`CountUp` এখন SSR/প্রথম render-এ **আসল `end` মানই** দেখায়; scroll-triggered count-up animation আগের মতোই (০ → end) enhancement হিসেবে চলে। JS পুরোপুরি fail করলেও সঠিক সংখ্যা দৃশ্যমান থাকে — SEO/no-JS/crawler সব ক্ষেত্রেও। একটি ফাইলের পরিবর্তনেই হোমপেজ গ্রিড, DonationSection counter ও `/impact` counter — তিন জায়গার bug ঠিক হয়েছে।

## 🐛 Bug 2: বানান "লেনদেশ" → "লেনদেন"

### Global grep ফলাফল
Codebase-এ মোট **৪ জায়গায় (৩টা ফাইলে)** পাওয়া গিয়েছিল (shared constant নয়, hardcoded duplication):

1. `src/app/about/page.tsx:316` — About → মূল্যবোধ: "কোনো আর্থিক **লেনদেশন** নেই…" (ডাবল typo)
2. `src/components/home/Faq.tsx:12` — `DEFAULT_FAQS` fallback (হোমপেজ FAQ + `/faq` পেজ — দুই জায়গাতেই দেখাত)
3. `src/lib/i18n-dict/pages.ts:18` — #1-এর i18n dictionary **key** (বাংলা source string-ই key)
4. `src/lib/i18n-dict/pages.ts:140` — #2-এর i18n dictionary **key**

#3 ও #4-এর key না বদলালে English ভিজিটরদের কাছে সেই লাইন বাংলায় fallback হতো (silent break)।

### Fix
৪টা জায়গাতেই `লেনদেশ(ন)` → `লেনদেন`। `supabase/*.sql` seed-এ typo ছিল না; TrustBand / DonationSection / `site.highlights`-এ ইতিমধ্যেই সঠিক "লেনদেন" ছিল — সেগুলো untouched। Centralization (approved): এই ফেজে স্কিপ — প্রতিটা occurrence সামান্য ভিন্ন context-specific copy, জোর করে এক wording-এ আনা যায়নি।

---

## 📝 পরিবর্তিত ফাইল (মোট ৪টা)

| ফাইল | পরিবর্তন |
|---|---|
| `frontend/src/components/CountUp.tsx` | SSR placeholder `{Number(0).toLocaleString(locale)}` → আসল মান `{end.toLocaleString(locale)}` + আপডেটেড comment |
| `frontend/src/app/about/page.tsx` | লেনদেশন → লেনদেন (লাইন 316) |
| `frontend/src/components/home/Faq.tsx` | লেনদেশ → লেনদেন (DEFAULT_FAQS, লাইন 12) |
| `frontend/src/lib/i18n-dict/pages.ts` | ২টা dictionary key-তে একই বানান সংশোধন (লাইন 18, 140) |

## ✅ ভেরিফিকেশন

| চেক | ফলাফল |
|---|---|
| `next lint` | ✅ Pass (শুধু pre-existing `<img>` warnings, কোনো error নেই) |
| `tsc --noEmit` (type-check) | ✅ Pass, ০ error |
| `next build` | ✅ Pass (exit 0, সব route compile হয়েছে) |
| SSR smoke test (local prod server, raw HTML) | ✅ stats গ্রিডে placeholder নয়, **আসল মান** render হচ্ছে (যেমন উপজেলা কভারেজ = `১১`; DB-less local-এ বাকিগুলো প্রকৃত `০`) — আগে সমস্তই hardcoded `০` ছিল |
| `grep -rn "লেনদেশ" frontend/src` | ✅ ০টা match বাকি |

## ⚠️ Deploy-পরবর্তী কাজ (manual)

1. **Production deployment main-এর সাথে sync আছে কিনা যাচাই করুন** — `/impact`-এ negative সংখ্যা (`−১৭৭`) থেকে ধারণা live site সর্বশেষ কোড নয়, পুরনো build চালাচ্ছিল। এই fix merge+deploy-এর পর হোমপেজ stats-এ বাস্তব সংখ্যা দেখা যাওয়া উচিত (JS বন্ধ রেখে পেজ লোড করলেও — সেটাই আসল acceptance test)।
2. Live homepage FAQ DB (`faqs` টেবিল)-থেকে এলে এবং admin সেখানে ভুল বানান ঢুকিয়ে থাকলে admin panel থেকে ঠিক করতে হবে — বর্তমানে live FAQ-এর content code-এর `DEFAULT_FAQS`-এর সাথে হুবহু মিলছে বলে code fix-ই কভার করবে।
