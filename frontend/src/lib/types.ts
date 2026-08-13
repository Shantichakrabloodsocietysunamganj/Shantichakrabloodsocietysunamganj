// =============================================================
//  ডেটাবেস টাইপ (Supabase schema-র সাথে মিল রাখে)
//
//  IMPORTANT (Phase 2): sensitive fields (phone, contact_phone, email,
//  notes, area, union_name, disease, hemoglobin, user_id/requested_by, …)
//  must NEVER appear on a public-facing type. Public components use the
//  `Public*` types below, so accidentally reading a sensitive field
//  becomes a TypeScript error.
// =============================================================

// ---------------------------------------------------------------
// Donor
// ---------------------------------------------------------------

/** Full donor row — internal/admin only. Contains sensitive fields. */
export type Donor = {
  id: string;
  user_id: string | null;
  full_name: string;
  phone: string;
  blood_group: string;
  gender: string | null;
  age: number | null;
  district: string;
  upazila: string;
  union_name: string | null;
  area: string | null;
  photo_url: string | null;
  last_donation_date: string | null;
  is_available: boolean;
  is_verified: boolean;
  notes: string | null;
  approved: boolean;
  public_visible?: boolean;
  deleted_at?: string | null;
  created_at: string;
};

/** Safe projection returned by the `public_donors` view. */
export type PublicDonor = {
  id: string;
  full_name: string;
  blood_group: string;
  gender: string | null;
  age: number | null;
  district: string;
  upazila: string;
  photo_url: string | null;
  last_donation_date: string | null;
  is_available: boolean;
  is_verified: boolean;
  approved: boolean;
  created_at: string;
};

export type NewDonor = Omit<Donor, "id" | "created_at" | "district"> & { district?: string };

// ---------------------------------------------------------------
// Blood request
// ---------------------------------------------------------------

/** Full blood request row — internal/admin only. Contains contact_phone etc. */
export type BloodRequest = {
  id: string;
  patient_name: string;
  blood_group: string;
  units_needed: number;
  hospital: string;
  district: string;
  upazila: string;
  needed_date: string;
  contact_name: string;
  contact_phone: string;
  message: string | null;
  hemoglobin: string | null;
  patient_age: number | null;
  patient_gender: string | null;
  disease: string | null;
  blood_component: string | null;
  request_type?: string;
  status: "pending" | "approved" | "completed" | "cancelled";
  requested_by?: string | null;
  deleted_at?: string | null;
  created_at: string;
};

/**
 * Safe projection returned by the `public_blood_requests` view.
 * No contact_phone, hemoglobin, disease, patient_age, patient_gender,
 * or requested_by — those are internal only.
 */
export type PublicBloodRequest = {
  id: string;
  patient_name: string;
  blood_group: string;
  units_needed: number;
  hospital: string;
  district: string;
  upazila: string;
  needed_date: string;
  contact_name: string;
  message: string | null;
  blood_component: string | null;
  request_type?: string;
  status: "pending" | "approved" | "completed" | "cancelled";
  created_at: string;
};

export type NewBloodRequest = Omit<
  BloodRequest,
  "id" | "created_at" | "district" | "status"
> & { district?: string; status?: BloodRequest["status"] };

// ---------------------------------------------------------------
// Misc
// ---------------------------------------------------------------

export type ContactMessage = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  created_at: string;
};

// ---------------------------------------------------------------
// API response types
// ---------------------------------------------------------------

export type ContactChannel = "call" | "whatsapp";

export type ApiError = { error: string };

/** Response of the donor/request contact redirect endpoints. */
export type ContactResponse = ApiError;

/** Response of the upload endpoint. */
export type UploadResponse = { url: string } | ApiError;
