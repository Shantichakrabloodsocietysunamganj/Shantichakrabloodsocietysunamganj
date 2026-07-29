import { createClient } from "@/lib/supabase/client";

// ক্লায়েন্ট থেকে অ্যাডমিন কার্যকলাপ লগ করা (best-effort, error উপেক্ষা করে)
export async function logActivity(action: string, detail?: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: prof } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user?.id ?? "")
      .single();
    await supabase.from("activity_logs").insert({
      actor: prof?.full_name ?? user?.email ?? "অজানা",
      action,
      detail: detail ?? null,
    });
  } catch {
    // logging ব্যর্থ হলেও মূল কাজ ব্যাহত না হয়
  }
}
