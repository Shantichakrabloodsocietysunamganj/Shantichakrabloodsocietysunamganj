// =============================================================
//  IP hashing helper — hashed IP is used for contact-event rate
//  limiting and abuse logging. Raw IPs are never stored.
// =============================================================

import { createHash } from "crypto";
import type { NextRequest } from "next/server";

export const IP_HASH_SALT_DEFAULT = "shantichakra";

/** Best-effort client IP (first entry of x-forwarded-for). */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** One-way SHA-256 hash of IP + per-feature salt. */
export function hashIp(ip: string, salt: string = IP_HASH_SALT_DEFAULT): string {
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}
