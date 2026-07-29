"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Msg = { from: "bot" | "user"; text: string; cta?: { label: string; href: string } };

const KB: { keys: string[]; answer: string; cta?: { label: string; href: string } }[] = [
  {
    keys: ["রক্ত লাগ", "রকত লাগ", "জরুরি", "রক্ত দরকার", "blood", "need", "emergency", "urgent", "প্রয়োজন"],
    answer:
      "জরুরি রক্ত লাগলে 'রক্তের অনুরোধ' পেজে রোগীর নাম, গ্রুপ, হাসপাতাল ও তারিখ দিয়ে অনুরোধ পোস্ট করুন — সারা সিলেটের দাতাদের কাছে তাৎক্ষণিক পৌঁছে যাবে। খুব জরুরি হলে সরাসরি কল করুন: 01626224878।",
    cta: { label: "রক্তের অনুরোধ করুন →", href: "/request-blood" },
  },
  {
    keys: ["দাতা খুঁজ", "দাতা লাগ", "দাতা সার্চ", "where", "find donor", "search donor", "কোথায়"],
    answer:
      "রক্তের গ্রুপ, জেলা ও উপজেলা দিয়ে প্রস্তুত দাতা খুঁজে বের করুন। প্রতিটি দাতার সাথে সরাসরি কল বা WhatsApp-এ যোগাযোগ করা যায়।",
    cta: { label: "দাতা খুঁজুন →", href: "/donors" },
  },
  {
    keys: ["দাতা হব", "রেজিস্ট্রি", "যুক্ত হব", "নিবন্ধন", "register", "become", "join", "sign up"],
    answer:
      "রক্তদাতা হতে 'রক্তদাতা হোন' ফর্মে নাম, মোবাইল, গ্রুপ ও এলাকা দিন। আবেদনের পর অ্যাডমিন যাচাই করে অনুমোদন করলে আপনার নাম লাইভ তালিকায় যুক্ত হবে। সম্পূর্ণ ফ্রি।",
    cta: { label: "রক্তদাতা হোন →", href: "/become-donor" },
  },
  {
    keys: ["মেলে", "সামঞ্জস্য", "কাকে দিতে", "কার কাছ থেকে", "compatible", "match group", "গ্রুপ মিল"],
    answer:
      "ভুল গ্রুপের রক্ত প্রাণঘাতী হতে পারে। O- Universal Donor, AB+ Universal Recipient। হোম পেজের 'রক্ত সামঞ্জস্যতা' চেকারে আপনার গ্রুপ বেছে কাকে দিতে/কার কাছ থেকে নিতে পারবেন দেখুন।",
    cta: { label: "সামঞ্জস্যতা দেখুন →", href: "/" },
  },
  {
    keys: ["যোগাযোগ", "ফোন", "নম্বর", "মেইল", "contact", "phone", "email", "call"],
    answer:
      "📞 ফোন/WhatsApp: 01626224878\n✉️ ইমেইল: shantichakrabloodsociety@gmail.com\n📘 Facebook গ্রুপেও যোগ দিন।",
    cta: { label: "যোগাযোগ পেজ →", href: "/contact" },
  },
  {
    keys: ["কী", "কি এটা", "কে", "সংগঠন", "about", "shantichakra", "শান্তিচক্র", "পরিচয়"],
    answer:
      "শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ — একটি স্বেচ্ছাসেবী রক্তদান সংগঠন। সিলেট বিভাগের চার জেলায় (সুনামগঞ্জ, সিলেট, হবিগঞ্জ, মৌলভীবাজার) কাজ করছে, পরবর্তী লক্ষ্য সারা বাংলাদেশ।",
    cta: { label: "আমাদের সম্পর্কে →", href: "/about" },
  },
  {
    keys: ["টাকা", "দাম", "ফ্রি", "খরচ", "মূল্য", "price", "cost", "free", "money"],
    answer: "সম্পূর্ণ ফ্রি ও স্বেচ্ছাসেবী। এই প্ল্যাটফর্মে কোনো আর্থিক লেনদেন নেই।",
  },
  {
    keys: ["কখন", "সময়", "খোলা", "when", "hours", "open"],
    answer: "২৪/৭ — যেকোনো সময় রক্তের অনুরোধ করুন বা দাতা খুঁজুন। আমরা থামি না।",
  },
];

const reply = (q: string): Msg => {
  const t = q.toLowerCase();
  let best: { score: number; entry: (typeof KB)[number] } | null = null;
  for (const entry of KB) {
    const score = entry.keys.reduce((s, k) => (t.includes(k.toLowerCase()) ? s + 1 : s), 0);
    if (score > 0 && (!best || score > best.score)) best = { score, entry };
  }
  const e = best?.entry;
  if (e) return { from: "bot", text: e.answer, cta: e.cta };
  return {
    from: "bot",
    text:
      "আমি শান্তিচক্র ব্লাড সোসাইটির সহকারী। আমি রক্ত খোঁজা, অনুরোধ করা, রক্তদাতা হওয়া বা যোগাযোগে সাহায্য করতে পারি। নিচের অপশনগুলো বেছে নিন বা প্রশ্ন লিখুন।",
  };
};

const SUGGESTIONS = ["🩸 রক্ত লাগবে", "🔎 দাতা খুঁজুন", "➕ রক্তদাতা হব", "📞 যোগাযোগ"];

export default function AIAssistant() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "আসসালামু আলাইকুম! 👋 আমি শান্তিচক্র ব্লাড সোসাইটির সহকারী। রক্ত লাগলে বা কোনো প্রশ্ন থাকলে বলুন।" },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMsgs((m) => [...m, { from: "user", text: q }, reply(q)]);
    setInput("");
  };

  return (
    <>
      {/* floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="সহকারী"
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

      {/* chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-[55] flex h-[28rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl sm:right-6">
          <div className="flex items-center gap-3 bg-gradient-to-r from-brand-700 to-brand-600 px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">🩸</span>
            <div>
              <p className="text-sm font-bold leading-tight">শান্তিচক্র সহকারী</p>
              <p className="text-[10px] text-brand-100/80">সাধারণ প্রশ্নে সাহায্যকারী</p>
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
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="আপনার প্রশ্ন লিখুন…" className="input !py-2 text-sm" />
              <button type="submit" aria-label="পাঠান" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white hover:bg-brand-700">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
