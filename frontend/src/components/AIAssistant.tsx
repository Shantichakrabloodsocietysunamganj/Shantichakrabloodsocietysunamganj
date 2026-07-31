"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Msg = { from: "bot" | "user"; text: string; cta?: { label: string; href: string }; time: number };
type Entry = { keys: string[]; bn: string; en: string; cta?: { bn: string; en: string; href: string }; followUp?: string[] };

const SHORTCUTS: Record<string, string> = {
  "/donors": "/donors", "/donor": "/donors",
  "/request": "/request-blood", "/blood": "/request-blood",
  "/donate": "/donate", "/support": "/donate",
  "/contact": "/contact", "/call": "/contact",
  "/impact": "/impact", "/stats": "/impact",
  "/about": "/about", "/media": "/media",
  "/events": "/events", "/blog": "/blog",
  "/volunteer": "/volunteer",
};

const FOLLOWUPS: Record<string, string[]> = {
  request: ["🔎 দাতা খুঁজুন", "📞 যোগাযোগ", "🩸 রক্তদাতা হব"],
  donor: ["🩸 রক্তদাতা হব", "📞 যোগাযোগ", "📊 আমাদের অর্জন"],
  become: ["📞 যোগাযোগ", "🔎 দাতা খুঁজুন", "📊 আমাদের অর্জন"],
  contact: ["🩸 রক্তদাতা হব", "🔎 দাতা খুঁজুন", "🚨 রক্ত লাগবে"],
  about: ["📊 আমাদের অর্জন", "🔊 শান্তির ভয়েস", "📰 মিডিয়া", "📅 কর্মসূচি"],
  donate: ["📞 যোগাযোগ", "🙋 স্বেচ্ছাসেবক", "📊 আমাদের অর্জন"],
  default: ["🩸 রক্ত লাগবে", "🔎 দাতা খুঁজুন", "🩸 রক্তদাতা হব", "🔊 শান্তির ভয়েস", "📞 যোগাযোগ", "📊 আমাদের অর্জন"],
};

const KB: Entry[] = [
  { keys: ["ভয়েস", "voice", "কথা বলো", "শব্দ", "মহিলা ভয়েস", "নবনীতা", "তনিশা", "উচ্চারণ", "audio", "শুনব", "মেয়েদের ভয়েস", "শান্তির ভয়েস", "shanti's voice"],
    bn: "🔊 আমার ভয়েস শুনতে যেকোনো মেসেজের নিচে 'শুনুন' বাটনে চাপ দিন। আমি বাংলাদেশি উচ্চারণে (bn-BD) Microsoft নবনীতা / তনিশা টাইপ সেরা মহিলা ভয়েসে কথা বলি!",
    en: "🔊 To listen to my voice, click the 'Listen' button under any message. I speak in a natural female Bangladeshi Bengali voice!",
    followUp: ["about"] },
  { keys: ["রক্ত লাগ", "রকত লাগ", "জরুরি", "রক্ত দরকার", "blood", "need", "emergency", "urgent", "প্রয়োজন", "মুমূর্ষু"],
    bn: "🚨 জরুরি রক্ত? দ্রুত করুন:\n১) কল: 01626224878\n২) /request-blood-এ অনুরোধ পোস্ট করুন\n৩) /donors-এ দাতা খুঁজে কল করুন\n২৪/৭ আমরা পাশে আছি।",
    en: "🚨 Urgent blood?\n1) Call: 01626224878\n2) Post on /request-blood\n3) Search /donors and call\nWe are here 24/7.",
    cta: { bn: "রক্তের অনুরোধ →", en: "Request blood →", href: "/request-blood" }, followUp: ["request"] },
  { keys: ["দাতা খুঁজ", "দাতা লাগ", "সার্চ", "find donor", "search", "where"],
    bn: "গ্রুপ + জেলা + উপজেলা দিয়ে প্রস্তুত দাতা খুঁজুন। সরাসরি কল/WhatsApp করা যায়। দাতা কার্ডে ৯০-দিন eligibility স্বয়ংক্রিয়ভাবে দেখায়।",
    en: "Search donors by group + district + upazila. Call or WhatsApp directly. 90-day eligibility auto-calculated.",
    cta: { bn: "দাতা খুঁজুন →", en: "Find donors →", href: "/donors" }, followUp: ["donor"] },
  { keys: ["দাতা হব", "রেজিস্ট্রি", "যুক্ত হব", "নিবন্ধন", "register", "become", "join"],
    bn: "/become-donor ফর্মে নাম, মোবাইল, গ্রুপ ও এলাকা দিন। সম্পূর্ণ ফ্রি। সরাসরি live হবেন (admin approval লাগে না)। ৯০ দিন পর স্বয়ংক্রিয় 'প্রস্তুত'।",
    en: "Fill /become-donor form — name, phone, group, area. Free. Live immediately. Auto-eligible after 90 days.",
    cta: { bn: "রক্তদাতা হোন →", en: "Become a donor →", href: "/become-donor" }, followUp: ["become"] },
  { keys: ["যোগাযোগ", "ফোন", "নম্বর", "মেইল", "contact", "phone", "email", "call"],
    bn: "📞 01626224878\n✉️ shantichakrabloodsociety@gmail.com\nসভাপতি: আবু সালেহ | সাঃসঃ: রাহাত আহমেদ",
    en: "Phone: 01626224878\nEmail: shantichakrabloodsociety@gmail.com",
    cta: { bn: "যোগাযোগ →", en: "Contact →", href: "/contact" }, followUp: ["contact"] },
  { keys: ["টাকা", "দান", "ডোনেশন", "সাহায্য করব", "donate", "support", "contribute"],
    bn: "আমাদের মিশনে সহযোগিতা করুন! হোমপেজে 'Support Our Mission' সেকশনে bKash/Nagad/Rocket/Bank আছে।",
    en: "Support our mission! Homepage has bKash/Nagad/Rocket/Bank options.", followUp: ["donate"] },
  { keys: ["কী", "কি এটা", "কে", "সংগঠন", "about", "shantichakra", "পরিচয়", "what"],
    bn: "শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ — ২০২৪ সালে প্রতিষ্ঠিত স্বেচ্ছাসেবী রক্তদান নেটওয়ার্ক। সিলেটের ৪ জেলায় সক্রিয়। সম্পূর্ণ ফ্রি, ২৪/৭।",
    en: "Shantichakra Blood Society, Sunamganj — voluntary blood network since 2024. Active in 4 Sylhet districts. 100% free, 24/7.",
    cta: { bn: "সম্পর্কে →", en: "About →", href: "/about" }, followUp: ["about"] },
  { keys: ["উন্নতি", "অর্জন", "পরিসংখ্যান", "impact", "stats", "কত জন"],
    bn: "/impact পেজে দেখুন — মোট দাতা, সাহায্যপ্রাপ্ত রোগী, রক্ত ইউনিট, স্বেচ্ছাসেবক। সম্পূর্ণ স্বচ্ছ।",
    en: "Check /impact — donors, patients helped, blood units, volunteers.", cta: { bn: "অর্জন →", en: "Impact →", href: "/impact" } },
  { keys: ["ফ্রি", "খরচ", "মূল্য", "price", "cost", "free"],
    bn: "সম্পূর্ণ ফ্রি ও স্বেচ্ছাসেবী। কোনো টাকা লাগে না।", en: "100% free and voluntary." },
];

function useLang(): "bn" | "en" {
  const [lang, setLang] = useState<"bn" | "en">("bn");
  useEffect(() => { const m = document.cookie.match(/lang=(\w+)/); setLang(m && m[1] === "en" ? "en" : "bn"); }, []);
  return lang;
}

function fmtTime(ts: number) {
  return new Date(ts).toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" });
}

export default function AIAssistant() {
  const router = useRouter();
  const lang = useLang();
  const en = lang === "en";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [followUp, setFollowUp] = useState<string[]>(FOLLOWUPS.default);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [activeVoiceName, setActiveVoiceName] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const recogRef = useRef<any>(null);
  const speakRef = useRef<number | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const greet: Msg = {
    from: "bot",
    text: en ? "Assalamu Alaikum! 👋 I'm Shanti 🤖, your AI helper. Need blood, find a donor, or have a question? I'm always here. Type / for shortcuts." : "আসসালামু আলাইকুম! 👋 আমি শান্তি 🤖 — আপনার AI সহকারী। রক্ত লাগলে, দাতা খুঁজতে, বা যেকোনো প্রশ্নে আমি সবসময় পাশে আছি। শর্টকাট: / দিয়ে শুরু করুন।",
    time: Date.now(),
  };
  const [msgs, setMsgs] = useState<Msg[]>([greet]);

  // Persist chat
  useEffect(() => {
    try { const s = localStorage.getItem("shanti-chat"); if (s) { const p = JSON.parse(s); if (Array.isArray(p) && p.length) setMsgs(p); } } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem("shanti-chat", JSON.stringify(msgs.slice(-20))); } catch {} }, [msgs]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [msgs, open, typing]);
  useEffect(() => { if (!open) window.speechSynthesis?.cancel(); }, [open]);

  // Strip emoji + symbols so TTS doesn't read them aloud; tidy spacing
  const cleanForSpeech = (text: string): string =>
    text
      // Astral-plane chars (all emoji/pictographs) via UTF-16 surrogate pairs
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")
      // BMP symbol ranges: arrows, dingbats, variation selectors
      .replace(/[\u2600-\u27BF\u2190-\u21FF\u2B00-\u2BFF\uFE00-\uFE0F]/g, "")
      .replace(/[→←↑↓]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  // Auto-select the best Female Bengali voice (prioritizing Bangladeshi bn-BD pronunciation, Microsoft Nabanita / Tanisha type neural voices)
  const pickVoice = useCallback((): SpeechSynthesisVoice | undefined => {
    const voices = voicesRef.current;
    if (!voices?.length) return undefined;

    const scoreVoice = (v: SpeechSynthesisVoice): number => {
      const name = (v.name || "").toLowerCase();
      const vLang = (v.lang || "").toLowerCase();
      const uri = (v.voiceURI || "").toLowerCase();
      const combined = `${name} ${vLang} ${uri}`;

      if (en) {
        if (!vLang.startsWith("en") && !combined.includes("english")) return -10000;
        // Penalize male English voices
        if (/guy|christopher|ryan|george|david|mark|wavenet-b|wavenet-d|standard-b|standard-d|neural2-b|neural2-d|\bmale\b/i.test(combined)) {
          return -5000;
        }
        let score = 0;
        if (/samantha|aria|jenny|sonia|natasha|victoria|zira|hazel|susan|google.*us.*english|female/i.test(combined)) score += 1000;
        if (/natural|neural|online|wavenet|google/i.test(combined)) score += 300;
        if (v.default) score += 50;
        return score;
      } else {
        // Bengali mode: female Bengali voice with Bangladeshi (bn-BD) priority
        const isBangla = vLang.startsWith("bn") || combined.includes("bangla") || combined.includes("bengali") || combined.includes("বাংলা");
        if (!isBangla) return -10000;

        // Heavily penalize male Bengali voices (Microsoft Pradeep, Microsoft Bashkar, Wavenet-B/D, male keywords)
        if (/pradeep|bashkar|bhaskar|wavenet-b|wavenet-d|standard-b|standard-d|neural2-b|neural2-d|\bmale\b|পুরুষ|ছেলে/i.test(combined)) {
          return -5000;
        }

        let score = 0;
        // Priority 1: Bangladeshi pronunciation / accent (bn-BD)
        const isBangladeshi = vLang.includes("bn-bd") || vLang.includes("bn_bd") || combined.includes("bangladesh") || combined.includes("বাংলাদেশ") || combined.includes("-bd");
        const isIndianBangla = vLang.includes("bn-in") || vLang.includes("bn_in") || combined.includes("india") || combined.includes("ভারত") || combined.includes("-in");

        if (isBangladeshi) {
          score += 2000; // Highest priority: Bangladeshi accent
        } else if (isIndianBangla) {
          score += 1000; // Second priority: Indian Bengali
        } else {
          score += 500;  // General Bengali
        }

        // Priority 2: Microsoft Nabanita / Tanisha type and top Female Bengali voices
        if (combined.includes("nabanita")) {
          score += 1500; // Microsoft Nabanita Online / Neural (Bangladesh bn-BD Female #1)
        } else if (combined.includes("tanisha")) {
          score += 1200; // Microsoft Tanisha Online / Neural (India bn-IN Female #2)
        } else if (/amrita|lekha|sampa|wavenet-a|wavenet-c|neural2-a|neural2-c|standard-a|standard-c|google\s*বাংলা|google.*bengali|female|নারী|মহিলা|মেয়ে/i.test(combined)) {
          score += 800;  // Other high-quality female Bengali voices
        }

        // Priority 3: Natural / Neural / Online engine quality
        if (/natural|neural|online|wavenet|google|azure|edge/i.test(combined)) {
          score += 300;
        }
        if (v.default) score += 50;
        if (v.localService) score += 20;

        return score;
      }
    };

    const sorted = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    const best = sorted[0];
    if (best && scoreVoice(best) > -5000) {
      return best;
    }
    // Fallback: first bn voice or default
    return voices.find((v) => (en ? v.lang?.toLowerCase().startsWith("en") : v.lang?.toLowerCase().startsWith("bn"))) ?? voices[0];
  }, [en]);

  // Load available TTS voices (async on most browsers)
  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis?.getVoices?.() ?? [];
      if (v.length) {
        voicesRef.current = v;
        const defaultVoice = pickVoice();
        if (defaultVoice?.name) setActiveVoiceName(defaultVoice.name);
      }
    };
    load();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.addEventListener("voiceschanged", load);
      return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
    }
  }, [en, pickVoice]);

  const localReply = (q: string): Msg => {
    const t = q.toLowerCase();
    if (/^(hi|hello|hey|hii|hy|salam|salaam|assalam|namaskar|নমস্কার|হাই|সালাম|হ্যালো|হেলো|কেমন আছ)/.test(t))
      return { from: "bot", text: en ? "Walaikum Assalam! 😊 How can I help? Need blood, find a donor, or become one?" : "ওয়ালাইকুম আসসালাম! 😊 বলুন — রক্ত লাগবে, দাতা খুঁজবেন, নাকি রক্তদাতা হবেন?", time: Date.now() };
    if (/(ধন্যবাদ|থ্যাংকস|thank|thnx|tnx|thanks)/.test(t))
      return { from: "bot", text: en ? "You're welcome! 🤍 Donate blood, save lives." : "আপনাকেও ধন্যবাদ! 🤍 রক্ত দিন, জীবন বাঁচান।", time: Date.now() };
    let best: { score: number; entry: Entry } | null = null;
    for (const entry of KB) { const score = entry.keys.reduce((s, k) => (t.includes(k.toLowerCase()) ? s + 1 : s), 0); if (score > 0 && (!best || score > best.score)) best = { score, entry }; }
    const e = best?.entry;
    const msg: Msg = e
      ? { from: "bot", text: en ? e.en : e.bn, cta: e.cta ? { label: en ? e.cta.en : e.cta.bn, href: e.cta.href } : undefined, time: Date.now() }
      : { from: "bot", text: en ? "I can help with blood requests, finding donors, registration, donations, and more. Type / for shortcuts or ask me anything!" : "আমি রক্ত চাওয়া, দাতা খোঁজা, নিবন্ধন, ডোনেশন ইত্যাদিতে সাহায্য করি। / দিয়ে শর্টকাট বা যা খুশি জিজ্ঞাসা করুন!", time: Date.now() };
    if (e?.followUp?.[0]) setFollowUp(FOLLOWUPS[e.followUp[0]] ?? FOLLOWUPS.default); else setFollowUp(FOLLOWUPS.default);
    return msg;
  };

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    // Quick shortcuts
    const sc = SHORTCUTS[q.toLowerCase()];
    if (sc) { setMsgs((m) => [...m, { from: "user", text: q, time: Date.now() }, { from: "bot", text: en ? `Taking you there… →` : `নিয়ে যাচ্ছি… →`, time: Date.now() }]); router.push(sc); return; }
    setMsgs((m) => [...m, { from: "user", text: q, time: Date.now() }]);
    setInput(""); setTyping(true);
    let answer = ""; let cta: Msg["cta"];
    try {
      const history = [...msgs, { from: "user", text: q }].slice(-10).map((m) => ({ role: m.from === "user" ? "user" : "assistant", content: m.text }));
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
      const data = await res.json();
      if (res.ok && data.reply) answer = data.reply; else { const fb = localReply(q); answer = fb.text; cta = fb.cta; }
    } catch { const fb = localReply(q); answer = fb.text; cta = fb.cta; }
    setTyping(false);
    setMsgs((m) => [...m, { from: "bot", text: answer, cta, time: Date.now() }]);
  };

  // Voice input
  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setMsgs((m) => [...m, { from: "bot", text: en ? "Voice input not supported in this browser." : "এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়।", time: Date.now() }]); return; }
    const recog = new SR(); recog.lang = en ? "en-US" : "bn-BD"; recog.interimResults = false;
    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);
    recog.onresult = (e: any) => { const t = e.results[0][0].transcript; setInput(t); };
    recog.start(); recogRef.current = recog;
  };

  // Text-to-speech (using best Female Bengali voice, Bangladeshi bn-BD pronunciation priority)
  const speak = (text: string, idx: number) => {
    window.speechSynthesis?.cancel();
    if (speakRef.current === idx) { speakRef.current = null; setSpeakingIdx(null); return; }
    const cleaned = cleanForSpeech(text);
    if (!cleaned) return;
    const u = new SpeechSynthesisUtterance(cleaned);
    const voice = pickVoice();
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang || (en ? "en-US" : "bn-BD");
      setActiveVoiceName(voice.name || "");
      console.log(`[Shanti AI TTS] Auto-selected female voice: "${voice.name}" (${voice.lang || u.lang})`);
    } else {
      u.lang = en ? "en-US" : "bn-BD";
      console.log(`[Shanti AI TTS] Using browser default voice for lang: ${u.lang}`);
    }
    u.rate = en ? 0.98 : 0.92;     // clear, natural pacing for Bangladeshi pronunciation
    u.pitch = 1.08;                // warm, natural female voice tone
    u.volume = 1;
    u.onend = () => { speakRef.current = null; setSpeakingIdx(null); };
    u.onerror = () => { speakRef.current = null; setSpeakingIdx(null); };
    speakRef.current = idx;
    setSpeakingIdx(idx);
    window.speechSynthesis?.speak(u);
  };

  const clearChat = () => { setMsgs([greet]); setFollowUp(FOLLOWUPS.default); localStorage.removeItem("shanti-chat"); window.speechSynthesis?.cancel(); setSpeakingIdx(null); };
  const SUGGESTIONS = en ? ["🩸 Need blood", "🔎 Find donor", "➕ Become donor", "🔊 Shanti's Voice", "📞 Contact", "📊 Impact"] : ["🩸 রক্ত লাগবে", "🔎 দাতা খুঁজুন", "➕ রক্তদাতা হব", "🔊 শান্তির ভয়েস", "📞 যোগাযোগ", "📊 অর্জন"];

  return (
    <>
      {/* Floating AI button */}
      <div className="group fixed bottom-6 right-6 z-[55] flex items-center">
        <span className="pointer-events-none mr-2 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold text-violet-700 opacity-0 shadow-glow transition-opacity duration-200 group-hover:opacity-100 dark:bg-slate-800 dark:text-violet-300">{en ? "Shanti" : "শান্তি"}</span>
        <button onClick={() => setOpen((v) => !v)} aria-label={en ? "Shanti" : "শান্তি"} className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-brand-600 text-white shadow-[0_14px_34px_-8px_rgba(124,58,237,0.6)] transition-transform hover:scale-105">
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-300 opacity-70" /><span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-fuchsia-400 ring-2 ring-violet-700" /></span>
          <span className="absolute -left-1.5 -top-1.5 rounded-md bg-white px-1 text-[8px] font-extrabold tracking-wide text-fuchsia-600 shadow-sm">AI</span>
          {open ? <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /></svg> : <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l1.6 4.8L18.5 8l-4 3 1.5 5L12 13.5 8 16l1.5-5-4-3 4.9-1.2L12 2z" /></svg>}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-[55] flex h-[30rem] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl sm:right-6">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-violet-700 via-fuchsia-700 to-brand-700 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">🤖</span>
              <div>
                <p className="text-sm font-bold leading-tight">{en ? "Shanti" : "শান্তি"}</p>
                <p className="text-[10px] text-white/60">{en ? "AI Helper • Female Voice (bn-BD) • / for shortcuts" : "AI সহকারী • মহিলা ভয়েস (bn-BD) • / দিয়ে শর্টকাট"}</p>
              </div>
            </div>
            <button onClick={clearChat} aria-label={en ? "New chat" : "নতুন চ্যাট"} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20" title={en ? "Clear chat" : "নতুন চ্যাট"}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path strokeLinecap="round" d="M3 3v5h5" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto bg-canvas/60 p-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm ${m.from === "user" ? "bg-brand-600 text-white" : "bg-white text-ink shadow-soft ring-1 ring-zinc-100"}`}>
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                  {m.cta && (
                    <button onClick={() => { router.push(m.cta!.href); setOpen(false); }} className="mt-2 inline-flex rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 hover:bg-violet-100">{m.cta.label}</button>
                  )}
                  {/* TTS button on bot messages */}
                  {m.from === "bot" && m.text.length > 10 && (
                    <button
                      onClick={() => speak(m.text, i)}
                      title={en ? `Listen (Female Voice: ${activeVoiceName || "Auto-selected bn-BD"})` : `শান্তির মহিলা ভয়েসে শুনুন (${activeVoiceName ? activeVoiceName + " — " : ""}বাংলাদেশি উচ্চারণ নবনীতা/তনিশা টাইপ)`}
                      className={`mt-1.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold transition ${speakingIdx === i ? "animate-pulse bg-fuchsia-100 text-fuchsia-700" : "text-violet-500 hover:bg-violet-50 hover:text-violet-700"}`}
                    >
                      {speakingIdx === i
                        ? (<><span className="flex items-end gap-0.5"><span className="block h-2.5 w-0.5 animate-pulse rounded-full bg-fuchsia-500" /><span className="block h-3.5 w-0.5 animate-pulse rounded-full bg-fuchsia-500" style={{ animationDelay: "0.15s" }} /><span className="block h-2 w-0.5 animate-pulse rounded-full bg-fuchsia-500" style={{ animationDelay: "0.3s" }} /></span> {en ? "Stop" : "থামুন"}</>)
                        : "🔊 " + (en ? "Listen" : "শুনুন")}
                    </button>
                  )}
                </div>
                <span className="mt-0.5 px-1 text-[9px] text-ink/30">{fmtTime(m.time)}</span>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-3 shadow-soft ring-1 ring-zinc-100">
                  {[0, 1, 2].map((d) => (<span key={d} className="h-2 w-2 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: `${d * 0.15}s` }} />))}
                </div>
              </div>
            )}
          </div>

          {/* Follow-up suggestions */}
          <div className="flex flex-wrap gap-1.5 border-t border-zinc-100 bg-white px-2.5 pt-2">
            {(msgs.length <= 1 ? SUGGESTIONS : followUp).map((s) => (
              <button key={s} onClick={() => send(s.replace(/^[^\s]+\s/, ""))} className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-100">{s}</button>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-zinc-100 bg-white p-2.5">
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
              <button type="button" onClick={startVoice} aria-label={en ? "Voice" : "ভয়েস"} className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${listening ? "animate-pulse bg-blood-600 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"}`}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path strokeLinecap="round" d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8" /></svg>
              </button>
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={en ? "Type or / shortcuts…" : "লিখুন বা / শর্টকাট…"} className="input !py-2 text-sm" />
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
