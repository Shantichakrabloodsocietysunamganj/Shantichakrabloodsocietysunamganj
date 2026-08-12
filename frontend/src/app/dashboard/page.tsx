"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import BloodGroupBadge from "@/components/BloodGroupBadge";
import StatusBadge from "@/components/StatusBadge";
import { GridSkeleton } from "@/components/ui/Skeleton";
import { upazilasOf } from "@/data/constants";
import { bnDate, fmtDate, num } from "@/lib/format";
import type { Donor, BloodRequest } from "@/lib/types";
import { useTr } from "@/lib/useLang";
import type { Lang } from "@/lib/i18n";

// রক্তদানের সংখ্যা অনুযায়ী ব্যাজ
function badgeOf(count: number, lang: Lang = "bn"): { icon: string; name: string; next: string | null } | null {
  if (count >= 10) return { icon: "💎", name: "জীবনরক্ষা যোদ্ধা", next: null };
  if (count >= 6) return { icon: "🥇", name: "প্রবীণ রক্তযোদ্ধা", next: `💎 পরবর্তী ব্যাজে আর ${num(10 - count, lang)} বার` };
  if (count >= 3) return { icon: "🥈", name: "নিয়মিত রক্তযোদ্ধা", next: `🥇 পরবর্তী ব্যাজে আর ${num(6 - count, lang)} বার` };
  if (count >= 1) return { icon: "🥉", name: "নব্য রক্তযোদ্ধা", next: `🥈 পরবর্তী ব্যাজে আর ${num(3 - count, lang)} বার` };
  return null;
}

export default function DashboardPage() {
  const { t: tx, lang } = useTr();
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [donor, setDonor] = useState<Donor | null>(null);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [tab, setTab] = useState<"profile" | "requests" | "donations">("profile");

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const [{ data: p }, { data: d }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("donors").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("blood_requests").select("*").eq("requested_by", user.id).order("created_at", { ascending: false }),
    ]);
    setProfile(p);
    setDonor(d as Donor | null);
    setRequests((r as BloodRequest[]) ?? []);
    let myDons: any[] = [];
    if (d) {
      const { data: dons } = await supabase.from("donations").select("*").eq("donor_id", (d as any).id).order("donated_at", { ascending: false });
      myDons = dons ?? [];
    }
    setDonations(myDons);
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <div className="container-page py-12"><GridSkeleton count={1} /></div>;
  }

  const totalUnits = donations.reduce((s, x) => s + (x.units ?? 0), 0);

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">{tx("স্বাগতম,")} {profile?.full_name ?? tx("রক্তদাতা")} 👋</h1>
          <p className="text-sm text-ink/60">{tx("আপনার ড্যাশবোর্ড থেকে প্রোফাইল, অনুরোধ ও রক্তদানের ইতিহাস দেখুন।")}</p>
        </div>
        <div className="flex gap-2">
          {donor && <Link href="/certificate" className="btn-primary !py-2 text-sm">{tx("🏅 সার্টিফিকেট")}</Link>}
          <Link href="/" className="btn-outline !py-2 text-sm">{tx("হোমে যান")}</Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <aside className="space-y-3">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white">
                {(profile?.full_name ?? "?").charAt(0)}
              </span>
              <div>
                <p className="font-semibold text-ink">{profile?.full_name}</p>
                <p className="text-xs text-ink/50">{profile?.role === "admin" ? tx("🛡️ অ্যাডমিন") : tx("রক্তদাতা")}</p>
                {(() => {
                  const b = badgeOf(donations.length, lang);
                  return b ? (
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
                      {b.icon} {tx(b.name)}
                    </span>
                  ) : null;
                })()}
              </div>
            </div>
            {donor && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-canvas p-3">
                  <p className="text-xs text-ink/50">{tx("গ্রুপ")}</p>
                  <div className="mt-1 flex items-center justify-between"><p className="font-semibold text-ink">{donor.blood_group}</p><BloodGroupBadge group={donor.blood_group} size="sm" /></div>
                </div>
                <div className="rounded-xl bg-canvas p-3">
                  <p className="text-xs text-ink/50">{tx("মোট রক্তদান")}</p>
                  <p className="font-semibold text-ink">{totalUnits} {tx("ইউনিট")}</p>
                </div>
              </div>
            )}
          </div>
          <nav className="card overflow-hidden">
            <TabBtn active={tab === "profile"} onClick={() => setTab("profile")}>{tx("👤 আমার প্রোফাইল")}</TabBtn>
            <TabBtn active={tab === "donations"} onClick={() => setTab("donations")}>
              {tx("🩸 আমার রক্তদান")} {donations.length > 0 && <span className="ml-1 rounded-full bg-brand-100 px-1.5 text-xs text-brand-700">{donations.length}</span>}
            </TabBtn>
            <TabBtn active={tab === "requests"} onClick={() => setTab("requests")}>
              {tx("📋 আমার অনুরোধ")} {requests.length > 0 && <span className="ml-1 rounded-full bg-brand-100 px-1.5 text-xs text-brand-700">{requests.length}</span>}
            </TabBtn>
          </nav>
        </aside>

        <div className="lg:col-span-2">
          {tab === "profile" && (donor ? <DonorProfile donor={donor} donations={donations} onChanged={load} /> : <NoDonor />)}
          {tab === "donations" && <MyDonations donations={donations} hasDonor={!!donor} />}
          {tab === "requests" && <MyRequests requests={requests} onChanged={load} />}
        </div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`block w-full px-5 py-3 text-left text-sm font-medium ${active ? "bg-brand-50 text-brand-700" : "text-ink/70 hover:bg-zinc-50"}`}>
      {children}
    </button>
  );
}

function NoDonor() {
  const { t: tx } = useTr();
  return (
    <div className="card p-10 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-2xl">🩸</div>
      <p className="font-medium text-ink">{tx("আপনি এখনো রক্তদাতা হিসেবে নিবন্ধন করেননি")}</p>
      <p className="mt-1 text-sm text-ink/60">{tx("রক্তদাতা হিসেবে নিবন্ধন করে একটি জীবন বাঁচানোর অংশীদার হোন।")}</p>
      <Link href="/become-donor" className="btn-primary mt-5">{tx("রক্তদাতা হিসেবে নিবন্ধন করুন")}</Link>
    </div>
  );
}

function NextDonationCard({ donor, donations }: { donor: Donor; donations: any[] }) {
  const { t: tx, lang } = useTr();
  // সর্বশেষ রক্তদান: ম্যানুয়াল তারিখ বা রেকর্ডকৃত donation — যেটা নতুন
  const dates: number[] = [];
  if (donor.last_donation_date) {
    const t = new Date(`${donor.last_donation_date}T00:00:00`).getTime();
    if (!isNaN(t)) dates.push(t);
  }
  for (const d of donations) {
    const t = new Date(d.donated_at).getTime();
    if (!isNaN(t)) dates.push(t);
  }

  const interval = donor.gender === "নারী" ? 120 : 90; // পুরুষ ৩ মাস, নারী ৪ মাস
  const DAY = 24 * 60 * 60 * 1000;

  if (dates.length === 0) {
    return (
      <div className="card border-l-4 border-l-success-500 p-5">
        <p className="font-semibold text-ink">{tx("✅ আপনি রক্তদানের জন্য প্রস্তুত")}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink/60">
          {tx("এখনো কোনো পূর্বের রক্তদানের তারিখ নেই। রক্তদানের পর তারিখটি নিচের ফর্মে যুক্ত করুন — তাহলে এখানে পরবর্তী দিনের কাউন্টডাউন দেখাবে।")}
        </p>
        <Link href="/eligibility" className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline">
          {tx("🩸 যোগ্যতা যাচাই করুন →")}
        </Link>
      </div>
    );
  }

  const last = Math.max(...dates);
  const today = new Date(new Date().toDateString()).getTime();
  const next = last + interval * DAY;
  const daysLeft = Math.ceil((next - today) / DAY);
  const elapsed = Math.floor((today - last) / DAY);
  const pct = Math.min(100, Math.round((elapsed / interval) * 100));

  if (daysLeft <= 0) {
    return (
      <div className="card border-l-4 border-l-success-500 p-5">
        <p className="font-semibold text-ink">{tx("✅ আপনি আবার রক্ত দিতে প্রস্তুত!")}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink/60">
          {tx("সর্বশেষ রক্তদান (")}{bnDate(new Date(last), lang)}{tx(")-এর নিরাপদ ব্যবধান (")}{tx(genderName(donor.gender))} {num(interval, lang)} {tx("দিন) পূর্ণ হয়েছে।")}
        </p>
        <Link href="/requests" className="btn-primary mt-4 !py-2 text-sm">
          {tx("🚨 জরুরি অনুরোধ দেখুন →")}
        </Link>
      </div>
    );
  }

  return (
    <div className="card border-l-4 border-l-amber-400 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-ink">{tx("⏳ পরবর্তী রক্তদানের কাউন্টডাউন")}</p>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
          {num(daysLeft, lang)} {tx("দিন বাকি")}
        </span>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-success-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-ink/60">
        {tx("সর্বশেষ রক্তদান:")} <span className="font-semibold text-ink">{bnDate(new Date(last), lang)}</span>
        {" "}{tx("• আবার দিতে পারবেন:")} <span className="font-semibold text-brand-700">{bnDate(new Date(next), lang)}</span>
      </p>
      <p className="mt-1 text-xs text-ink/50">
        {tx(genderName(donor.gender))}{tx("দের জন্য নিরাপদ ব্যবধান")} {num(interval, lang)} {tx("দিন (")}{donor.gender === "নারী" ? tx("৪") : tx("৩")} {tx("মাস) ধরা হয়েছে।")}
      </p>
    </div>
  );
}

function genderName(g: string | null): string {
  return g === "নারী" ? "নারী" : "পুরুষ";
}

function DonorProfile({ donor, donations, onChanged }: { donor: Donor; donations: any[]; onChanged: () => void }) {
  const { t: tx } = useTr();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [available, setAvailable] = useState(donor.is_available);
  const [form, setForm] = useState({
    upazila: donor.upazila, area: donor.area ?? "", phone: donor.phone, last_donation_date: donor.last_donation_date ?? "",
  });

  const toggleAvailable = async () => {
    const next = !available;
    setAvailable(next);
    await supabase.from("donors").update({ is_available: next }).eq("id", donor.id);
    onChanged();
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("donors").update({
      upazila: form.upazila, area: form.area, phone: form.phone,
      last_donation_date: form.last_donation_date || null,
    }).eq("id", donor.id);
    setSaving(false);
    onChanged();
  };

  return (
    <div className="space-y-6">
      <NextDonationCard donor={donor} donations={donations} />
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-ink">{tx("রক্তদানের প্রস্তুততা")}</h2>
          <button onClick={toggleAvailable} className={`relative h-7 w-12 rounded-full transition ${available ? "bg-success-500" : "bg-zinc-300"}`}>
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${available ? "left-6" : "left-1"}`} />
          </button>
        </div>
        <p className="mt-2 text-sm text-ink/60">
          {available ? tx("🟢 আপনি বর্তমানে রক্তদানে প্রস্তুত। দাতা তালিকায় প্রাধান্য পাবেন।") : tx("⚪ আপনি এই মুহূর্তে অনুপস্থিত।")}
        </p>
      </div>

      <form onSubmit={save} className="card p-6">
        <h2 className="mb-4 font-semibold text-ink">{tx("প্রোফাইল সম্পাদনা")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">{tx("ফোন")}</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">{tx("উপজেলা (")}{donor.district})</label>
            <select className="input" value={form.upazila} onChange={(e) => setForm({ ...form, upazila: e.target.value })}>
              {upazilasOf(donor.district).map((u) => <option key={u} value={u}>{tx(u)}</option>)}
            </select>
          </div>
          <div>
            <label className="label">{tx("এলাকা")}</label>
            <input className="input" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
          </div>
          <div>
            <label className="label">{tx("সর্বশেষ রক্তদান")}</label>
            <input type="date" className="input" value={form.last_donation_date} onChange={(e) => setForm({ ...form, last_donation_date: e.target.value })} />
          </div>
        </div>
        <button disabled={saving} className="btn-primary mt-5">{saving ? tx("সংরক্ষণ হচ্ছে…") : tx("সংরক্ষণ করুন")}</button>
      </form>
    </div>
  );
}

function MyDonations({ donations, hasDonor }: { donations: any[]; hasDonor: boolean }) {
  const { t: tx, lang } = useTr();
  if (!hasDonor) return <NoDonor />;
  if (donations.length === 0)
    return (
      <div className="card p-10 text-center text-ink/60">
        <p className="text-3xl">🩸</p>
        <p className="mt-2 font-medium text-ink">{tx("এখনো আপনার কোনো রক্তদানের রেকর্ড নেই")}</p>
        <p className="mt-1 text-sm">{tx("রক্তদানের পর অ্যাডমিন এটি রেকর্ড করলে এখানে দেখা যাবে।")}</p>
      </div>
    );
  const total = donations.reduce((s, x) => s + (x.units ?? 0), 0);
  return (
    <div>
      <div className="mb-4 card flex items-center justify-between p-5">
        <div><p className="text-xs text-ink/50">{tx("মোট রক্তদান")}</p><p className="text-2xl font-extrabold text-brand-600">{total} {tx("ইউনিট")}</p></div>
        <div className="text-right"><p className="text-xs text-ink/50">{tx("মোট বার")}</p><p className="text-2xl font-extrabold text-ink">{donations.length}</p></div>
      </div>
      <div className="space-y-3">
        {donations.map((d) => (
          <div key={d.id} className="card flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-ink">{d.units} {tx("ইউনিট রক্তদান")}</p>
              <p className="text-xs text-ink/50">{fmtDate(d.donated_at, lang)}{d.note && ` • ${d.note}`}</p>
            </div>
            <span className="text-2xl">❤️</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyRequests({ requests, onChanged }: { requests: BloodRequest[]; onChanged: () => void }) {
  const { t: tx } = useTr();
  const supabase = createClient();
  const cancel = async (id: string) => {
    await supabase.from("blood_requests").update({ status: "cancelled" }).eq("id", id);
    onChanged();
  };
  if (requests.length === 0)
    return <div className="card p-10 text-center text-ink/60">{tx("আপনার কোনো রক্তের অনুরোধ নেই।")} <Link href="/request-blood" className="font-semibold text-brand-600">{tx("অনুরোধ করুন →")}</Link></div>;
  return (
    <div className="space-y-3">
      {requests.map((r) => (
        <div key={r.id} className="card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-ink">{r.patient_name} • {r.blood_group}</p>
              <p className="text-sm text-ink/60">{r.hospital}, {r.upazila} • {r.units_needed} {tx("ইউনিট")}</p>
            </div>
            <StatusBadge status={(r as any).status ?? "pending"} />
          </div>
          {["pending", "approved"].includes((r as any).status ?? "pending") && (
            <button onClick={() => cancel(r.id)} className="btn-ghost mt-3 !px-3 !py-1.5 text-xs text-blood-600">{tx("✕ বাতিল করুন")}</button>
          )}
        </div>
      ))}
    </div>
  );
}
