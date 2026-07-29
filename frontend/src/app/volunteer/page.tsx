"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SYLHET_DISTRICTS } from "@/data/constants";
import { useToast } from "@/components/Toast";

// সিলেট বিভাগের সব উপজেলা (শুধু সুনামগঞ্জ নয়)
const ALL_UPAZILAS = SYLHET_DISTRICTS.flatMap((d) => [...d.upazilas]);

export default function VolunteerPage() {
  const supabase = createClient();
  const toast = useToast();
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", upazila: "", role: "" });
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("volunteers").insert(form);
    setSaving(false);
    if (error) {
      toast("error", "নিবন্ধনে সমস্যা হয়েছে");
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md card p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 animate-pop items-center justify-center rounded-full bg-success-50 text-3xl">✓</div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">ধন্যবাদ! 🙌</h1>
          <p className="mt-2 text-ink/60">আপনার স্বেচ্ছাসেবক আবেদন গৃহীত হয়েছে। অ্যাডমিন অনুমোদন করলে যোগাযোগ করা হবে।</p>
          <Link href="/" className="btn-primary mt-6">হোমে ফিরুন</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl">
        <header className="text-center">
          <span className="eyebrow">স্বেচ্ছাসেবক হোন</span>
          <h1 className="section-title mt-3">স্বেচ্ছাসেবক হিসেবে যুক্ত হোন</h1>
          <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
          <p className="mx-auto mt-4 max-w-xl text-ink/60">রক্তদান কার্যক্রমে সরাসরি অংশ নিন, জীবন বাঁচানোর এই মিশনের অংশীদার হোন।</p>
        </header>

        <form onSubmit={submit} className="mt-8 card p-6 sm:p-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">পুরো নাম *</label><input required className="input" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} /></div>
            <div><label className="label">মোবাইল *</label><input required className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="01XXXXXXXXX" /></div>
            <div><label className="label">ইমেইল</label><input className="input" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
            <div><label className="label">উপজেলা</label>
              <select className="input" value={form.upazila} onChange={(e) => set("upazila", e.target.value)}>
                <option value="">নির্বাচন করুন</option>
                {ALL_UPAZILAS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div><label className="label">আপনি কীভাবে সাহায্য করতে চান?</label>
            <input className="input" value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="যেমন: রক্তদাতা সমন্বয়, প্রচার, ইভেন্ট ব্যবস্থাপনা" />
          </div>
          <button disabled={saving} className="btn-primary w-full">{saving ? "পাঠানো হচ্ছে…" : "আবেদন জমা দিন"}</button>
        </form>
      </div>
    </div>
  );
}
