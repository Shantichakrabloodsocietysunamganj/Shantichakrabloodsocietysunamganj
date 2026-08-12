"use client";

import type { Donor } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { getDonorStatus } from "@/lib/donation";
import BloodGroupBadge from "./BloodGroupBadge";
import Link from "next/link";
import { shortDate } from "@/lib/format";

export default function DonorCard({ donor, lang = "bn" }: { donor: Donor; lang?: Lang }) {
  const en = lang === "en";
  const initials = donor.full_name.trim().charAt(0).toUpperCase();
  const status = getDonorStatus(donor.is_available, donor.last_donation_date, en);

  return (
    <div className="card-hover group flex h-full flex-col p-5">
      <div className="flex items-start gap-4">
        {donor.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={donor.photo_url} alt={donor.full_name} className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-soft" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-xl font-extrabold text-white shadow-glow">{initials}</div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-bold text-ink">{donor.full_name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-ink/50">
            <svg className="h-4 w-4 shrink-0 text-brand-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className="truncate">{donor.upazila}{donor.area ? `, ${donor.area}` : ""}</span>
          </p>
        </div>
        <BloodGroupBadge group={donor.blood_group} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-ink/50">
        <div>
          <span className="block text-[11px] uppercase tracking-wide text-ink/35">{en ? "Age" : "বয়স"}</span>
          <span className="font-medium text-ink/80">{donor.age ? `${donor.age} ${en ? "yrs" : "বছর"}` : "—"}</span>
        </div>
        <div>
          <span className="block text-[11px] uppercase tracking-wide text-ink/35">{en ? "Gender" : "লিঙ্গ"}</span>
          <span className="font-medium text-ink/80">{donor.gender ?? "—"}</span>
        </div>
        <div className="col-span-2">
          <span className="block text-[11px] uppercase tracking-wide text-ink/35">{en ? "Last donation" : "সর্বশেষ রক্তদান"}</span>
          <span className="font-medium text-ink/80">{donor.last_donation_date ? formatDate(donor.last_donation_date, lang) : en ? "Never" : "এখনো নেই"}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${status.color}`}>
          <span className={`h-2 w-2 rounded-full ${status.dot}`} />
          {status.label}
        </span>
        <div className="flex items-center gap-1.5">
          <Link href={`/donor/${donor.id}`} className="btn-ghost !px-2 !py-2 text-xs" title={en ? "Verify QR" : "QR যাচাই"}>QR</Link>
          <a href={`https://wa.me/88${donor.phone.replace(/^0/, "")}`} target="_blank" rel="noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366] text-white transition hover:scale-105" title="WhatsApp">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24z" /></svg>
          </a>
          <a href={`tel:${donor.phone}`} className="btn-primary !px-3 !py-2 text-xs"><PhoneIcon /> {en ? "Call" : "কল"}</a>
        </div>
      </div>
    </div>
  );
}

function formatDate(d: string, lang: Lang) {
  try {
    return shortDate(d, lang);
  } catch {
    return d;
  }
}

function PhoneIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 0 1 2-2h2.6a1 1 0 0 1 .95.68l1.05 3.14a1 1 0 0 1-.5 1.21l-1.6.8a14 14 0 0 0 6 6l.8-1.6a1 1 0 0 1 1.21-.5l3.14 1.05a1 1 0 0 1 .68.95V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5z" />
    </svg>
  );
}
