// =============================================================
//  Public data sanitization helpers (Phase 2)
//  Name masking + safe public projection guards.
// =============================================================

import type { BloodRequest, PublicBloodRequest } from "@/lib/types";

/**
 * Mask a person's name for public display:
 *   "আবু সালেহ"       → "আবু স."
 *   "Rahat Ahmed"     → "Rahat A."
 *   single word       → kept as-is (can't shorten further)
 */
export function maskName(name: string | null | undefined): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  const last = parts[parts.length - 1];
  const initial = last.charAt(0).toUpperCase();
  return `${parts[0]} ${initial}.`;
}

/**
 * Strip every sensitive field from a full BloodRequest, returning the safe
 * public projection. Use this before a request object ever touches
 * client storage or a public response.
 */
export function toPublicRequest(req: BloodRequest): PublicBloodRequest {
  return {
    id: req.id,
    patient_name: req.patient_name,
    blood_group: req.blood_group,
    units_needed: req.units_needed,
    hospital: req.hospital,
    district: req.district,
    upazila: req.upazila,
    needed_date: req.needed_date,
    contact_name: req.contact_name,
    message: req.message ?? null,
    blood_component: req.blood_component ?? null,
    request_type: req.request_type,
    status: req.status,
    created_at: req.created_at,
  };
}

/** True if an object has none of the sensitive request keys. */
export function hasNoSensitiveRequestFields(obj: unknown): boolean {
  if (!obj || typeof obj !== "object") return true;
  const sensitive = ["contact_phone", "hemoglobin", "disease", "requested_by", "patient_age", "patient_gender"] as const;
  return sensitive.every((k) => !(k in obj));
}
