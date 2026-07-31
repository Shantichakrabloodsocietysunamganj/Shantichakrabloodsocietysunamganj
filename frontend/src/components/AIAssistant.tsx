"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Msg = { from: "bot" | "user"; text: string; cta?: { label: string; href: string } };
type Entry = { keys: string[]; bn: string; en: string; cta?: { bn: string; en: string; href: string } };

// Local fallback knowledge base (used if no API key or the API fails)
const KB: Entry[] = [
  {
    keys: ["রক্ত লাগ", "রকত লাগ", "জরুরি", "রক্ত দরকার", "blood", "need", "emergency", "urgent", "প্রয়োজন", "মুমূর্ষু"],
    bn: "🚨 জরুরি রক্ত লাগলে দ্রুত করুন:\n১) কল করুন: 01626224878\n২) /request-blood পেজে রোগীর নাম, গ্রুপ, হিমোগ্লোবিন, হাসপাতাল ও তারিখ দিয়ে অনুরোধ পোস্ট করুন\n৩) /donors পেজে গ্রুপ+এলাকা দিয়ে প্রস্তুত দাতা খুঁজে সরাসরি কল করুন\n\nআমরা ২৪/৭ পাশে আছি।",
    en: "🚨 For urgent blood:\n1) Call: 01626224878\n2) Post a request on /request-blood (patient name, group, hemoglobin, hospital, date)\n3) Search /donors by group + area, call donors directly\n\nWe are here 24/7.",
    cta: { bn: "রক্তের অনুরোধ করুন →", en: "Request blood →", href: "/request-blood" },
  },
  {
    keys: ["দাতা খুঁজ", "দাতা লাগ", "দাতা সার্চ", "where", "find donor", "search donor", "কোথায়"],
    bn: "রক্তের গ্রুপ, জেলা ও উপজেলা দিয়ে প্রস্তুত দাতা খুঁজে বের করুন। প্রতিটি দাতার সাথে সরাসরি কল বা WhatsApp করা যায়। দাতার কার্ডে দেখাবে সে প্রস্তুত কি না (৯০ দিন নিয়ম অনুযায়ী)।",
    en: "Search available donors by blood group, district and upazila. Call or WhatsApp any donor directly. The card shows if they are eligible (90-day rule since last donation).",
    cta: { bn: "দাতা খুঁজুন →", en: "Find donors →", href: "/donors" },
  },
  {
    keys: ["দাতা হব", "রেজিস্ট্রি", "যুক্ত হব", "নিবন্ধন", "register", "become", "join"],
    bn: "রক্তদাতা হতে /become-donor ফর্মে নাম, মোবাইল, গ্রুপ ও এলাকা দিন। সম্পূর্ণ ফ্রি। নিবন্ধন করলেই সরাসরি লাইভ তালিকায় যুক্ত হবেন (কোনো admin অনুমোদন লাগে না)। শেষ রক্তদানের তারিখ দিলে সিস্টেম স্বয়ংক্রিয়ভাবে ৯০ দিন পর 'প্রস্তুত' দেখাবে।",
    en: "To become a donor, fill the /become-donor form with name, phone, group and area. Completely free. You go LIVE immediately (no admin approval needed). The system auto-shows 'ready' 90 days after your last donation.",
    cta: { bn: "রক্তদাতা হোন →", en: "Become a donor →", href: "/become-donor" },
  },
  {
    keys: ["হিমোগ্লোবিন", "hemoglobin", "hb", "হিমোগ্ল", "রক্তশূন্যতা", "anemia", "রক্তস্বল্পতা"],
    bn: "হিমোগ্লোবিন (Hb) স্বাভাবিক মান: পুরুষ ১৩-১৭ g/dL, নারী ১২-১৫ g/dL। ১০-এর কম হলে রক্তস্বল্পতা হতে পারে। রক্তের অনুরোধে হিমোগ্লোবিন উল্লেখ করা বাধ্যতামূলক — তাহলে দাতারা দ্রুত সিদ্ধান্ত নিতে পারে।",
    en: "Normal hemoglobin (Hb): men 13-17 g/dL, women 12-15 g/dL. Below 10 may indicate anemia. Hemoglobin is required in blood requests so donors can decide quickly.",
  },
  {
    keys: ["৯০ দিন", "90 day", "কবে", "প্রস্তুত", "eligible", "কদিন", "কখন দিতে", "when donate"],
    bn: "একবার রক্ত দেওয়ার পর কমপক্ষে ৯০ দিন (৩ মাস) অপেক্ষা করতে হয়। এই ৯০ দিন পার হলে সিস্টেম স্বয়ংক্রিয়ভাবে দাতাকে 'রক্তদানে প্রস্তুত' দেখায়। ৯০ দিনের কম হলে 'আর X দিন পর প্রস্তুত' দেখায়।",
    en: "After donating blood, wait at least 90 days (3 months). The system automatically shows 'ready' after 90 days, and 'ready in X days' before that.",
  },
  {
    keys: ["যোগাযোগ", "ফোন", "নম্বর", "মেইল", "contact", "phone", "email", "call", "WhatsApp"],
    bn: "📞 ফোন/WhatsApp: 01626224878\n✉️ ইমেইল: shantichakrabloodsociety@gmail.com\n📘 Facebook গ্রুপেও যোগ দিন।\nসভাপতি: আবু সালেহ | সাধারণ সম্পাদক: রাহাত আহমেদ",
    en: "Phone/WhatsApp: 01626224878\nEmail: shantichakrabloodsociety@gmail.com\nPresident: Abu Saleh | GS: Rahat Ahmed",
    cta: { bn: "যোগাযোগ পেজ →", en: "Contact page →", href: "/contact" },
  },
  {
    keys: ["টাকা", "দান", "ডোনেশন", "সাহায্য করব", "অনুদান", "donate", "support", "contribute", "money"],
    bn: "আমাদের মিশনে সহযোগিতা করতে পারেন! হোমপেজের 'Support Our Mission' সেকশনে bKash/Nagad/Rocket/Bank অপশন আছে। আপনার সামান্য সহযোগিতায় আমরা জরুরি রক্ত সমন্বয়, শিবির, সচেতনতা — সব চালিয়ে যেতে পারি।",
    en: "Support our mission! The homepage has a 'Support Our Mission' section with bKash/Nagad/Rocket/Bank. Your contribution helps with emergency coordination, camps, awareness, and technology.",
  },
  {
    keys: ["কী", "কি এটা", "কে", "সংগঠন", "about", "shantichakra", "শান্তিচক্র", "পরিচয়", "what"],
    bn: "শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ — ২০২৪ সালে প্রতিষ্ঠিত স্বেচ্ছাসেবী রক্তদান সংগঠন। সিলেট বিভাগের ৪ জেলায় সক্রিয়, পরবর্তী লক্ষ্য সারা বাংলাদেশ। সম্পূর্ণ ফ্রি ও ২৪/৭।",
    en: "Shantichakra Blood Society, Sunamganj — founded 2024, a voluntary blood donation org active across all 4 districts of Sylhet Division. Next goal: all of Bangladesh. 100% free, 24/7.",
    cta: { bn: "আমাদের সম্পর্কে →", en: "About us →", href: "/about" },
  },
  {
    keys: ["গ্রুপ মেলে", "সামঞ্জস্য", "কাকে দিতে", "কার কাছ থেকে", "compatible", "match group", "গ্রুপ মিল"],
    bn: "ভুল গ্রুপের রক্ত প্রাণঘাতী! O- Universal Donor, AB+ Universal Recipient। হোমপেজের 'রক্ত সামঞ্জস্যতা' চেকারে আপনার গ্রুপ বেছে দেখুন কাকে দিতে/কার কাছ থেকে নিতে পারবেন।",
    en: "Wrong blood group can be fatal! O- is universal donor, AB+ universal recipient. Use the compatibility checker on the homepage.",
  },
  {
    keys: ["ফ্রি", "টাকা লাগে", "খরচ", "মূল্য", "price", "cost", "free", "money"],
    bn: "সম্পূর্ণ ফ্রি ও স্বেচ্ছাসেবী। রক্তদানে বা রক্ত খোঁজায় কোনো টাকা লাগে না। আমরা কাউকে টাকা দিতে বলি না।",
    en: "100% free and voluntary. No money needed for blood donation or finding donors.",
  },
  {
    keys: ["ইভেন্ট", "শিবির", "কর্মসূচি", "event", "camp", "program"],
    bn: "আমরা নিয়মিত রক্তদান শিবির ও ফ্রি রক্তের গ্রুপ নির্ধারণ কর্মসূচি আয়োজন করি। আসন্ন ও অতীত সব কর্মসূচি /events পেজে দেখুন।",
    en: "We organize regular blood donation camps and free blood-grouping programs. See all events on /events.",
    cta: { bn: "কর্মসূচি দেখুন →", en: "View events →", href: "/events" },
  },
  {
    keys: ["উন্নতি", "অর্জন", "পরিসংখ্যান", "impact", "stats", "কত জন", "achievement"],
    bn: "আমাদের প্রভাব: /impact পেজে দেখুন — মোট দাতা, সাহায্যপ্রাপ্ত রোগী, সংগৃহীত রক্ত ইউনিট, সক্রিয় স্বেচ্ছাসেবক। সম্পূর্ণ স্বচ্ছতায়।",
    en: "Our impact: check /impact page — total donors, patients helped, blood units, volunteers. Fully transparent.",
    cta: { bn: "অর্জন দেখুন →", en: "View impact →", href: "/impact" },
  },
];

function useLang(): "bn" | "en" {
  const [lang, setLang] = useState<"bn" | "en">("bn");
  useEffect(() => {
    const m = document.cookie.match(/lang=(\w+)/);
    setLang(m && m[1] === "en" ? "en" : "bn");
  }, []);
  return lang;
}

export default function AIAssistant() {
  const router = useRouter();
  const lang = useLang();
  const en = lang === "en";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const greet: Msg = {
    from: "bot",
    text: en
      ? "Yes! 👋 I'm Shanti, the AI helper of Shantichakra Blood Society 🤖. Need blood, want to find a donor, or have a question? I'm here to help."
      : "হ্যাঁ জি! 👋 আমি শান্তি — শান্তিচক্র ব্লাড সোসাইটির AI হেল্পার 🤖। রক্ত লাগলে, দাতা খুঁজতে হলে বা যেকোনো প্রশ্ন থাকলে বলুন — আমি সাহায্য করব।",
  };
  const [msgs, setMsgs] = useState<Msg[]>([greet]);
  useEffect(() => { setMsgs([greet]); /* re-greet when language changes */ }, [en]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [msgs, open, typing]);

  const localReply = (q: string): Msg => {
    const t = q.toLowerCase();
    if (/^(hi|hello|hey|hii|hy|salam|salaam|assalam|namaskar|নমস্কার|হাই|সালাম|হ্যালো|হেলো|কেমন আছ)/.test(t))
      return { from: "bot", text: en ? "Hello! 😊 Need blood, find a donor, or become one?" : "হ্যাঁ জি! 😊 বলুন — রক্ত লাগবে, দাতা খুঁজবেন, নাকি রক্তদাতা হবেন?" };
    if (/(ধন্যবাদ|থ্যাংকস|thank|thnx|tnx|thanks)/.test(t))
      return { from: "bot", text: en ? "You're welcome! 🤍 Donate blood, save lives." : "আপনাকেও ধন্যবাদ! 🤍 রক্ত দিন, জীবন বাঁচান।" };
    let best: { score: number; entry: Entry } | null = null;
    for (const entry of KB) {
      const score = entry.keys.reduce((s, k) => (t.includes(k.toLowerCase()) ? s + 1 : s), 0);
      if (score > 0 && (!best || score > best.score)) best = { score, entry };
    }
    const e = best?.entry;
    if (e) return { from: "bot", text: en ? e.en : e.bn, cta: e.cta ? { label: en ? e.cta.en : e.cta.bn, href: e.cta.href } : undefined };
    return {
      from: "bot",
      text: en
        ? "I can help with finding/requesting blood, registering as a donor, and contact. Pick an option or ask a question."
        : "আমি রক্ত খোঁজা, অনুরোধ করা, রক্তদাতা হওয়া বা যোগাযোগে সাহায্য করতে পারি। অপশন বাছুন বা প্রশ্ন করুন।",
    };
  };

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    setMsgs((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setTyping(true);
    let answer = "";
    let cta: Msg["cta"];
    try {
      const history = [...msgs, { from: "user", text: q }].slice(-10).map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
      }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        answer = data.reply;
      } else {
        const fb = localReply(q);
        answer = fb.text;
        cta = fb.cta;
      }
    } catch {
      const fb = localReply(q);
      answer = fb.text;
      cta = fb.cta;
    }
    setTyping(false);
    setMsgs((m) => [...m, { from: "bot", text: answer, cta }]);
  };

  const SUGGESTIONS = en
    ? ["🩸 Need blood", "🔎 Find donor", "➕ Become donor", "📞 Contact"]
    : ["🩸 রক্ত লাগবে", "🔎 দাতা খুঁজুন", "➕ রক্তদাতা হব", "📞 যোগাযোগ"];

  return (
    <>
      {/* Floating AI button — distinct violet squircle (not like WhatsApp's green circle) */}
      <div className="group fixed bottom-6 right-6 z-[55] flex items-center">
        <span className="pointer-events-none mr-2 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold text-violet-700 opacity-0 shadow-glow transition-opacity duration-200 group-hover:opacity-100 dark:bg-slate-800 dark:text-violet-300">
          {en ? "Shanti" : "শান্তি"}
        </span>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={en ? "Shanti" : "শান্তি"}
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-brand-600 text-white shadow-[0_14px_34px_-8px_rgba(124,58,237,0.6)] transition-transform hover:scale-105"
        >
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-300 opacity-70" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-fuchsia-400 ring-2 ring-violet-700" />
          </span>
          <span className="absolute -left-1.5 -top-1.5 rounded-md bg-white px-1 text-[8px] font-extrabold tracking-wide text-fuchsia-600 shadow-sm">AI</span>
          {open ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /></svg>
          ) : (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l1.6 4.8L18.5 8l-4 3 1.5 5L12 13.5 8 16l1.5-5-4-3 4.9-1.2L12 2z" /><path d="M19 14l.7 1.9L21.6 17l-1.9.7L19 19.6l-.7-1.9L16.4 17l1.9-.7L19 14z" opacity=".7" /></svg>
          )}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-[55] flex h-[28rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl sm:right-6">
          <div className="flex items-center gap-3 bg-gradient-to-r from-violet-700 via-fuchsia-700 to-brand-700 px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">🤖</span>
            <div>
              <p className="text-sm font-bold leading-tight">{en ? "Shanti" : "শান্তি"}</p>
              <p className="text-[10px] text-white/70">{en ? "Your blood donation assistant" : "আপনার রক্তদান সহকারী"}</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-canvas/60 p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${m.from === "user" ? "bg-brand-600 text-white" : "bg-white text-ink shadow-soft ring-1 ring-zinc-100"}`}>
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                  {m.cta && (
                    <button onClick={() => { router.push(m.cta!.href); setOpen(false); }} className="mt-2 inline-flex rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 hover:bg-violet-100">
                      {m.cta.label}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-3 shadow-soft ring-1 ring-zinc-100">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-100 bg-white p-2.5">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s.replace(/^[^\s]+\s/, ""))} className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-100">{s}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={en ? "Type your question…" : "আপনার প্রশ্ন লিখুন…"} className="input !py-2 text-sm" />
              <button type="submit" aria-label={en ? "Send" : "পাঠান"} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white hover:opacity-90">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
