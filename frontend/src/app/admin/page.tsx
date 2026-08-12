"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import StatusBadge from "@/components/StatusBadge";
import BloodGroupBadge from "@/components/BloodGroupBadge";
import { GridSkeleton } from "@/components/ui/Skeleton";
import type { BloodRequest, Donor } from "@/lib/types";
import { exportCSV } from "@/lib/csv";
import { logActivity } from "@/lib/activity";
import DonutChart from "@/components/DonutChart";

type Tab = "overview" | "requests" | "donors" | "contacts";

export default function AdminPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState({ donors: 0, requests: 0, pending: 0, contacts: 0, completed: 0, volunteers: 0 });
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);

  // Bulk selection
  const [selectedDonors, setSelectedDonors] = useState<Set<string>>(new Set());
  const [selectedReqs, setSelectedReqs] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin" && prof?.role !== "moderator") { setLoading(false); return; }
    setAuthed(true);
    setRole(prof?.role ?? "");

    const [d, br, c, v] = await Promise.all([
      supabase.from("donors").select("*").is("deleted_at", null).order("approved", { ascending: true }),
      supabase.from("blood_requests").select("*").is("deleted_at", null).order("created_at", { ascending: false }),
      supabase.from("contacts").select("*").order("created_at", { ascending: false }),
      supabase.from("volunteers").select("*", { count: "exact", head: true }),
    ]);
    const reqs = (br.data as BloodRequest[]) ?? [];
    setDonors((d.data as Donor[]) ?? []);
    setRequests(reqs);
    setContacts(c.data ?? []);
    setStats({
      donors: d.data?.length ?? 0,
      requests: reqs.length,
      pending: reqs.filter((r) => ["pending", "approved"].includes((r as any).status)).length,
      contacts: c.data?.length ?? 0,
      completed: reqs.filter((r) => (r as any).status === "completed").length,
      volunteers: v.count ?? 0,
    });
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  async function deleteContact(id: string) {
    await supabase.from("contacts").delete().eq("id", id);
    logActivity("যোগাযোগ বার্তা মুছেছেন");
    load();
  }

  // Bulk operations
  const toggleDonor = (id: string) => {
    setSelectedDonors((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };
  const toggleReq = (id: string) => {
    setSelectedReqs((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };
  const toggleAllDonors = () => {
    setSelectedDonors((prev) => prev.size === donors.length ? new Set() : new Set(donors.map((d) => d.id)));
  };
  const toggleAllReqs = () => {
    setSelectedReqs((prev) => prev.size === requests.length ? new Set() : new Set(requests.map((r) => r.id)));
  };

  async function bulkDeleteDonors() {
    if (selectedDonors.size === 0) return;
    if (!confirm(`${selectedDonors.size} জন দাতা মুছে ফেলবেন?`)) return;
    setBulkBusy(true);
    const ids = Array.from(selectedDonors);
    for (const id of ids) { await supabase.from("donors").update({ deleted_at: new Date().toISOString() }).eq("id", id); }
    logActivity(`${ids.length} জন দাতা bulk delete করেছেন`);
    setSelectedDonors(new Set());
    setBulkBusy(false);
    load();
  }
  async function bulkDeleteReqs() {
    if (selectedReqs.size === 0) return;
    if (!confirm(`${selectedReqs.size} টি অনুরোধ মুছে ফেলবেন?`)) return;
    setBulkBusy(true);
    const ids = Array.from(selectedReqs);
    for (const id of ids) { await supabase.from("blood_requests").update({ deleted_at: new Date().toISOString() }).eq("id", id); }
    logActivity(`${ids.length} টি অনুরোধ bulk delete করেছেন`);
    setSelectedReqs(new Set());
    setBulkBusy(false);
    load();
  }
  if (loading) return <div className="container-page py-12"><GridSkeleton count={2} /></div>;
  if (!authed)
    return (
      <div className="container-page py-20 text-center">
        <p className="text-3xl">🛡️</p>
        <p className="mt-2 font-medium text-ink">এই পেজ শুধু অ্যাডমিনদের জন্য।</p>
        <Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link>
      </div>
    );

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">{role === "admin" ? "🛡️ অ্যাডমিন ড্যাশবোর্ড" : "🔹 মডারেটর ড্যাশবোর্ড"}</h1>
          <p className="text-sm text-ink/60">সমিতির সম্পূর্ণ ব্যবস্থাপনা এক জায়গায়।</p>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="btn-outline">হোমে যান</Link>
          {role === "admin" && <Link href="/admin/settings" className="btn-primary">⚙️ সেটিংস</Link>}
        </div>
      </header>

      <nav className="mb-6 flex flex-wrap gap-2">
        {(["overview", "requests", "donors", "contacts"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${tab === t ? "bg-brand-600 text-white" : "bg-white text-ink/70 ring-1 ring-zinc-200 hover:bg-brand-50"}`}>
            {t === "overview" ? "📊 ওভারভিউ" : t === "requests" ? `📋 অনুরোধ (${requests.length})` : t === "donors" ? `🩸 দাতা (${donors.length})` : `✉️ বার্তা (${contacts.length})`}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard icon="🩸" label="মোট রক্তদাতা" value={stats.donors} color="bg-brand-50 text-brand-600" />
            <StatCard icon="📋" label="মোট অনুরোধ" value={stats.requests} color="bg-amber-50 text-amber-600" />
            <StatCard icon="⏳" label="চলমান অনুরোধ" value={stats.pending} color="bg-blood-50 text-blood-600" />
            <StatCard icon="✅" label="সম্পন্ন" value={stats.completed} color="bg-success-50 text-success-700" />
            <StatCard icon="✉️" label="যোগাযোগ বার্তা" value={stats.contacts} color="bg-violet-50 text-violet-600" />
            <StatCard icon="🙋" label="স্বেচ্ছাসেবক" value={stats.volunteers} color="bg-sky-50 text-sky-600" />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/settings" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">⚙️</span> ওয়েবসাইট সেটিংস</Link>
            <Link href="/admin/events" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">📅</span> ইভেন্ট</Link>
            <Link href="/admin/blog" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">📝</span> ব্লগ</Link>
            <Link href="/admin/testimonials" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">💬</span> Testimonials</Link>
            <Link href="/admin/committee" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">👥</span> কমিটি</Link>
            <Link href="/admin/volunteers" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">🙋</span> স্বেচ্ছাসেবক</Link>
            <Link href="/admin/broadcast" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">🔔</span> নোটিফিকেশন প্রেরণ</Link>
            <Link href="/admin/reports" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">📊</span> রিপোর্ট (PDF/CSV)</Link>
            <Link href="/admin/activity" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">📋</span> অ্যাক্টিভিটি লগ</Link>
            <Link href="/admin/donations" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">🩸</span> রক্তদান রেকর্ড</Link>
            <Link href="/admin/media-coverage" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">📰</span> মিডিয়া কভারেজ</Link>
            <Link href="/admin/donation-methods" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">💳</span> ডোনেশন মেথড</Link>
            <Link href="/admin/media" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">🖼️</span> মিডিয়া লাইব্রেরি</Link>
            <Link href="/admin/faq" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">❓</span> FAQ</Link>
            <Link href="/admin/partners" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">🤝</span> পার্টনার</Link>
            <Link href="/admin/import" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">📥</span> CSV Import</Link>
            <Link href="/admin/trash" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">🗑️</span> ট্র্যাশ</Link>
            <Link href="/admin/users" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">👥</span> User & Roles</Link>
            <Link href="/admin/seo" className="card-hover flex items-center gap-3 p-4 text-sm font-medium text-ink"><span className="text-xl">🔍</span> SEO Settings</Link>
          </div>

          <div className="card mt-6 p-6">
            <h3 className="mb-4 font-semibold text-ink">রক্তের গ্রুপ অনুযায়ী দাতা বিতরণ</h3>
            {(() => {
              const m = new Map<string, number>();
              donors.forEach((d) => m.set(d.blood_group, (m.get(d.blood_group) ?? 0) + 1));
              const data = Array.from(m, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
              return data.length ? <DonutChart data={data} /> : <p className="text-sm text-ink/50">কোনো দাতা নেই।</p>;
            })()}
          </div>
        </>
      )}

      {tab === "requests" && (
        <div className="space-y-3">
          <div className="flex justify-end gap-2">
            <button onClick={() => exportCSV("blood-requests.csv", requests)} className="btn-outline !py-2 text-xs">⬇️ CSV ডাউনলোড</button>
          </div>
          {/* Bulk action bar */}
          {selectedReqs.size > 0 && (
            <div className="flex items-center justify-between rounded-xl bg-brand-50 p-3">
              <span className="text-sm font-medium text-brand-700">{selectedReqs.size} টি নির্বাচিত</span>
              <div className="flex gap-2">
                <button onClick={bulkDeleteReqs} disabled={bulkBusy} className="btn-ghost !py-1.5 text-xs text-blood-600">🗑️ Bulk Delete</button>
              </div>
            </div>
          )}
          {/* Select all */}
          <div className="flex items-center gap-2 px-1">
            <input type="checkbox" checked={selectedReqs.size === requests.length && requests.length > 0} onChange={toggleAllReqs} className="h-4 w-4 rounded border-zinc-300 text-brand-600" />
            <span className="text-sm text-ink/60">সব নির্বাচন করুন</span>
          </div>
          {requests.length === 0 ? <Empty text="কোনো অনুরোধ নেই।" /> : requests.map((r) => (
            <div key={r.id} className={`card p-5 ${selectedReqs.has(r.id) ? "ring-2 ring-brand-300" : ""}`}>
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={selectedReqs.has(r.id)} onChange={() => toggleReq(r.id)} className="mt-1 h-4 w-4 rounded border-zinc-300 text-brand-600" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <BloodGroupBadge group={r.blood_group} />
                      <div>
                        <p className="font-semibold text-ink">{r.patient_name}</p>
                        <p className="text-sm text-ink/60">{r.hospital}, {r.upazila} • {r.units_needed} ইউনিট • 📞 {r.contact_phone}</p>
                      </div>
                    </div>
                    <StatusBadge status={(r as any).status ?? "pending"} />
                  </div>
                  <RequestActions req={r} onChanged={load} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "donors" && (
        <div className="card overflow-hidden">
          {/* Bulk action bar */}
          {selectedDonors.size > 0 && (
            <div className="flex items-center justify-between border-b border-zinc-100 bg-brand-50 p-3">
              <span className="text-sm font-medium text-brand-700">{selectedDonors.size} জন নির্বাচিত</span>
              <button onClick={bulkDeleteDonors} disabled={bulkBusy} className="btn-ghost !py-1.5 text-xs text-blood-600">🗑️ Bulk Delete</button>
            </div>
          )}
          <div className="flex justify-end border-b border-zinc-100 p-3">
            <button onClick={() => exportCSV("donors.csv", donors)} className="btn-outline !py-1.5 text-xs">⬇️ CSV ডাউনলোড</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-canvas text-left text-xs uppercase text-ink/50">
                <tr>
                  <th className="p-3"><input type="checkbox" checked={selectedDonors.size === donors.length && donors.length > 0} onChange={toggleAllDonors} className="h-4 w-4 rounded border-zinc-300 text-brand-600" /></th>
                  <th className="p-3">নাম</th><th className="p-3">গ্রুপ</th><th className="p-3">এলাকা</th><th className="p-3">ফোন</th><th className="p-3">স্ট্যাটাস</th><th className="p-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {donors.map((d) => (
                  <tr key={d.id} className={selectedDonors.has(d.id) ? "bg-brand-50/50" : ""}>
                    <td className="p-3"><input type="checkbox" checked={selectedDonors.has(d.id)} onChange={() => toggleDonor(d.id)} className="h-4 w-4 rounded border-zinc-300 text-brand-600" /></td>
                    <td className="p-3 font-medium text-ink">{d.full_name}{d.is_verified && <span title="verified"> ✓</span>}{!d.approved && <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">⏳ অপেক্ষমাণ</span>}</td>
                    <td className="p-3"><span className="font-semibold">{d.blood_group}</span></td>
                    <td className="p-3 text-ink/60">{d.upazila}</td>
                    <td className="p-3 text-ink/60">{d.phone}</td>
                    <td className="p-3">{d.is_available ? <span className="text-success-700">প্রস্তুত</span> : <span className="text-ink/40">অনুপস্থিত</span>}</td>
                    <td className="p-3 text-right"><DonorActions donor={d} onChanged={load} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "contacts" && (
        <div className="space-y-3">
          {contacts.length === 0 ? <Empty text="কোনো বার্তা নেই।" /> : contacts.map((c) => (
            <div key={c.id} className="card p-5">
              <div className="flex justify-between gap-3">
                <div><p className="font-semibold text-ink">{c.name}</p><p className="text-xs text-ink/50">{c.email} • {c.phone}</p></div>
                <button onClick={() => deleteContact(c.id)} className="btn-ghost !px-2 !py-1 text-xs text-blood-600">✕</button>
              </div>
              <p className="mt-2 text-sm text-ink/70">{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return <div className="card p-5"><div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${color}`}>{icon}</div><p className="mt-3 text-3xl font-extrabold text-ink">{value.toLocaleString("bn-BD")}</p><p className="text-sm text-ink/60">{label}</p></div>;
}
function Empty({ text }: { text: string }) { return <div className="card p-10 text-center text-ink/50">{text}</div>; }

function RequestActions({ req, onChanged }: { req: BloodRequest; onChanged: () => void }) {
  const supabase = createClient();
  const status = (req as any).status ?? "pending";
  async function setStatus(s: string) { await supabase.from("blood_requests").update({ status: s }).eq("id", req.id); logActivity("অনুরোধের স্ট্যাটাস পরিবর্তন", `${req.patient_name} → ${s}`); onChanged(); }
  async function remove() { await supabase.from("blood_requests").update({ deleted_at: new Date().toISOString() }).eq("id", req.id); logActivity("রক্তের অনুরোধ মুছেছেন", req.patient_name); onChanged(); }
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {status !== "completed" && <button onClick={() => setStatus("completed")} className="btn-outline !px-3 !py-1.5 text-xs text-success-700">সম্পন্ন</button>}
      {status !== "cancelled" && <button onClick={() => setStatus("cancelled")} className="btn-ghost !px-3 !py-1.5 text-xs">বাতিল</button>}
      <button onClick={remove} className="btn-ghost !px-3 !py-1.5 text-xs text-blood-600">মুছুন</button>
    </div>
  );
}

function DonorActions({ donor, onChanged }: { donor: Donor; onChanged: () => void }) {
  const supabase = createClient();
  async function toggleApproved() {
    await supabase.from("donors").update({ approved: !donor.approved }).eq("id", donor.id);
    logActivity(donor.approved ? "দাতা অনুমোদন বাতিল করেছেন" : "দাতা অনুমোদন করেছেন", donor.full_name);
    onChanged();
  }
  async function remove() { await supabase.from("donors").update({ deleted_at: new Date().toISOString() }).eq("id", donor.id); logActivity("রক্তদাতা মুছেছেন", donor.full_name); onChanged(); }
  return (
    <div className="flex items-center justify-end gap-1">
      <button onClick={toggleApproved} className={donor.approved ? "btn-ghost !px-2 !py-1 text-xs text-success-700" : "btn-primary !px-2 !py-1 text-xs"}>
        {donor.approved ? "✓ অনুমোদিত" : "অনুমোদন করুন"}
      </button>
      <button onClick={remove} className="btn-ghost !px-2 !py-1 text-xs text-blood-600">✕</button>
    </div>
  );
}
