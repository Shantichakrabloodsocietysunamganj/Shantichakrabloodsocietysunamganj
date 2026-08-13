// =============================================================
//  Shared Zod validation schemas (Phase 2)
//
//  Every form (donor registration, blood request, contact, volunteer,
//  newsletter, admin) must use these schemas so frontend and server-side
//  validation can never drift apart.
// =============================================================

import { z } from "zod";
import { BLOOD_GROUPS, GENDERS } from "@/data/constants";
import { isValidBdPhone, normalizeBdPhone } from "@/lib/phone";
import { todayDateOnly } from "@/lib/date";

export const BLOOD_GROUP_ENUM = BLOOD_GROUPS as unknown as [string, ...string[]];
export const GENDER_ENUM = GENDERS as unknown as [string, ...string[]];

/** A Bangladesh mobile number, validated and normalized. */
export const bdPhoneSchema = z
  .string({ required_error: "required" })
  .min(6, "min")
  .refine((v) => isValidBdPhone(v), "invalid_phone")
  .transform((v) => normalizeBdPhone(v)!);

/** Loose phone (optional; e.g. contact form may be empty). */
export const optionalBdPhoneSchema = z
  .string()
  .optional()
  .transform((v) => (v ? normalizeBdPhone(v) : null))
  .nullable();

export const fullNameSchema = z.string().min(2, "min").max(120, "max");
export const emailSchema = z.string().email("invalid").optional().or(z.literal("").transform(() => undefined));
export const ageSchema = z.coerce
  .number()
  .int()
  .min(18)
  .max(60)
  .optional()
  .or(z.literal("").transform(() => undefined));

/** "YYYY-MM-DD" date-only string. */
export const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date")
  .refine((v) => {
    const [, m, d] = v.split("-").map(Number);
    return m >= 1 && m <= 12 && d >= 1 && d <= 31;
  }, "invalid_date");

/** Needed date must be today or later. */
export const neededDateSchema = dateOnlySchema.refine(
  (v) => v >= todayDateOnly(),
  "needed_date_past",
);

export const unitsSchema = z.coerce.number().int().min(1).max(10);

export const bloodGroupSchema = z.enum(BLOOD_GROUP_ENUM);

export const messageSchema = z.string().max(2000).optional().or(z.literal(""));

// ---------------------------------------------------------------
// Full form schemas
// ---------------------------------------------------------------

export const donorSchema = z.object({
  full_name: fullNameSchema,
  phone: bdPhoneSchema,
  blood_group: bloodGroupSchema,
  gender: GENDER_ENUM[0] ? z.enum(GENDER_ENUM).optional().or(z.literal("")) : z.string().optional(),
  age: ageSchema,
  district: z.string().min(1, "required"),
  upazila: z.string().min(1, "required"),
  area: z.string().max(200).optional(),
  last_donation_date: z.string().optional(),
  is_available: z.boolean().default(true),
  notes: z.string().max(1000).optional(),
});

export const bloodRequestSchema = z.object({
  patient_name: fullNameSchema,
  blood_group: bloodGroupSchema,
  units_needed: unitsSchema,
  hospital: z.string().min(2, "min").max(200, "max"),
  district: z.string().min(1, "required"),
  upazila: z.string().min(1, "required"),
  needed_date: neededDateSchema,
  contact_name: fullNameSchema,
  contact_phone: bdPhoneSchema,
  message: z.string().max(2000).optional(),
  hemoglobin: z.string().min(1, "required").max(10),
  patient_age: z.string().optional(),
  patient_gender: z.string().optional(),
  disease: z.string().max(500).optional(),
  blood_component: z.enum(["whole_blood", "platelets", "plasma"]).optional(),
});

export const contactSchema = z.object({
  name: fullNameSchema,
  email: emailSchema,
  phone: optionalBdPhoneSchema,
  message: z.string().min(5, "min").max(2000, "max"),
});

export const volunteerSchema = z.object({
  full_name: fullNameSchema,
  phone: bdPhoneSchema,
  email: emailSchema,
  upazila: z.string().min(1, "required"),
  role: z.string().max(100).optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email("invalid"),
});

/** Collect Zod issues into a simple `{ field: message }` map for forms. */
export function zodErrors(error: z.ZodError): Record<string, string> {
  const errs: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errs[key] = issue.message;
  }
  return errs;
}

export type DonorFormValues = z.input<typeof donorSchema>;
export type BloodRequestFormValues = z.input<typeof bloodRequestSchema>;
export type ContactFormValues = z.input<typeof contactSchema>;
export type VolunteerFormValues = z.input<typeof volunteerSchema>;
