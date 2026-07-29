// ডেটাবেস টাইপ (Supabase schema-র সাথে মিল রাখে)

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
  created_at: string;
};

export type NewDonor = Omit<Donor, "id" | "created_at" | "district"> & {
  district?: string;
};

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
  request_type?: string;
  status: "pending" | "approved" | "completed" | "cancelled";
  requested_by?: string | null;
  created_at: string;
};

export type NewBloodRequest = Omit<BloodRequest, "id" | "created_at" | "district" | "status"> & {
  district?: string;
  status?: BloodRequest["status"];
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  created_at: string;
};
