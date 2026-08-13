import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const channel = request.nextUrl.searchParams.get("channel");
  if (!/^[0-9a-f-]{36}$/i.test(params.id) || !["call", "whatsapp"].includes(channel ?? "")) {
    return NextResponse.json({ error: "Invalid contact request" }, { status: 400 });
  }

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const ipHash = createHash("sha256").update(`${ip}:${process.env.CONTACT_RATE_LIMIT_SALT ?? "donor-contact"}`).digest("hex");
  const supabase = createClient();
  const { data: phone, error } = await supabase.rpc("get_donor_contact", {
    p_donor_id: params.id,
    p_channel: channel,
    p_ip_hash: ipHash,
  });

  if (error || !phone) {
    const status = error?.code === "42900" ? 429 : error?.code === "P0002" ? 404 : 400;
    return NextResponse.json({ error: error?.message ?? "Unable to contact donor" }, { status });
  }

  const normalized = String(phone).replace(/[^0-9+]/g, "");
  const destination = channel === "whatsapp"
    ? `https://wa.me/88${normalized.replace(/^\+?88|^0/, "")}`
    : `tel:${normalized}`;
  return NextResponse.redirect(destination, 302);
}
