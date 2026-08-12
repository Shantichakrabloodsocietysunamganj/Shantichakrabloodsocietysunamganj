# শান্তিচক্র রক্তদান সমিতি — Shantichakra Blood Society

সুনামগঞ্জের স্বেচ্ছাসেবী রক্তদান নেটওয়ার্কের অফিসিয়াল ওয়েবসাইট। Next.js (App Router), Supabase, Tailwind CSS ও Cloudinary দিয়ে তৈরি।

---

## ✨ ফিচার

- **হোমপেজ** — মিশন, লাইভ পরিসংখ্যান, কাজের পদ্ধতি, জরুরি অনুরোধ
- **রক্তদাতা খুঁজুন** — রক্তের গ্রুপ, উপজেলা, নাম দিয়ে লাইভ সার্চ
- **রক্তদাতা নিবন্ধন** — ছবি আপলোডসহ (Cloudinary) রেজিস্ট্রেশন ফর্ম
- **রক্তের অনুরোধ** — জরুরি রক্তের প্রয়োজন পোস্ট করার ফর্ম
- **জরুরি অনুরোধ তালিকা** — গ্রুপ অনুযায়ী ফিল্টারযোগ্য
- **🔴 রক্তপ্রার্থী লাইভ সিস্টেম** (`/blood-seekers`) — যাঁরা রক্তের অনুরোধ দেন তাঁরাও **রক্তদাতার মতোই কার্ডে** দেখা যান (avatar, গ্রুপ ব্যাজ, লাইভ স্ট্যাটাস ডট, কল/WhatsApp)। Supabase **Realtime** দিয়ে নতুন অনুরোধ পোস্ট হওয়ামাত্র **সাথে সাথে** সব ইউজারের স্ক্রিনে যুক্ত হয় — সাথে "এইমাত্র এলো" হাইলাইট, লাইভ পপ-আপ অ্যালার্ট ও নোটিফিকেশন সাউন্ড। Realtime বন্ধ থাকলে ৪৫ সেকেন্ডের polling fallback কাজ করে।
  > ⚠️ চালু করতে `supabase/schema.sql` আবার Run করুন (অথবা Supabase Dashboard → Database → Replication → `blood_requests` টেবিল enable করুন)।
- **রক্তদানের যোগ্যতা যাচাই** (`/eligibility`) — বয়স, ওজন, শেষ রক্তদান ও স্বাস্থ্য প্রশ্নের মাধ্যমে ইন্টার‍্যাক্টিভ যোগ্যতা কুইজ (পরবর্তী যোগ্য তারিখসহ)
- **জরুরি ডিরেক্টরি** (`/emergency`) — জাতীয় হটলাইন, সুনামগঞ্জ-সিলেটের হাসপাতাল ও ব্লাড ব্যাংকের নম্বর, এক-ক্লিক কল
- **আর্থিক সহযোগিতা** (`/donate`) — bKash/Nagad মেথড + QR কোড (অ্যাডমিন প্যানেল থেকে ম্যানেজ হয়)
- **ড্যাশবোর্ড কাউন্টডাউন ও ব্যাজ** — দাতার পরবর্তী রক্তদানের তারিখের কাউন্টডাউন (পুরুষ ৩ মাস / নারী ৪ মাস) এবং রক্তদানের সংখ্যা অনুযায়ী ব্যাজ (🥉🥈🥇💎)
- **শান্তি AI সহকারী (`AIAssistant`)** — ২৪/৭ স্মার্ট চ্যাটবট, বাংলাদেশি উচ্চারণে (`bn-BD`) Microsoft নবনীতা / তনিশা টাইপ সেরা মহিলা ভয়েস (TTS) অটো-বাছাই ও ভয়েস ইনপুট সুবিধা
- **আমাদের সম্পর্কে** ও **যোগাযোগ** পেজ
- সম্পূর্ণ **বাংলা** ভাষায়, মোবাইল-রেসপন্সিভ

## 🛠️ টেক স্ট্যাক

| কাজ | টুল |
|---|---|
| ফ্রন্টএন্ড | Next.js 14 (App Router) + TypeScript |
| স্টাইলিং | Tailwind CSS |
| ব্যাকএন্ড/ডেটাবেস | Supabase (PostgreSQL + Row Level Security) |
| ভ্যালিডেশন | Zod |
| ছবি হোস্টিং | Cloudinary (সার্ভার-সাইড) |

---

## 🚀 শুরু করা

### ১. ডিপেন্ডেন্সি ইনস্টল
```bash
cd frontend
npm install
```

### ২. এনভায়রনমেন্ট ভেরিয়েবল
`frontend/.env.local.example` ফাইলটি কপি করে `.env.local` বানিয়ে মান পূরণ করুন:
```bash
cp frontend/.env.local.example frontend/.env.local
```
প্রয়োজনীয় ভেরিয়েবল:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — Cloudinary (সার্ভার-সাইড)

> ⚠️ `.env.local` ফাইলটি `.gitignore`-এ যুক্ত — কখনো কমিট করবেন না।

### ৩. ডেটাবেস সেটআপ (একবার)
Supabase Dashboard → **SQL Editor** এ গিয়ে `supabase/schema.sql` ফাইলের পুরো কন্টেন্ট পেস্ট করে **Run** করুন। এতে টেবিল (`donors`, `blood_requests`, `contact_messages`), RLS পলিসি ও ইনডেক্স তৈরি হবে।

### ৪. লোকালে চালান
```bash
npm run dev
```
এরপর ব্রাউজারে `http://localhost:3000` খুলুন।

---

## 📁 প্রজেক্ট স্ট্রাকচার

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx              # হোমপেজ
│   │   ├── donors/               # রক্তদাতা খুঁজুন
│   │   ├── become-donor/         # নিবন্ধন ফর্ম
│   │   ├── request-blood/        # অনুরোধ ফর্ম
│   │   ├── requests/             # অনুরোধ তালিকা
│   │   ├── about/  contact/      # স্ট্যাটিক পেজ
│   │   └── api/upload/           # Cloudinary আপলোড (সার্ভার)
│   ├── components/               # পুনঃব্যবহারযোগ্য UI
│   ├── lib/supabase/             # client + server Supabase
│   └── data/                     # site.ts (সব তথ্য), constants.ts
├── supabase/schema.sql           # ডেটাবেস স্কিমা
└── .env.local                    # লোকাল সিক্রেট (git-ignored)
```

## ✏️ তথ্য পরিবর্তন

সংস্থার নাম, ফোন, ঠিকানা, প্রতিষ্ঠাতা ইত্যাদি **এক জায়গায়** এডিট করুন:
👉 `frontend/src/data/site.ts`

---

## 🔐 নিরাপত্তা নোট

- Supabase **anon key** ব্রাউজারে দেখা যায় — এটা ঠিক আছে, কারণ **Row Level Security (RLS)** দিয়ে ডেটা সুরক্ষিত।
- সবাই `donors`/`blood_requests` **দেখতে** ও **যোগ করতে** পারে, কিন্তু **মুছতে/পরিবর্তন** পারে না (শুধু service_role via Dashboard)।
- **Cloudinary API secret** সার্ভারেই থাকে, ব্রাউজারে যায় না।

## ☁️ ডেপ্লয় (Vercel)

1. GitHub-এ push করুন।
2. [vercel.com](https://vercel.com)-এ ইম্পোর্ট করুন।
3. Environment Variables-এ `.env.local`-এর মানগুলো যোগ করুন।
4. Deploy।

---

তৈরি ❤️ — সুনামগঞ্জের জন্য।
