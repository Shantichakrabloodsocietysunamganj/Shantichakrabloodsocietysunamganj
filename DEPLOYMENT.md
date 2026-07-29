# 🚀 Vercel-এ ডেপ্লয় গাইড (একদম শুরু থেকে শেষ পর্যন্ত)

> **শান্তিচক্র রক্তদান সমিতি** ওয়েবসাইট অনলাইনে লাইভ করার সম্পূর্ণ নির্দেশিকা।
> পুরোটা ধাপে ধাপে অনুসরণ করুন — প্রতিটা ধাপে কী ক্লিক করবেন, কী লিখবেন সব লেখা আছে।

---

## 📋 শুরু করার আগে যা দরকার (Prerequisites)

| # | যা লাগবে | হয়ে গেছে? |
|---|---------|----------|
| ১ | GitHub-এ কোড পুশ করা | ✅ হয়ে গেছে |
| ২ | Supabase-এ `schema.sql` চালানো | ✅ হয়ে গেছে |
| ৩ | একটি Vercel অ্যাকাউন্ট (ফ্রি) | ⏳ এখন করব |
| ৪ | ৫টি Environment Variable এর মান | ✸ নিচে দেওয়া আছে |

> 💡 Vercel সম্পূর্ণ **ফ্রি** — কোনো কার্ড বা টাকা লাগে না।

---

## ধাপ ১: Vercel-এ যান ও অ্যাকাউন্ট তৈরি

১. এই লিংকে যান: 👉 **https://vercel.com/new**

২. **"Sign Up"** বা সরাসরি **"Continue with GitHub"** চাপুন

৩. GitHub দিয়ে লগইন করুন (যেই অ্যাকাউন্টে রিপো আছে)

৪. Vercel যদি GitHub অ্যাক্সেস চায়:
   - **"Authorize Vercel"** বাটন চাপুন
   - চাইলে "All repositories" নির্বাচন করুন (সহজ)

✅ এখন আপনি Vercel-এর ড্যাশবোর্ডে আছেন।

---

## ধাপ ২: রিপো Import করুন

১. "New Project" বাটন চাপুন

২. **"Import Git Repository"** সেকশনে নিচে স্ক্রল করুন

৩. আপনার রিপো খুঁজুন:
   ```
   Shantichakrabloodsocietysunamganj/Shantichakrabloodsocietysunamganj
   ```
   - যদি না দেখায় → **"Adjust GitHub App Permissions"** চাপুন → রিপোতে অ্যাক্সেস দিন

৪. রিপোর পাশে **"Import"** বাটনে ক্লিক করুন

---

## ধাপ ৩: ⚠️ কনফিগারেশন (সবচেয়ে জরুরি ধাপ!)

Import করার পর একটা **Configure Project** পেজ আসবে। এখানে খুব মন দিয়ে করবেন:

### ৩.ক) Framework Preset
- অটো সিলেক্টেড থাকবে **"Next.js"**
- ✅ এটা ঠিক আছে — **কিছু বদলাবেন না**

### ৩.খ) 🔴 Root Directory (একদম জরুরি!)
> এই ধাপ ভুল করলে বিল্ড fail করবে।

১. **"Root Directory"** অপশনে ক্লিক করুন (বা "Edit")

২. যে উইন্ডোটা খুলবে, সেখানে ফোল্ডার লিস্ট দেখাবে। এর থেকে **`frontend`** ফোল্ডারটি সিলেক্ট করুন:
   ```
   📁 frontend        ← ✅ এটা সিলেক্ট করুন
   📁 supabase        ← ❌ এটা নয়
   📄 README.md
   ```
   *(কারণ Next.js অ্যাপটা `frontend/` ফোল্ডারের ভেতরে আছে)*

৩. **"Continue"** বা **"OK"** চাপুন

---

## ধাপ ৪: Environment Variables যোগ করুন (খুব জরুরি)

> ⚠️ এই ৫টি ভ্যারিয়েবল ছাড়া সাইট কাজ করবে না। একটা একটা করে যোগ করুন।

**"Environment Variables"** সেকশনে গিয়ে প্রতিটার জন্য:

> **"Key"** বক্সে বাঁ দিকের নাম, **"Value"** বক্সে ডান দিকের মান দিন।
> প্রতিটার নিচে **Environment**: ☑ Production ☑ Preview ☑ Development — **তিনটাই টিক দিন**।

### ভ্যারিয়েবল ১:
```
Key:   NEXT_PUBLIC_SUPABASE_URL
Value: https://shwtkhmaxemldmsvgvdp.supabase.co
```

### ভ্যারিয়েবল ২:
```
Key:   NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNod3RraG1heGVtbGRtc3ZndmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MDg2NzAsImV4cCI6MjEwMDM4NDY3MH0.FgP5sSA3BdW3aLjq6Ij1WNzFS-BDcli71hHADjkvQKo
```

### ভ্যারিয়েবল ৩:
```
Key:   CLOUDINARY_CLOUD_NAME
Value: easd4c4k
```

### ভ্যারিয়েবল ৪:
```
Key:   CLOUDINARY_API_KEY
Value: 893667473347287
```

### ভ্যারিয়েবল ৫:
```
Key:   CLOUDINARY_API_SECRET
Value: RRrtWs-5e2SFnpVyrrPAoq_a-NA
```

✅ প্রতিটা যোগ করার পর **"Add"** চাপুন। ৫টাই যোগ করা হলে নিচে চলে যান।

---

## ধাপ ৫: Deploy চাপুন!

সব ঠিক থাকলে নিচে নীল রঙের বড় **"Deploy"** বাটন দেখতে পাবেন।

👉 **Deploy** বাটনে ক্লিক করুন।

---

## ধাপ ৬: অপেক্ষা করুন (১–৩ মিনিট)

বিল্ড চলবে — স্ক্রিনে লগ স্ক্রল করবে। এটা স্বাভাবিক:

- ⏳ "Cloning..." → "Installing dependencies..." → "Running build..."
- একটু সময় নিন, **বিরক্ত হবেন না**

### ফলাফল:
- 🟢 **সবুজ ✅ ও "Congratulations"** → সফল! সাইট লাইভ! 🎉
- 🔴 **লাল ❌ ও "Error"** → নিচের "সমস্যা সমাধান" অংশ দেখুন

---

## ধাপ ৭: আপনার ওয়েবসাইট লিংক নিন

সফল হলে স্ক্রিনে একটা লিংক দেখতে পাবেন, যেমন:
```
https://shantichakra-blood-society-xxxx.vercel.app
```
👉 সেটাই আপনার লাইভ ওয়েবসাইট! ব্রাউজারে খুলে দেখুন।

---

## 🔧 সমস্যা সমাধান (Troubleshooting)

### সমস্যা ১: `Failed to compile` / `next: not found`
**কারণ:** Root Directory ভুল সেট করা হয়েছে।
**সমাধান:**
1. Vercel Dashboard → আপনার Project → **Settings**
2. **General** → **Root Directory** → সেট করুন `frontend`
3. **Save** → উপরে **"Redeploy"** চাপুন

### সমস্যা ২: `Invalid Environment Variable`
**কারণ:** কোনো ভ্যারিয়েবল ভুল বা বাদ পড়েছে।
**সমাধান:**
1. Project → **Settings** → **Environment Variables**
2. ৫টি ভ্যারিয়েবল ঠিক আছে কিনা যাচাই করুন
3. ঠিক করে **Redeploy** করুন

### সমস্যা ৩: সাইট খোলে কিন্তু "ডেটাবেস সংযোগ পাওয়া যায়নি"
**কারণ:** Supabase-এ `schema.sql` চালানো হয়নি।
**সমাধান:** Supabase → SQL Editor → পুরো `schema.sql` পেস্ট করে Run করুন (আগে থেকেই করা আছে)।

### সমস্যা ৪: রক্তদাতা ছবি আপলোড হয় না
**কারণ:** Cloudinary ভ্যারিয়েবল ঠিক নেই।
**সমাধান:** `CLOUDINARY_*` তিনটি ভ্যারিয়েবল ঠিক যোগ করুন।

---

## 🎯 ডেপ্লয়ের পরে যা করতে পারেন

### ক) কাস্টম ডোমেইন (ঐচ্ছিক)
নিজের ডোমেইন (যেমন `shantichakrablood.org`) যোগ করতে চাইলে:
- Project → **Settings** → **Domains** → ডোমেইন যোগ করুন

### খ) ছবি/তথ্য পরিবর্তন
- `frontend/src/data/site.ts` ফাইল এডিট করুন (নাম, ফোন, ঠিকানা)
- GitHub-এ পুশ করলেই Vercel অটো-রি-ডেপ্লয় করবে!

### গ) সাইট টেস্ট করুন
- "রক্তদাতা হোন" ফর্ম পূরণ করে একজন দাতা যোগ করুন
- "রক্ত লাগবে?" দিয়ে একটা অনুরোধ পোস্ট করুন
- হোমপেজে সব দেখাচ্ছে কিনা যাচাই করুন

---

## ✨ সারসংক্ষেপ (Quick Summary)

```
১. vercel.com/new → "Continue with GitHub"
২. Import আপনার রিপো
৩. Root Directory = frontend  ← (খুব জরুরি)
৪. ৫টি Environment Variable যোগ করুন
৫. Deploy চাপুন
৬. সবুজ ✅ হলে সাইট লাইভ!
```

---

**কোনো ধাপে আটকে গেলে** স্ক্রিনে কী লেখা আছে টেক্সটে বলুন, আমি সাহায্য করব। ❤️
