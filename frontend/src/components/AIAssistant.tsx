"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Msg = { from: "bot" | "user"; text: string; cta?: { label: string; href: string } };
type Entry = { keys: string[]; bn: string; en: string; cta?: { bn: string; en: string; href: string } };

// Local fallback knowledge base (used if no API key or the API fails)
const KB: Entry[] = [
  {
    keys: ["রক্ত লাগ", "রকত লাগ", "জরুরি", "রক্ত দরকার", "blood", "need", "emergency", "urgent", "প্রয়োজন"],
    bn: "জরুরি রক্ত লাগলে 'রক্তের অনুরোধ' পেজে রোগীর নাম, গ্রুপ, হাসপাতাল ও তারিখ দিয়ে অনুরোধ পোস্ট করুন। খুব জরুরি হলে সরাসরি কল করুন: 01626224878।",
    en: "Need blood urgently? Post a request on the 'Request Blood' page with patient name, group, hospital and date. For emergencies call: 01626224878.",
    cta: { bn: "রক্তের অনুরোধ করুন →", en: "Request blood →", href: "/request-blood" },
  },
  {
    keys: ["দাতা খুঁজ", "দাতা লাগ", "দাতা সার্চ", "find donor", "search donor", "where"],
    bn: "রক্তের গ্রুপ, জেলা ও উপজেলা দিয়ে প্রস্তুত দাতা খুঁজে বের করুন। সরাসরি কল বা WhatsApp করা যায়।",
    en: "Search available donors by blood group, district and upazila. Call or WhatsApp any donor directly.",
    cta: { bn: "দাতা খুঁজুন →", en: "Find donors →", href: "/donors" },
  },
  {
    keys: ["দাতা হব", "রেজিস্ট্রি", "যুক্ত হব", "নিবন্ধন", "register", "become", "join"],
    bn: "'রক্তদাতা হোন' ফর্মে নাম, মোবাইল, গ্রুপ ও এলাকা দিন। আবেদনের পর অ্যাডমিন অনুমোদন করলে লাইভ হবে। সম্পূর্ণ ফ্রি।",
    en: "Fill the 'Become a Donor' form with name, phone, group and area. An admin approves it before you go live. Completely free.",
    cta: { bn: "রক্তদাতা হোন →", en: "Become a donor →", href: "/become-donor" },
  },
  {
    keys: ["যোগাযোগ", "ফোন", "নম্বর", "মেইল", "contact", "phone", "email", "call"],
    bn: "📞 ফোন/WhatsApp: 01626224878\n✉️ ইমেইল: shantichakrabloodsociety@gmail.com",
    en: "📞 Phone/WhatsApp: 01626224878\n✉️ Email: shantichakrabloodsociety@gmail.com",
    cta: { bn: "যোগাযোগ পেজ →", en: "Contact page →", href: "/contact" },
  },
  {
    keys: ["কী", "কি এটা", "কে", "সংগঠন", "about", "shantichakra", "শান্তিচক্র", "পরিচয়", "what"],
    bn: "শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ — স্বেচ্ছাসেবী রক্তদান সংগঠন। সিলেট বিভাগের চার জেলায় সক্রিয়, পরবর্তী লক্ষ্য সারা বাংলাদেশ।",
    en: "Shantichakra Blood Society, Sunamganj — a voluntary blood donation org active across all four districts of Sylhet Division. Next: all of Bangladesh.",
    cta: { bn: "আমাদের সম্পর্কে →", en: "About us →", href: "/about" },
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
      ? "Yes! 👋 I'm the Shantichakra Blood Society helper 🤖. Need blood, want to find a donor, or have a question? I'm here to help."
      : "হ্যাঁ জি! 👋 আমি শান্তিচক্র ব্লাড সোসাইটির হেল্পার 🤖। রক্ত লাগলে, দাতা খুঁজতে হলে বা যেকোনো প্রশ্ন থাকলে বলুন — আমি সাহায্য করব।",
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
          {en ? "AI Helper" : "AI হেল্পার"}
        </span>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={en ? "AI Helper" : "AI হেল্পার"}
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
              <p className="text-sm font-bold leading-tight">{en ? "Shantichakra AI Helper" : "শান্তিচক্র AI হেল্পার"}</p>
              <p className="text-[10px] text-white/70">{en ? "Ask anything — blood, donors, contact" : "রক্ত, দাতা, যোগাযোগ — যা খুশি জিজ্ঞাসা করুন"}</p>
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
