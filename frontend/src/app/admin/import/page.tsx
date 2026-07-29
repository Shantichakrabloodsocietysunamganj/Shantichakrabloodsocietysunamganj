"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/activity";

export default function AdminImportPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [text, setText] = useState("");
  const [results, setResults] = useState<{ ok: number; fail: number; errors: string[] } | null>(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (prof?.role !== "admin") { setReady(true); return; }
      setAuthed(true); setReady(true);
    })();
  }, [supabase, router]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setText(reader.result as string);
    reader.readAsText(file);
  };

  const doImport = async () => {
    setImporting(true);
    setResults(null);
    const lines = text.trim().split("\n");
    const header = lines[0].toLowerCase().trim().split(",").map((s) => s.trim());
    const nameIdx = header.findIndex((h) => h.includes("name") || h.includes("নাম"));
    const phoneIdx = header.findIndex((h) => h.includes("phone") || h.includes("ফোন"));
    const groupIdx = header.findIndex((h) => h.includes("group") || h.includes("গ্রুপ"));
    const districtIdx = header.findIndex((h) => h.includes("district") || h.includes("জেলা"));
    const upazilaIdx = header.findIndex((h) => h.includes("upazila") || h.includes("উপজেলা"));

    let ok = 0, fail = 0;
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
      const row = {
        full_name: nameIdx >= 0 ? cols[nameIdx] : cols[0],
        phone: phoneIdx >= 0 ? cols[phoneIdx] : cols[1],
        blood_group: groupIdx >= 0 ? cols[groupIdx] : cols[2],
        district: districtIdx >= 0 ? cols[districtIdx] : "সুনামগঞ্জ",
        upazila: upazilaIdx >= 0 ? cols[upazilaIdx] : cols[3] ?? "",
      };
      if (!row.full_name || !row.phone || !row.blood_group) { fail++; errors.push(`Row ${i + 1}: missing required field`); continue; }
      const { error } = await supabase.from("donors").insert(row);
      if (error) { fail++; errors.push(`Row ${i + 1}: ${error.message}`); } else { ok++; }
    }
    logActivity(`CSV import করেছেন — ${ok} জন দাতা`);
    setResults({ ok, fail, errors });
    setImporting(false);
  };

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed) return <div className="container-page py-20 text-center"><p className="text-3xl">🛡️</p><p className="mt-2 font-medium text-ink">শুধু অ্যাডমিনদের জন্য।</p><Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">📥 CSV Import — দাতা</h1>
        <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
      </header>

      <div className="card p-6">
        <h2 className="mb-2 font-semibold text-ink">CSV ফাইল আপলোড করুন</h2>
        <p className="mb-4 text-sm text-ink/60">
          কলাম: <code className="rounded bg-zinc-100 px-1.5 py-0.5">full_name, phone, blood_group, district, upazila</code>
          <br />প্রথম লাইনে header থাকতে হবে। রক্তের গ্রুপ: A+, B+, O+ ইত্যাদি।
        </p>
        <input type="file" accept=".csv,text/csv" onChange={onFile} className="input mb-4" />
        <p className="mb-3 text-xs text-ink/40">অথবা নিচে সরাসরি CSV পেস্ট করুন:</p>
        <textarea className="input min-h-32 mb-4 font-mono text-xs" placeholder="full_name,phone,blood_group,district,upazila&#10;রহিম,017xxxxxx,O+,সুনামগঞ্জ,ছাতক" value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={doImport} disabled={!text.trim() || importing} className="btn-primary">
          {importing ? "ইমপোর্ট হচ্ছে…" : "ইমপোর্ট করুন"}
        </button>
      </div>

      {results && (
        <div className="mt-6 card p-6">
          <h3 className="font-bold text-ink">ফলাফল</h3>
          <div className="mt-3 flex gap-4">
            <span className="rounded-lg bg-success-50 px-4 py-2 text-sm font-bold text-success-700">✓ সফল: {results.ok}</span>
            {results.fail > 0 && <span className="rounded-lg bg-blood-50 px-4 py-2 text-sm font-bold text-blood-700">✕ ব্যর্থ: {results.fail}</span>}
          </div>
          {results.errors.length > 0 && (
            <div className="mt-4 max-h-40 overflow-y-auto rounded-lg bg-zinc-50 p-3 text-xs text-blood-600">
              {results.errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
