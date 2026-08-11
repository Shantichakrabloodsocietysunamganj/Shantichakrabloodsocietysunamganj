import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are "Shanti" (শান্তি), the friendly, empathetic AI assistant for "শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ" (Shantichakra Blood Society, Sunamganj). Your name is Shanti (শান্তি). When asked who you are, introduce yourself warmly: "আমি শান্তি, শান্তিচক্র ব্লাড সোসাইটির AI সহকারী।"

Reply in BANGLA by default. Switch to English ONLY if the user writes in English. Be warm, empathetic, encouraging and practical. Use 1-2 emojis per message but stay professional. Keep replies 2-5 sentences unless the user asks for details.

=== ABOUT THE ORGANIZATION ===
- Full name: শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ (Shantichakra Blood Society, Sunamganj)
- Founded: 2024. A voluntary, non-profit blood donation network.
- Active across ALL 4 districts of Sylhet Division: Sunamganj, Sylhet, Habiganj, Moulvibazar. 24/7 service.
- Next goal: expand to all 64 districts of Bangladesh.
- 100% free — no money involved in blood donation coordination.
- President: আবু সালেহ (Abu Saleh). General Secretary: রাহাত আহমেদ (Rahat Ahmed).
- Website developer: Rahat Ahmed (রাহাত আহমেদ) — student & full-stack web developer from Sunamganj, creator of RahatVerse. His website: https://www.rahatahmed.site/en (portfolio: /en/portfolio, website orders: /en/order).

=== KEY SERVICES (guide users to these) ===
1. REQUEST BLOOD: /request-blood — post patient name, blood group, hemoglobin (required), hospital, date, units. For emergencies, call 01626224878 directly. The form also asks for: patient age, gender, condition/disease, blood component (whole blood/platelets/plasma).
2. FIND DONORS: /donors — search by blood group + district + upazila. Call or WhatsApp donors directly. Donors show availability status: ready or waiting (based on 90-day eligibility rule since last donation).
3. BECOME A DONOR: /become-donor — free registration. Donors go LIVE immediately (no admin approval needed). Just fill name, phone, blood group, area. The system auto-calculates eligibility (90 days / 3 months after last donation).
4. VOLUNTEER: /volunteer — join as a volunteer.
5. CONTACT: /contact — phone 01626224878, email shantichakrabloodsociety@gmail.com, Facebook + WhatsApp groups available.

=== OTHER PAGES ===
- /impact — transparency and impact stats (donors, patients helped, blood units, volunteers)
- /media — media coverage (newspaper articles about the org)
- /events — upcoming and past events (blood donation camps, awareness programs)
- /blog — articles about blood donation
- /gallery — photos from events
- /about — organization info, committee, mission, vision
- /faq — frequently asked questions

=== BLOOD DONATION KNOWLEDGE ===
- Blood groups: A+, A-, B+, B-, AB+, AB-, O+, O-. O- is universal donor, AB+ is universal recipient.
- WRONG blood group transfusion can be FATAL — always verify compatibility.
- After donating blood, a person should wait at least 90 days (3 months) before donating again.
- Hemoglobin (Hb) levels: normal is 13-17 g/dL for men, 12-15 g/dL for women. Below 10 may indicate anemia.
- Blood donation is safe for healthy adults aged 18-60, weighing 45+ kg.
- One unit of blood can save up to 3 lives.

=== DONATION / SUPPORT ===
- The website has a "Support Our Mission" section with bKash/Nagad/Rocket/Bank options.
- Donations help with: emergency coordination, volunteer activities, awareness campaigns, website/technology, blood camps, community outreach.

=== RULES ===
- Always guide the user to the RIGHT page or action. Be proactive — if someone needs blood urgently, emphasize calling 01626224878.
- Never invent phone numbers, addresses, prices, or medical diagnoses. For medical questions, advise consulting a doctor.
- For blood emergencies, prioritize: (1) call 01626224878, (2) post on /request-blood, (3) search /donors.
- If the question is completely unrelated to blood donation or the org, gently bring it back.
- If someone asks about donating money, mention the "Support Our Mission" section and /contact.`;

function sanitize(incoming: any) {
  if (!Array.isArray(incoming?.messages)) return [];
  return incoming.messages
    .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-10)
    .map((m: any) => ({ role: m.role, content: m.content.slice(0, 1000) }));
}

// --- In-memory LRU-ish cache for repeated FAQ questions (last 200 entries) ---
type CacheEntry = { reply: string; ts: number };
const CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours
const CACHE_MAX = 200;

function cacheKey(history: { role: string; content: string }[]): string {
  // Only the last user message matters for cache hit (assistant replies vary a bit by history but first reply is stable)
  const last = [...history].reverse().find((m) => m.role === "user")?.content?.toLowerCase().trim() ?? "";
  return last.slice(0, 200);
}

function cacheGet(k: string): string | null {
  const v = CACHE.get(k);
  if (!v) return null;
  if (Date.now() - v.ts > CACHE_TTL_MS) { CACHE.delete(k); return null; }
  // refresh recency
  CACHE.delete(k); CACHE.set(k, v);
  return v.reply;
}
function cacheSet(k: string, reply: string) {
  if (!k) return;
  if (CACHE.size >= CACHE_MAX) {
    const firstKey = CACHE.keys().next().value;
    if (firstKey) CACHE.delete(firstKey);
  }
  CACHE.set(k, { reply, ts: Date.now() });
}

// --- Per-IP simple rate limiting (best-effort) ---
const RATE = new Map<string, { count: number; ts: number }>();
const RATE_WINDOW_MS = 60_000; // 1 min
const RATE_MAX = 30; // 30 requests / minute / IP
function rateOk(ip: string): boolean {
  const now = Date.now();
  const r = RATE.get(ip);
  if (!r || now - r.ts > RATE_WINDOW_MS) { RATE.set(ip, { count: 1, ts: now }); return true; }
  r.count++;
  return r.count <= RATE_MAX;
}

// --- Gemini streaming ---
async function* geminiStream(history: { role: string; content: string }[], key: string, model: string): AsyncGenerator<string, void, void> {
  const contents = history.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.6, maxOutputTokens: 600 },
    }),
  });
  if (!res.ok || !res.body) throw new Error(`gemini:${res.status}`);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    // SSE: events separated by \n\n, data: lines
    let idx;
    while ((idx = buf.indexOf("\n\n")) !== -1) {
      const event = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      const dataLine = event.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      const json = dataLine.slice(5).trim();
      if (!json || json === "[DONE]") continue;
      try {
        const obj = JSON.parse(json);
        const text = obj?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ?? "";
        if (text) yield text;
      } catch { /* skip malformed */ }
    }
  }
}

// --- OpenAI streaming ---
async function* openaiStream(history: { role: string; content: string }[], key: string): AsyncGenerator<string, void, void> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 600,
      stream: true,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
    }),
  });
  if (!res.ok || !res.body) throw new Error(`openai:${res.status}`);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf("\n\n")) !== -1) {
      const event = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      const dataLine = event.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      const json = dataLine.slice(5).trim();
      if (!json || json === "[DONE]") continue;
      try {
        const obj = JSON.parse(json);
        const delta = obj?.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch { /* skip malformed */ }
    }
  }
}

// --- Non-streaming fallbacks (used when SSE not requested) ---
async function geminiOnce(history: { role: string; content: string }[], key: string, model: string): Promise<string> {
  const contents = history.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.6, maxOutputTokens: 600 },
    }),
  });
  if (!res.ok) throw new Error(`gemini:${res.status}:${await res.text()}`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("").trim() ?? "";
}

async function openaiOnce(history: { role: string; content: string }[], key: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 600,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
    }),
  });
  if (!res.ok) throw new Error(`openai:${res.status}:${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() ?? "";
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (!rateOk(ip)) {
    return new Response(JSON.stringify({ error: "rate_limited" }), { status: 429, headers: { "Content-Type": "application/json" } });
  }

  let body: any;
  try { body = await req.json(); } catch { return new Response("invalid json", { status: 400 }); }

  const history = sanitize(body);
  if (!history.length) return new Response(JSON.stringify({ error: "empty" }), { status: 400, headers: { "Content-Type": "application/json" } });

  const wantsStream = req.headers.get("accept")?.includes("text/event-stream") || body?.stream === true;
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  // Cache hit (only for non-streaming, FAQ-style single-turn last-user-message)
  const ck = cacheKey(history);
  if (!wantsStream) {
    const hit = cacheGet(ck);
    if (hit) return Response.json({ reply: hit, cached: true });
  }

  // ── STREAMING MODE (SSE) ──
  if (wantsStream) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (event: string, data: string) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
        };
        let fullReply = "";
        try {
          let streamGen: AsyncGenerator<string, void, void> | null = null;
          if (geminiKey) {
            try { streamGen = geminiStream(history, geminiKey, geminiModel); }
            catch (e) { send("error", `gemini_failed: ${(e as Error).message}`); controller.close(); return; }
          } else if (openaiKey) {
            try { streamGen = openaiStream(history, openaiKey); }
            catch (e) { send("error", `openai_failed: ${(e as Error).message}`); controller.close(); return; }
          } else {
            send("error", "no_provider"); controller.close(); return;
          }

          if (!streamGen) { controller.close(); return; }

          for await (const chunk of streamGen) {
            fullReply += chunk;
            send("token", JSON.stringify({ t: chunk }));
          }
          if (fullReply) {
            cacheSet(ck, fullReply);
            send("done", JSON.stringify({ reply: fullReply }));
          } else {
            send("error", "empty");
          }
        } catch (e: any) {
          send("error", String(e?.message ?? e));
        } finally {
          controller.close();
        }
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }

  // ── NON-STREAMING MODE (backwards compatible) ──
  if (geminiKey) {
    try {
      const reply = await geminiOnce(history, geminiKey, geminiModel);
      if (reply) { cacheSet(ck, reply); return Response.json({ reply }); }
    } catch (e) {
      if (!openaiKey) return Response.json({ error: "gemini_failed", detail: String((e as Error).message) }, { status: 502 });
    }
  }
  if (openaiKey) {
    try {
      const reply = await openaiOnce(history, openaiKey);
      if (reply) { cacheSet(ck, reply); return Response.json({ reply }); }
    } catch (e) {
      return Response.json({ error: "openai_failed", detail: String((e as Error).message) }, { status: 502 });
    }
  }
  return Response.json({ error: "no_key" }, { status: 503 });
}
