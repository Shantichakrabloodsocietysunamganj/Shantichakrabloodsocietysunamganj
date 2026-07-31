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
  const [voicePanelOpen, setVoicePanelOpen] = useState(false);
  const [pinnedVoice, setPinnedVoice] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const recogRef = useRef<any>(null);
  const speakRef = useRef<number | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const audioRefs = useRef<HTMLAudioElement[]>([]);

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
  useEffect(() => { if (!open) { window.speechSynthesis?.cancel(); audioRefs.current.forEach(a => { a.pause(); a.currentTime = 0; }); audioRefs.current = []; } }, [open]);

  // Strip emoji + symbols so TTS doesn't read them aloud; tidy spacing
  const cleanForSpeech = (text: string): string =>
    text
      // Astral-plane chars (all emoji/pictographs) via UTF-16 surrogate pairs
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")
      // BMP symbol ranges: arrows, dingbats, variation selectors
      .replace(/[\u2600-\u27BF\u2190-\u21FF\u2B00-\u2BFF\uFE00-\uFE0F]/g, "")
      .replace(/[→←↑↓]/g, "")
      .replace(/^[\s,.;:!?।]+/g, "")
      .replace(/\s+/g, " ")
      .trim();

  // Split Bangla text into sentence-sized chunks for natural TTS pacing.
  // Splits at danda (।), period, question/exclamation marks, then commas
  // if still too long. Whitespace is collapsed within a sentence.
  const chunkForTTS = (text: string, maxLen = 180): string[] => {
    if (!text) return [];
    // Normalize line breaks to single space
    const normalized = text.replace(/\s+/g, " ").trim();
    if (normalized.length <= maxLen) return [normalized];

    const out: string[] = [];
    let buf = "";

    const flush = () => {
      const t = buf.trim();
      if (t) out.push(t);
      buf = "";
    };

    // Walk character-by-character so we can split at Bangla danda (।) properly
    for (let i = 0; i < normalized.length; i++) {
      const ch = normalized[i];
      buf += ch;
      const isSentenceEnd = ch === "।" || ch === "." || ch === "?" || ch === "!" || ch === "\n";
      const isClauseEnd = ch === "," || ch === ";" || ch === ":" || ch === "—";
      if (buf.length >= maxLen && (isSentenceEnd || isClauseEnd)) {
        flush();
      } else if (buf.length >= maxLen && i === normalized.length - 1) {
        flush();
      } else if (isSentenceEnd) {
        flush();
      }
    }
    if (buf.trim()) out.push(buf.trim());
    return out;
  };

  // Detect whether a voice is female by name heuristic
  const isFemaleName = (name: string): boolean =>
    /female|woman|zira|sara|hazel|susan|linda|samantha|victoria|karen|moira|fiona|tessa|allison|ava|sophie|helena|paulina|polly|vicki|veena|lekha|shelby|princess|nabanita|tanishaa|tanisha|tanushri|bansuri|ritu|shreya|kajal|piya|tara|mayuri|google\s*বাংলা|মহিলা|নারী|মেয়ে/i.test(name);

  // Auto-select the best Female Bengali voice (prioritizing Bangladeshi bn-BD pronunciation, Microsoft Nabanita / Tanisha type neural voices)
  // Returns { voice, isFemale }
  const pickVoice = useCallback((): { voice: SpeechSynthesisVoice | undefined; isFemale: boolean } => {
    const voices = voicesRef.current;
    if (!voices?.length) return { voice: undefined, isFemale: false };

    // If user has manually pinned a voice, respect it (English mode only —
    // Bangla mode uses Google Translate TTS regardless, since Web Speech bn voices
    // are mostly male on most platforms)
    if (en) {
      try {
        const pinned = typeof window !== "undefined" ? localStorage.getItem("shanti-voice-en") : null;
        if (pinned) {
          const found = voices.find((v) => v.voiceURI === pinned || v.name === pinned);
          if (found) return { voice: found, isFemale: isFemaleName(found.name) };
        }
      } catch { /* ignore */ }
    }

    const scoreVoice = (v: SpeechSynthesisVoice): number => {
      const name = (v.name || "").toLowerCase();
      const vLang = (v.lang || "").toLowerCase();
      const uri = (v.voiceURI || "").toLowerCase();
      const combined = `${name} ${vLang} ${uri}`;

      if (en) {
        if (!vLang.startsWith("en") && !combined.includes("english")) return -10000;
        if (/guy|christopher|ryan|george|david|mark|wavenet-b|wavenet-d|standard-b|standard-d|neural2-b|neural2-d|\bmale\b/i.test(combined)) {
          return -5000;
        }
        let score = 0;
        if (/samantha|aria|jenny|sonia|natasha|victoria|zira|hazel|susan|google.*us.*english|female/i.test(combined)) score += 1000;
        if (/natural|neural|online|wavenet|google/i.test(combined)) score += 300;
        if (v.default) score += 50;
        return score;
      } else {
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
      return { voice: best, isFemale: isFemaleName(best.name) || !/male|guy|pradeep|bashkar|bhaskar|wavenet-b|wavenet-d/i.test(best.name) };
    }
    const fallback = voices.find((v) => (en ? v.lang?.toLowerCase().startsWith("en") : v.lang?.toLowerCase().startsWith("bn"))) ?? voices[0];
    return { voice: fallback, isFemale: fallback ? isFemaleName(fallback.name) : false };
  }, [en]);

  // Load available TTS voices — async on most browsers, retry up to 2s
  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis?.getVoices?.() ?? [];
      if (v.length) {
        voicesRef.current = v;
        const { voice } = pickVoice();
        if (voice?.name) setActiveVoiceName(voice.name);
      }
    };
    // Load pinned voice from localStorage (English mode only)
    try { const p = localStorage.getItem("shanti-voice-en"); if (p) setPinnedVoice(p); } catch { /* ignore */ }
    load();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.addEventListener("voiceschanged", load);
      const t1 = setTimeout(load, 100);
      const t2 = setTimeout(load, 500);
      const t3 = setTimeout(load, 1500);
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", load);
        clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      };
    }
  }, [en, pickVoice]);

  // List of English voices (for the picker dropdown)
  const englishVoices = voicesRef.current.filter((v) => (v.lang || "").toLowerCase().startsWith("en"));
  const pinVoice = (uri: string) => {
    try {
      if (pinnedVoice === uri) {
        localStorage.removeItem("shanti-voice-en");
        setPinnedVoice("");
      } else {
        localStorage.setItem("shanti-voice-en", uri);
        setPinnedVoice(uri);
      }
      // Re-resolve active voice name
      const { voice } = pickVoice();
      if (voice?.name) setActiveVoiceName(voice.name);
    } catch { /* ignore */ }
  };

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

    // Snapshot the *current* msgs before adding the user message — the new user
    // message gets pushed after, so the history we send is what existed plus the
    // new question (same as before, just explicit).
    const userMsg: Msg = { from: "user", text: q, time: Date.now() };
    const botMsg: Msg = { from: "bot", text: "", time: Date.now() };
    setMsgs((m) => [...m, userMsg, botMsg]);
    setInput("");
    setTyping(true);

    const history = [...msgs, userMsg].slice(-10).map((m) => ({ role: m.from === "user" ? "user" : "assistant", content: m.text }));

    // Try streaming first (SSE) so the user sees tokens as they arrive
    let streamed = false;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({ messages: history, stream: true }),
      });
      if (res.ok && res.body && res.headers.get("content-type")?.includes("text/event-stream")) {
        streamed = true;
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        let acc = "";
        // botMsg index = msgs.length + 1 (we just added user + bot)
        // We need to find the bot message we just added and update it.
        setTyping(false);
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          let idx;
          while ((idx = buf.indexOf("\n\n")) !== -1) {
            const event = buf.slice(0, idx);
            buf = buf.slice(idx + 2);
            const lines = event.split("\n");
            const ev = lines.find((l) => l.startsWith("event:"))?.slice(6).trim();
            const dataLine = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
            if (!dataLine) continue;
            if (ev === "token") {
              try {
                const { t } = JSON.parse(dataLine);
                if (typeof t === "string") acc += t;
              } catch { /* skip */ }
            } else if (ev === "error") {
              streamed = false; // fall through to local
              break;
            }
          }
          if (!streamed) break;
          // Update the streaming bot message
          setMsgs((cur) => {
            const next = [...cur];
            // Find the most recent bot message that's empty (the one we just appended)
            for (let i = next.length - 1; i >= 0; i--) {
              if (next[i].from === "bot" && next[i].text === "" && next[i].time === botMsg.time) {
                next[i] = { ...next[i], text: acc };
                break;
              }
            }
            return next;
          });
        }
        // After stream ends, ensure the bot message has the full accumulated text
        if (streamed && acc) {
          setMsgs((cur) => {
            const next = [...cur];
            for (let i = next.length - 1; i >= 0; i--) {
              if (next[i].from === "bot" && next[i].time === botMsg.time) {
                if (!next[i].text) next[i] = { ...next[i], text: acc };
                break;
              }
            }
            return next;
          });
          return;
        }
      }
    } catch { /* fall through to non-streaming */ }

    // Non-streaming fallback
    if (!streamed) {
      let answer = ""; let cta: Msg["cta"];
      try {
        const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
        const data = await res.json();
        if (res.ok && data.reply) answer = data.reply; else { const fb = localReply(q); answer = fb.text; cta = fb.cta; }
      } catch { const fb = localReply(q); answer = fb.text; cta = fb.cta; }
      setTyping(false);
      setMsgs((cur) => {
        const next = [...cur];
        for (let i = next.length - 1; i >= 0; i--) {
          if (next[i].from === "bot" && next[i].time === botMsg.time) {
            next[i] = { ...next[i], text: answer, cta };
            break;
          }
        }
        return next;
      });
    } else {
      setTyping(false);
    }
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

  // Text-to-speech — Google Translate TTS for Bangla (real female voice), Web Speech API for English
  const speak = (text: string, idx: number) => {
    // Stop any ongoing speech/audio
    window.speechSynthesis?.cancel();
    audioRefs.current.forEach(a => { a.pause(); a.currentTime = 0; });
    audioRefs.current = [];
    if (speakRef.current === idx) { speakRef.current = null; setSpeakingIdx(null); return; }

    const cleaned = cleanForSpeech(text);
    if (!cleaned) return;

    speakRef.current = idx;
    setSpeakingIdx(idx);

    // ── BANGLA MODE: Google Translate TTS (real female Bangla voice, works everywhere) ──
    if (!en) {
      // Split text into sentence-sized chunks for Google TTS — splits at
      // Bangla danda (।) and other sentence terminators for natural pacing.
      const chunks = chunkForTTS(cleaned, 180);

      // Create Audio elements for each chunk
      const audioElements: HTMLAudioElement[] = [];
      for (const chunk of chunks) {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=bn&client=tw-ob&q=${encodeURIComponent(chunk)}`;
        audioElements.push(new Audio(url));
      }
      audioRefs.current = audioElements;

      // Play chunks sequentially
      let currentChunk = 0;
      const playNext = () => {
        if (speakRef.current !== idx) return; // stopped
        if (currentChunk >= audioElements.length) {
          speakRef.current = null;
          setSpeakingIdx(null);
          return;
        }
        const audio = audioElements[currentChunk];
        audio.onended = () => { currentChunk++; playNext(); };
        audio.onerror = () => { speakRef.current = null; setSpeakingIdx(null); };
        audio.play().catch(() => { speakRef.current = null; setSpeakingIdx(null); });
      };

      console.log(`[Shanti AI TTS] Bangla mode → Google Translate TTS (female bn), ${chunks.length} chunk(s)`);
      playNext();
      return;
    }

    // ── ENGLISH MODE: Web Speech API (female voice available in most browsers) ──
    const u = new SpeechSynthesisUtterance(cleaned);
    const { voice, isFemale } = pickVoice();
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang || "en-US";
      setActiveVoiceName(voice.name || "");
      console.log(`[Shanti AI TTS] English → Auto-selected voice: "${voice.name}" (${voice.lang || u.lang})`);
    } else {
      u.lang = "en-US";
      console.log(`[Shanti AI TTS] English → Using browser default voice`);
    }
    u.pitch = 1.04;
    u.rate = 0.98;
    u.volume = 1;
    u.onend = () => { speakRef.current = null; setSpeakingIdx(null); };
    u.onerror = () => { speakRef.current = null; setSpeakingIdx(null); };
    window.speechSynthesis?.speak(u);
  };

  const clearChat = () => { setMsgs([greet]); setFollowUp(FOLLOWUPS.default); localStorage.removeItem("shanti-chat"); window.speechSynthesis?.cancel(); audioRefs.current.forEach(a => { a.pause(); a.currentTime = 0; }); audioRefs.current = []; setSpeakingIdx(null); speakRef.current = null; };
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
            <div className="flex items-center gap-1">
              <button onClick={() => setVoicePanelOpen((v) => !v)} aria-label={en ? "Voice settings" : "ভয়েস সেটিংস"} className={`flex h-8 w-8 items-center justify-center rounded-lg text-white transition ${voicePanelOpen ? "bg-white/25" : "bg-white/10 hover:bg-white/20"}`} title={en ? `Voice: ${activeVoiceName || "auto"}` : `ভয়েস: ${activeVoiceName || "অটো"}`}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path strokeLinecap="round" d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" /></svg>
              </button>
              <button onClick={clearChat} aria-label={en ? "New chat" : "নতুন চ্যাট"} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20" title={en ? "Clear chat" : "নতুন চ্যাট"}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path strokeLinecap="round" d="M3 3v5h5" /></svg>
              </button>
            </div>
          </div>

          {/* Voice picker panel (English mode only — Bangla uses Google TTS) */}
          {voicePanelOpen && (
            <div className="max-h-48 overflow-y-auto border-b border-zinc-100 bg-violet-50/60 px-3 py-2 text-xs">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="font-bold text-violet-800">{en ? "🔊 Voice" : "🔊 ভয়েস"}</p>
                <p className="text-[10px] text-zinc-500">{en ? "Bangla: Google female voice" : "বাংলা: Google মহিলা ভয়েস"}</p>
              </div>
              {en ? (
                englishVoices.length === 0 ? (
                  <p className="py-2 text-center text-zinc-400">{en ? "No voices loaded yet…" : "এখনো ভয়েস লোড হচ্ছে…"}</p>
                ) : (
                  <div className="space-y-0.5">
                    {englishVoices.slice(0, 12).map((v) => {
                      const isPinned = pinnedVoice === v.voiceURI || pinnedVoice === v.name;
                      return (
                        <button key={v.voiceURI} onClick={() => pinVoice(v.voiceURI)} className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-left transition ${isPinned ? "bg-fuchsia-200 text-fuchsia-900" : "hover:bg-white text-zinc-700"}`}>
                          <span className="truncate">{isPinned ? "✓ " : ""}{v.name}</span>
                          <span className="ml-2 shrink-0 text-[9px] text-zinc-400">{v.lang}</span>
                        </button>
                      );
                    })}
                    {englishVoices.length > 12 && <p className="pt-1 text-center text-[10px] text-zinc-400">+{englishVoices.length - 12} more…</p>}
                    {pinnedVoice && (
                      <button onClick={() => pinVoice(pinnedVoice)} className="mt-1 w-full rounded-md bg-zinc-200 py-1 text-center text-[10px] text-zinc-600 hover:bg-zinc-300">{en ? "↺ Reset to auto" : "↺ অটোতে ফিরুন"}</button>
                    )}
                  </div>
                )
              ) : (
                <p className="py-1.5 text-center text-zinc-500">{en ? "Voice selection works in English mode." : "বাংলা মোডে Google Translate-এর মহিলা ভয়েস ব্যবহৃত হয়।"}</p>
              )}
            </div>
          )}

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
