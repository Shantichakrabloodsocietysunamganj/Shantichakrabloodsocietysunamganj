import Link from "next/link";
import type { BloodRequest } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import BloodGroupBadge from "./BloodGroupBadge";
import WhatsAppShare from "./WhatsAppShare";

function relativeTime(iso: string, en: boolean) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return en ? `${mins} min ago` : `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return en ? `${hrs}h ago` : `${hrs} ঘণ্টা আগে`;
  const days = Math.floor(hrs / 24);
  return en ? `${days}d ago` : `${days} দিন আগে`;
}

export default function RequestCard({ req, lang = "bn" }: { req: BloodRequest; lang?: Lang }) {
  const en = lang === "en";
  const diffH = (new Date(req.needed_date).getTime() - Date.now()) / 3600000;
  const urgent = diffH < 24 && diffH > -24;

  return (
    <div className={`card-hover overflow-hidden ${urgent ? "ring-2 ring-blood-500/40" : ""}`}>
      <div className="flex items-center justify-between bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white">
          {urgent && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
          )}
          {urgent ? (en ? "Urgent" : "জরুরি") : en ? "Request" : "অনুরোধ"}
        </span>
        <span className="text-xs text-white/80">{relativeTime(req.created_at, en)}</span>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-4">
          <BloodGroupBadge group={req.blood_group} size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-base font-bold text-ink">{en ? `Blood needed for ${req.patient_name}` : `${req.patient_name}-এর জন্য রক্ত দরকার`}</h3>
            <p className="mt-0.5 text-sm text-ink/50">
              {req.units_needed} {en ? "units" : "ইউনিট"} • {req.hospital}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-ink/50">
          <div>
            <span className="block text-[11px] uppercase tracking-wide text-ink/35">{en ? "Location" : "স্থান"}</span>
            <span className="font-medium text-ink/80">{req.upazila}</span>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wide text-ink/35">{en ? "Needed" : "লাগবে তারিখ"}</span>
            <span className="font-medium text-ink/80">
              {new Date(req.needed_date).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        {req.message && (
          <p className="mt-3 line-clamp-2 rounded-lg bg-zinc-50 p-3 text-sm text-ink/60">{req.message}</p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
          <span className="text-sm text-ink/50">{en ? "Contact:" : "যোগাযোগ:"} <span className="font-medium text-ink/80">{req.contact_name}</span></span>
          <div className="flex items-center gap-2">
            <WhatsAppShare req={req} />
            <a href={`tel:${req.contact_phone}`} className="btn-primary !px-3 !py-2 text-xs">
              📞 {req.contact_phone}
            </a>
          </div>
        </div>

        {/* status timeline */}
        <div className="mt-3 flex items-center border-t border-zinc-100 pt-3">
          {[
            { key: "pending", label: en ? "Pending" : "অপেক্ষমাণ" },
            { key: "approved", label: en ? "Approved" : "অনুমোদিত" },
            { key: "completed", label: en ? "Done" : "সম্পন্ন" },
          ].map((step, i) => {
            const order: Record<string, number> = { pending: 0, approved: 1, completed: 2 };
            const cur = order[req.status] ?? 0;
            const done = req.status !== "cancelled" && cur >= i;
            return (
              <div key={step.key} className="flex flex-1 flex-col items-center gap-1">
                <span className={`h-3 w-3 rounded-full ${done ? "bg-brand-600" : "bg-zinc-200"}`} />
                <span className={`text-[9px] font-medium ${done ? "text-brand-600" : "text-ink/30"}`}>{step.label}</span>
              </div>
            );
          })}
          {req.status === "cancelled" && <span className="ml-2 shrink-0 text-[10px] font-bold text-blood-600">✕ {en ? "Cancelled" : "বাতিল"}</span>}
        </div>
        <Link href={`/requests/${req.id}`} className="mt-2 block text-center text-xs font-bold text-brand-600 hover:underline">{en ? "View details →" : "বিস্তারিত দেখুন →"}</Link>
      </div>
    </div>
  );
}
