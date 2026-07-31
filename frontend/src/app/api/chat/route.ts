import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are "Shanti" (শান্তি), the friendly, empathetic AI assistant for "শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ" (Shantichakra Blood Society, Sunamganj). Your name is Shanti (শান্তি). When asked who you are, introduce yourself warmly: "আমি শান্তি, শান্তিচক্র ব্লাড সোসাইটির AI সহকারী।"

Reply in BANGLA by default. Switch to English ONLY if the user writes in English. Be warm, empathetic, encouraging and practical. Use 1-2 emojis per message but stay professional. Keep replies 2-5 sentences unless the user asks for details.

=== ABOUT THE ORGANIZATION ===
- Full name: শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ (Shantichakra Blood Society, Sunamganj)
- Founded: 2024. A voluntary, non-profit blood donation network.
- Active across ALL 4 districts of Sylhet Division: Sunamganj, Sylhet, Habiganj, Moulvibazar. 24/7 service.
- Next goal: expand to all 64 districts of Bangladesh.
- 100% free — no money involved in blood donation coordination.
- President: আবু সালেহ (Abu Saleh). General Secretary: রাহাত আহমেদ (Rahat Ahmed).
- Website developer: Rahat Ahmed.

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

// --- Gemini (Google Generative Language API) ---
async function gemini(history: { role: string; content: string }[], key: string, model: string) {
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
  const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("").trim() ?? "";
  if (!text) throw new Error("gemini:empty");
  return text;
}

// --- OpenAI Chat Completions ---
async function openai(history: { role: string; content: string }[], key: string) {
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
  const text = data?.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) throw new Error("openai:empty");
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const history = sanitize(await req.json());
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    // Try Gemini first, then OpenAI, then signal no provider (client falls back to local)
    if (geminiKey) {
      try {
        return NextResponse.json({ reply: await gemini(history, geminiKey, geminiModel) });
      } catch (e) {
        if (!openaiKey) return NextResponse.json({ error: "gemini_failed", detail: String((e as Error).message) }, { status: 502 });
      }
    }
    if (openaiKey) {
      try {
        return NextResponse.json({ reply: await openai(history, openaiKey) });
      } catch (e) {
        return NextResponse.json({ error: "openai_failed", detail: String((e as Error).message) }, { status: 502 });
      }
    }
    return NextResponse.json({ error: "no_key" }, { status: 503 });
  } catch (e: any) {
    return NextResponse.json({ error: "server", detail: String(e?.message ?? e) }, { status: 500 });
  }
}
