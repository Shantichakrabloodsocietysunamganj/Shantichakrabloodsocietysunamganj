"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { exportCSV } from "@/lib/csv";
import type { BloodRequest, Donor } from "@/lib/types";
import { site } from "@/data/site";

export default function AdminReportsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin") { setReady(true); return; }
    setAuthed(true);
    const [d, r] = await Promise.all([
      supabase.from("donors").select("*"),
      supabase.from("blood_requests").select("*").order("created_at", { ascending: false }),
    ]);
    setDonors((d.data as Donor[]) ?? []);
    setRequests((r.data as BloodRequest[]) ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed) return <div className="container-page py-20 text-center"><p className="text-3xl">🛡️</p><p className="mt-2 font-medium text-ink">শুধু অ্যাডমিনদের জন্য।</p><Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link></div>;

  const completed = requests.filter((r) => (r as any).status === "completed").length;

  return (
    <div className="container-page py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">📊 রিপোর্ট</h1>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
          <button onClick={() => exportCSV("donors.csv", donors)} className="btn-outline !py-2 text-xs">দাতা CSV</button>
          <button onClick={() => exportCSV("blood-requests.csv", requests)} className="btn-outline !py-2 text-xs">অনুরোধ CSV</button>
          <button onClick={() => window.print()} className="btn-primary !py-2 text-xs">🖨️ PDF হিসেবে সেভ করুন</button>
        </div>
      </header>

      <div className="card p-8">
        <div className="border-b border-zinc-100 pb-4 text-center">
          <h2 className="text-2xl font-extrabold text-brand-700">{site.name}</h2>
          <p className="text-sm text-ink/60">সারসংক্ষেপ রিপোর্ট • {new Date().toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Box label="মোট রক্তদাতা" value={donors.length} />
          <Box label="মোট অনুরোধ" value={requests.length} />
          <Box label="সম্পন্ন অনুরোধ" value={completed} />
          <Box label="মোট বাঁচানো জীবন" value={completed} suffix="+" />
        </div>

        <div className="mt-8">
          <h3 className="mb-2 font-bold text-ink">রক্তের গ্রুপ অনুযায়ী দাতা</h3>
          <table className="w-full border-collapse text-sm">
            <thead><tr className="bg-canvas text-left"><th className="border border-zinc-200 p-2">গ্রুপ</th><th className="border border-zinc-200 p-2">সংখ্যা</th></tr></thead>
            <tbody>
              {Object.entries(donors.reduce((m, d) => { m[d.blood_group] = (m[d.blood_group] ?? 0) + 1; return m; }, {} as Record<string, number>))
                .sort((a, b) => (b[1] as number) - (a[1] as number))
                .map(([g, c]) => (
                  <tr key={g}><td className="border border-zinc-200 p-2 font-medium">{g}</td><td className="border border-zinc-200 p-2">{c as number}</td></tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <h3 className="mb-2 font-bold text-ink">সাম্প্রতিক অনুরোধ (সর্বোচ্চ ১০)</h3>
          <table className="w-full border-collapse text-sm">
            <thead><tr className="bg-canvas text-left"><th className="border border-zinc-200 p-2">রোগী</th><th className="border border-zinc-200 p-2">গ্রুপ</th><th className="border border-zinc-200 p-2">হাসপাতাল</th><th className="border border-zinc-200 p-2">স্ট্যাটাস</th></tr></thead>
            <tbody>
              {requests.slice(0, 10).map((r) => (
                <tr key={r.id}><td className="border border-zinc-200 p-2">{r.patient_name}</td><td className="border border-zinc-200 p-2">{r.blood_group}</td><td className="border border-zinc-200 p-2">{r.hospital}</td><td className="border border-zinc-200 p-2">{(r as any).status ?? "pending"}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Box({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-xl border border-zinc-100 bg-canvas p-4 text-center">
      <p className="text-2xl font-extrabold text-brand-700">{value.toLocaleString("bn-BD")}{suffix}</p>
      <p className="text-xs text-ink/60">{label}</p>
    </div>
  );
}
