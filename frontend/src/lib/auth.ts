// সার্ভার কম্পোনেন্ট থেকে বর্তমান ইউজার ও প্রোফাইল আনার হেল্পার
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import { isAdminRole, isStaffRole } from "@/lib/roles";

export type SessionUser = {
  user: User | null;
  profile: { id: string; role: string; full_name: string | null; phone: string | null; avatar_url: string | null } | null;
};

export async function getSession(): Promise<SessionUser> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name, phone, avatar_url")
    .eq("id", user.id)
    .single();

  return { user, profile };
}

/** Require the strictly-admin role (settings, users, role management). */
export async function requireAdmin() {
  const session = await getSession();
  return isAdminRole(session.profile?.role) ? session : null;
}

/** Require staff (admin OR moderator) — blood-content management. */
export async function requireStaff() {
  const session = await getSession();
  return isStaffRole(session.profile?.role) ? session : null;
}
