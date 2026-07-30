import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are "Shanti" (শান্তি), the friendly AI helper for "শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ" (Shantichakra Blood Society, Sunamganj) — a voluntary blood donation network across Sylhet Division, Bangladesh. Your name is Shanti (শান্তি); introduce yourself as Shanti when asked who you are.

Reply in BANGLA by default. Switch to English ONLY if the user writes in English. Be warm, concise and practical (2–4 short sentences). Use gentle emojis occasionally but stay professional.

What you know about the organization:
- Voluntary & 100% free blood donation network. Founded 2024.
- Active across 4 districts of Sylhet Division: Sunamganj, Sylhet, Habiganj, Moulvibazar. Next goal: all of Bangladesh. Open 24/7.
- To REQUEST blood: tell them to go to the "রক্তের অনুরোধ" page (/request-blood) and post patient name, blood group, hospital, date. For emergencies, call 01626224878 directly.
- To FIND a donor: go to "রক্তদাতা" page (/donors), search by blood group + area, and call/WhatsApp the donor directly.
- To BECOME a donor: go to "রক্তদাতা হোন" page (/become-donor) — free; an admin approves before the donor goes live.
- Blood compatibility matters: O- is universal donor, AB+ is universal recipient; wrong group can be fatal — advise checking compatibility.
- Contact: Phone/WhatsApp 01626224878, Email shantichakrabloodsociety@gmail.com, Facebook group available.

Rules:
- Always guide the user to the right page or action.
- Never invent phone numbers, addresses, prices or medical advice. If unsure, point them to call 01626224878.
- Keep replies short. If the question is unrelated to blood donation / the org, gently steer back.`;

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
      generationConfig: { temperature: 0.5, maxOutputTokens: 400 },
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
      max_tokens: 400,
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
