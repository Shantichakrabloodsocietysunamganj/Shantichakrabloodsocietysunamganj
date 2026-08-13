import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getClientIp, hashIp } from "@/lib/ip";
import { toBdE164, toWhatsAppNumber } from "@/lib/phone";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const channel = request.nextUrl.searchParams.get("channel");

  if (!UUID_RE.test(params.id) || !["call", "whatsapp"].includes(channel ?? "")) {
    return NextResponse.json({ error: "Invalid contact request" }, { status: 400 });
  }

  const ip = getClientIp(request);
  const ipHash = hashIp(ip, process.env.CONTACT_RATE_LIMIT_SALT ?? "request-contact");

  const supabase = createClient();
  const { data: phone, error } = await supabase.rpc("get_request_contact", {
    p_request_id: params.id,
    p_channel: channel,
    p_ip_hash: ipHash,
  });

  if (error || typeof phone !== "string" || phone.length === 0) {
    const status = error?.code === "42900" ? 429 : 404;
    return NextResponse.json({ error: "Unable to contact requester" }, { status });
  }

  const destination =
    channel === "whatsapp"
      ? (() => {
          const wa = toWhatsAppNumber(phone);
          return wa ? `https://wa.me/${wa}` : null;
        })()
      : (() => {
          const e164 = toBdE164(phone);
          return e164 ? `tel:${e164}` : null;
        })();

  if (!destination) {
    return NextResponse.json({ error: "Unable to contact requester" }, { status: 400 });
  }

  return NextResponse.redirect(destination, 302);
}
