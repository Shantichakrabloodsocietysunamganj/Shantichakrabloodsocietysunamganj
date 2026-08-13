import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const channel = request.nextUrl.searchParams.get("channel");
  if (!/^[0-9a-f-]{36}$/i.test(params.id) || !["call", "whatsapp"].includes(channel ?? "")) {
    return NextResponse.json({ error: "Invalid contact request" }, { status: 400 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const ipHash = createHash("sha256").update(`${ip}:${process.env.CONTACT_RATE_LIMIT_SALT ?? "request-contact"}`).digest("hex");
  const { data: phone, error } = await createClient().rpc("get_request_contact", { p_request_id: params.id, p_channel: channel, p_ip_hash: ipHash });
  if (error || !phone) return NextResponse.json({ error: "Unable to contact requester" }, { status: error?.code === "42900" ? 429 : 404 });
  const normalized = String(phone).replace(/[^0-9+]/g, "");
  const destination = channel === "whatsapp" ? `https://wa.me/88${normalized.replace(/^\+?88|^0/, "")}` : `tel:${normalized}`;
  return NextResponse.redirect(destination, 302);
}
