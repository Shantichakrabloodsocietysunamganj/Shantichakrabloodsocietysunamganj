import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BloodGroupBadge from "@/components/BloodGroupBadge";
import { notFound } from "next/navigation";
import { site } from "@/data/site";
import { tr, type Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { fmtDate } from "@/lib/format";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient();
  const { data: req } = await supabase.from("blood_requests").select("patient_name, blood_group, hospital, district").eq("id", params.id).maybeSingle();
  if (!req) return { title: "রক্তের অনুরোধ | শান্তিচক্র ব্লাড সোসাইটি" };

  const title = `জরুরি ${req.blood_group} রক্তের প্রয়োজন - ${req.hospital} | শান্তিচক্র ব্লাড সোসাইটি`;
  const description = `${req.district} এলাকায় ${req.hospital} হাসপাতালে রোগীর জন্য জরুরি ${req.blood_group} রক্ত প্রয়োজন। সাহায্য করতে যোগাযোগ করুন।`;

  return {
    title,
    description,
    alternates: { canonical: `/requests/${params.id}` },
    openGraph: {
      title,
      description,
      url: `https://shanticakrabloodsocaiety.rahatahmed.site/requests/${params.id}`,
      type: "article",
    },
  };
}

function fmt(d: string, lang: Lang) {
  return fmtDate(d, lang);
}

export default async function RequestDetailPage({ params }: { params: { id: string } }) {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  const supabase = createClient();
  const { data: req } = await supabase.from("blood_requests").select("*").eq("id", params.id).maybeSingle();
  if (!req) notFound();

  const status = (req as any).status ?? "pending";
  const diffH = (new Date((req as any).needed_date).getTime() - Date.now()) / 3600000;
  const urgent = diffH < 24 && diffH > -24;

  const shareText = `${tx("🩸 *জরুরি রক্তের অনুরোধ*")}\n\n${tx("রোগী")}: ${(req as any).patient_name}\n${tx("গ্রুপ")}: ${(req as any).blood_group}\n${tx("ইউনিট")}: ${(req as any).units_needed}\n${tx("হাসপাতাল")}: ${(req as any).hospital}\n${tx("এলাকা")}: ${tx((req as any).upazila)}\n${tx("তারিখ")}: ${fmt((req as any).needed_date, lang)}\n${tx("যোগাযোগ")}: ${(req as any).contact_phone}\n\n— ${tx(site.name)}`;
  const pageUrl = `${site.name}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;

  const steps = [
    { key: "approved", label: tx("লাইভ") },
    { key: "completed", label: tx("সম্পন্ন") },
  ];
  const order: Record<string, number> = { pending: 0, approved: 0, completed: 1 };

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/requests" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">{tx("← সব অনুরোধ")}</Link>

        <div className="card overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-4 text-white">
            <span className="inline-flex items-center gap-2 text-sm font-bold">
              {urgent && <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" /></span>}
              {urgent ? tx("🚨 জরুরি") : tx("রক্তের অনুরোধ")}
            </span>
            <StatusPill status={status} lang={lang} />
          </div>

          <div className="p-6">
            <div className="flex items-start gap-4">
              <BloodGroupBadge group={(req as any).blood_group} size="lg" />
              <div>
                <h1 className="font-display text-2xl font-extrabold text-ink">{(req as any).patient_name}</h1>
                <p className="mt-1 text-sm text-ink/50">{(req as any).units_needed} {tx("ইউনিট •")} {(req as any).hospital}</p>
              </div>
            </div>

            {/* details grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <Detail label={tx("এলাকা")} value={`${(req as any).district}, ${(req as any).upazila}`} />
              <Detail label={tx("লাগবে তারিখ")} value={fmt((req as any).needed_date, lang)} />
              <Detail label={tx("যোগাযোগ")} value={(req as any).contact_name} />
              <Detail label={tx("মোবাইল")} value={(req as any).contact_phone} />
              {(req as any).hemoglobin && <Detail label={tx("হিমোগ্লোবিন")} value={`${(req as any).hemoglobin} g/dL`} />}
              {(req as any).patient_age && <Detail label={tx("রোগীর বয়স")} value={`${(req as any).patient_age} বছর`} />}
              {(req as any).patient_gender && <Detail label={tx("রোগীর লিঙ্গ")} value={(req as any).patient_gender} />}
              {(req as any).disease && <Detail label={tx("রোগীর অবস্থা")} value={(req as any).disease} />}
              {(req as any).blood_component && (
                <Detail label={tx("কী দরকার")} value={
                  (req as any).blood_component === "platelets" ? tx("প্লেটলেট") :
                  (req as any).blood_component === "plasma" ? tx("প্লাজমা") : tx("সম্পূর্ণ রক্ত")
                } />
              )}
            </div>

            {(req as any).message && (
              <div className="mt-5 rounded-xl bg-canvas p-4 text-sm leading-relaxed text-ink/70 dark:bg-white/5">
                {(req as any).message}
              </div>
            )}

            {/* status timeline */}
            <div className="mt-6 flex items-center border-t border-zinc-100 pt-5">
              {steps.map((s, i) => {
                const cur = order[status] ?? 0;
                const done = status !== "cancelled" && cur >= i;
                return (
                  <div key={s.key} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-brand-600 text-white" : "bg-zinc-200 text-zinc-400"}`}>{done ? "✓" : i + 1}</span>
                    <span className={`text-[11px] font-medium ${done ? "text-brand-600" : "text-ink/30"}`}>{s.label}</span>
                  </div>
                );
              })}
              {status === "cancelled" && <span className="ml-3 text-sm font-bold text-blood-600">{tx("✕ বাতিল")}</span>}
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3 border-t border-zinc-100 pt-5">
              <a href={`tel:${(req as any).contact_phone}`} className="btn-primary">{tx("📞 কল করুন")}</a>
              <a href={waUrl} target="_blank" rel="noreferrer" className="btn bg-[#25D366] text-white hover:opacity-90">{tx("💬 WhatsApp শেয়ার")}</a>
              <a href={fbUrl} target="_blank" rel="noreferrer" className="btn bg-[#0084FF] text-white hover:opacity-90">{tx("📘 Facebook শেয়ার")}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status, lang }: { status: string; lang: Lang }) {
  const tx = (v: string) => tr(v, lang);
  const map: Record<string, string> = {
    pending: "bg-amber-500", approved: "bg-brand-500", completed: "bg-success-500", cancelled: "bg-zinc-500",
  };
  const labels: Record<string, string> = { pending: tx("লাইভ"), approved: tx("লাইভ"), completed: tx("সম্পন্ন"), cancelled: tx("বাতিল") };
  const label = labels[status];
  return <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${map[status] ?? "bg-zinc-500"}`}>{label ? tx(label) : status}</span>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink/40">{label}</p>
      <p className="font-medium text-ink">{value}</p>
    </div>
  );
}
