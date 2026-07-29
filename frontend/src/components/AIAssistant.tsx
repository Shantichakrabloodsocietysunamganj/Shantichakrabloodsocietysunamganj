"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Msg = { from: "bot" | "user"; text: string; cta?: { label: string; href: string } };

type Entry = { keys: string[]; bn: string; en: string; cta?: { bn: string; en: string; href: string } };

const KB: Entry[] = [
  {
    keys: ["রক্ত লাগ", "রকত লাগ", "জরুরি", "রক্ত দরকার", "blood", "need", "emergency", "urgent", "প্রয়োজন"],
    bn: "জরুরি রক্ত লাগলে 'রক্তের অনুরোধ' পেজে রোগীর নাম, গ্রুপ, হাসপাতাল ও তারিখ দিয়ে অনুরোধ পোস্ট করুন — সারা সিলেটের দাতাদের কাছে তাৎক্ষণিক পৌঁছে যাবে। খুব জরুরি হলে সরাসরি কল করুন: 01626224878।",
    en: "Need blood urgently? Post a request on the 'Request Blood' page with patient name, group, hospital and date — it reaches all Sylhet donors instantly. For emergencies call directly: 01626224878.",
    cta: { bn: "রক্তের অনুরোধ করুন →", en: "Request blood →", href: "/request-blood" },
  },
  {
    keys: ["দাতা খুঁজ", "দাতা লাগ", "দাতা সার্চ", "find donor", "search donor", "where"],
    bn: "রক্তের গ্রুপ, জেলা ও উপজেলা দিয়ে প্রস্তুত দাতা খুঁজে বের করুন। প্রতিটি দাতার সাথে সরাসরি কল বা WhatsApp-এ যোগাযোগ করা যায়।",
    en: "Search available donors by blood group, district and upazila. You can call or WhatsApp any donor directly.",
    cta: { bn: "দাতা খুঁজুন →", en: "Find donors →", href: "/donors" },
  },
  {
    keys: ["দাতা হব", "রেজিস্ট্রি", "যুক্ত হব", "নিবন্ধন", "register", "become", "join"],
    bn: "রক্তদাতা হতে 'রক্তদাতা হোন' ফর্মে নাম, মোবাইল, গ্রুপ ও এলাকা দিন। আবেদনের পর অ্যাডমিন যাচাই করে অনুমোদন করলে আপনার নাম লাইভ তালিকায় যুক্ত হবে। সম্পূর্ণ ফ্রি।",
    en: "To become a donor, fill the 'Become a Donor' form with name, phone, group and area. After you apply, an admin approves it before you appear on the live list. Completely free.",
    cta: { bn: "রক্তদাতা হোন →", en: "Become a donor →", href: "/become-donor" },
  },
  {
    keys: ["মেলে", "সামঞ্জস্য", "কাকে দিতে", "কার কাছ থেকে", "compatible", "match group", "গ্রুপ মিল"],
    bn: "ভুল গ্রুপের রক্ত প্রাণঘাতী হতে পারে। O- Universal Donor, AB+ Universal Recipient। হোম পেজের 'রক্ত সামঞ্জস্যতা' চেকারে আপনার গ্রুপ বেছে কাকে দিতে/কার কাছ থেকে নিতে পারবেন দেখুন।",
    en: "Wrong blood group can be fatal. O- is a universal donor, AB+ a universal recipient. Use the compatibility checker on the home page to see who you can donate to / receive from.",
    cta: { bn: "সামঞ্জস্যতা দেখুন →", en: "Check compatibility →", href: "/" },
  },
  {
    keys: ["যোগাযোগ", "ফোন", "নম্বর", "মেইল", "contact", "phone", "email", "call"],
    bn: "📞 ফোন/WhatsApp: 01626224878\n✉️ ইমেইল: shantichakrabloodsociety@gmail.com\n📘 Facebook গ্রুপেও যোগ দিন।",
    en: "📞 Phone/WhatsApp: 01626224878\n✉️ Email: shantichakrabloodsociety@gmail.com\n📘 Join our Facebook group too.",
    cta: { bn: "যোগাযোগ পেজ →", en: "Contact page →", href: "/contact" },
  },
  {
    keys: ["কী", "কি এটা", "কে", "সংগঠন", "about", "shantichakra", "শান্তিচক্র", "পরিচয়", "what"],
    bn: "শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ — একটি স্বেচ্ছাসেবী রক্তদান সংগঠন। সিলেট বিভাগের চার জেলায় (সুনামগঞ্জ, সিলেট, হবিগঞ্জ, মৌলভীবাজার) কাজ করছে, পরবর্তী লক্ষ্য সারা বাংলাদেশ।",
    en: "Shantichakra Blood Society, Sunamganj — a voluntary blood donation organization active across all four districts of Sylhet Division. Next mission: all of Bangladesh.",
    cta: { bn: "আমাদের সম্পর্কে →", en: "About us →", href: "/about" },
  },
  {
    keys: ["টাকা", "দাম", "ফ্রি", "খরচ", "মূল্য", "price", "cost", "free", "money"],
    bn: "সম্পূর্ণ ফ্রি ও স্বেচ্ছাসেবী। এই প্ল্যাটফর্মে কোনো আর্থিক লেনদেন নেই।",
    en: "Completely free and voluntary. There is no money involved on this platform.",
  },
  {
    keys: ["কখন", "সময়", "খোলা", "when", "hours", "open"],
    bn: "২৪/৭ — যেকোনো সময় রক্তের অনুরোধ করুন বা দাতা খুঁজুন। আমরা থামি না।",
    en: "24/7 — request blood or find a donor anytime. We never stop.",
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const greet: Msg = {
    from: "bot",
    text: en
      ? "Assalamu Alaikum! 👋 I'm the Shantichakra Blood Society assistant. Need blood or have a question? Ask me."
      : "আসসালামু আলাইকুম! 👋 আমি শান্তিচক্র ব্লাড সোসাইটির সহকারী। রক্ত লাগলে বা কোনো প্রশ্ন থাকলে বলুন।",
  };
  const [msgs, setMsgs] = useState<Msg[]>([greet]);
  useEffect(() => { setMsgs([greet]); /* re-greet on lang change */ }, [en]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [msgs, open]);

  const reply = (q: string): Msg => {
    const t = q.toLowerCase();
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
        ? "I'm the Shantichakra assistant. I can help with finding/requesting blood, registering as a donor, compatibility, and contact. Pick an option or type a question."
        : "আমি শান্তিচক্র ব্লাড সোসাইটির সহকারী। রক্ত খোঁজা, অনুরোধ করা, রক্তদাতা হওয়া বা যোগাযোগে সাহায্য করতে পারি। নিচের অপশন বেছে নিন বা প্রশ্ন লিখুন।",
    };
  };

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMsgs((m) => [...m, { from: "user", text: q }, reply(q)]);
    setInput("");
  };

  const SUGGESTIONS = en
    ? ["🩸 Need blood", "🔎 Find donor", "➕ Become donor", "📞 Contact"]
    : ["🩸 রক্ত লাগবে", "🔎 দাতা খুঁজুন", "➕ রক্তদাতা হব", "📞 যোগাযোগ"];

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={en ? "Assistant" : "সহকারী"}
        className="fixed bottom-6 right-6 z-[55] flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-blood-600 p-3.5 text-white shadow-glow transition-transform hover:scale-105"
      >
        <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-70" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-success-500 ring-2 ring-brand-700" />
        </span>
        {open ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /></svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 z-[55] flex h-[28rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl sm:right-6">
          <div className="flex items-center gap-3 bg-gradient-to-r from-brand-700 to-brand-600 px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">🩸</span>
            <div>
              <p className="text-sm font-bold leading-tight">{en ? "Shantichakra Assistant" : "শান্তিচক্র সহকারী"}</p>
              <p className="text-[10px] text-brand-100/80">{en ? "Here to help" : "সাধারণ প্রশ্নে সাহায্যকারী"}</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-canvas/60 p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${m.from === "user" ? "bg-brand-600 text-white" : "bg-white text-ink shadow-soft ring-1 ring-zinc-100"}`}>
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                  {m.cta && (
                    <button onClick={() => { router.push(m.cta!.href); setOpen(false); }} className="mt-2 inline-flex rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100">
                      {m.cta.label}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-100 bg-white p-2.5">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s.replace(/^[^\s]+\s/, ""))} className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700 hover:bg-brand-100">{s}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={en ? "Type your question…" : "আপনার প্রশ্ন লিখুন…"} className="input !py-2 text-sm" />
              <button type="submit" aria-label={en ? "Send" : "পাঠান"} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white hover:bg-brand-700">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
