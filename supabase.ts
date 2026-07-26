import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type UrgencyLevel = 'critical' | 'urgent' | 'normal';
export type Gender = 'male' | 'female' | 'other';
export type DonorAvailability = 'available' | 'temporarily_unavailable';
export type VolunteerAvailability = 'available' | 'part_time' | 'occasional';
export type RequestStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'expired';
export type VolunteerStatus = 'pending' | 'approved' | 'rejected';

export interface BloodRequest {
  id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: Gender;
  blood_group: BloodGroup;
  units_needed: number;
  urgency_level: UrgencyLevel;
  hospital_name: string;
  hospital_address: string;
  required_date: string;
  required_time?: string;
  contact_name: string;
  contact_phone: string;
  message?: string;
  prescription_url?: string;
  blood_report_url?: string;
  status: RequestStatus;
  expires_at: string;
  created_at: string;
}

export interface Donor {
  id: string;
  name: string;
  phone: string;
  blood_group: BloodGroup;
  district: string;
  upazila?: string;
  last_donation_date?: string;
  availability: DonorAvailability;
  created_at: string;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  district: string;
  upazila?: string;
  skills?: string[];
  motivation?: string;
  availability: VolunteerAvailability;
  status: VolunteerStatus;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  venue: string;
  banner_url?: string;
  status: 'draft' | 'published' | 'completed';
  featured: boolean;
  created_at: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  category?: string;
  status: 'draft' | 'published';
  published_at?: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}

// Helper functions
export async function getActiveBloodRequests() {
  const { data, error } = await supabase
    .from('blood_requests')
    .select('*')
    .eq('status', 'active')
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as BloodRequest[];
}

export async function getDonorsByBloodGroup(bloodGroup: BloodGroup) {
  const { data, error } = await supabase
    .from('donors')
    .select('*')
    .eq('blood_group', bloodGroup)
    .eq('availability', 'available');
  
  if (error) throw error;
  return data as Donor[];
}

export async function createBloodRequest(request: Partial<BloodRequest>) {
  const { data, error } = await supabase
    .from('blood_requests')
    .insert([request])
    .select()
    .single();
  
  if (error) throw error;
  return data as BloodRequest;
}

export async function createDonor(donor: Partial<Donor>) {
  const { data, error } = await supabase
    .from('donors')
    .insert([donor])
    .select()
    .single();
  
  if (error) throw error;
  return data as Donor;
}

export async function createVolunteer(volunteer: Partial<Volunteer>) {
  const { data, error } = await supabase
    .from('volunteers')
    .insert([volunteer])
    .select()
    .single();
  
  if (error) throw error;
  return data as Volunteer;
}

export async function getDonorCount() {
  const { count, error } = await supabase
    .from('donors')
    .select('*', { count: 'exact', head: true });
  
  if (error) throw error;
  return count || 0;
}

export async function getActiveRequestCount() {
  const { count, error } = await supabase
    .from('blood_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');
  
  if (error) throw error;
  return count || 0;
}
