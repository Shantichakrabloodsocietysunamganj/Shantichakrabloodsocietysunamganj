"use client";

// =====================================================================
//  RequesterCard — যিনি রক্তের অনুরোধ দিয়েছেন তাঁকে ঠিক রক্তদাতা কার্ডের
//  মতো করেই দেখানো হয় (avatar, গ্রুপ ব্যাজ, লাইভ স্ট্যাটাস ডট, কল/WhatsApp)।
//  পার্থক্য শুধু রঙে — দাতা = নীল, অনুরোধকারী = লাল (blood)।
// =====================================================================

import Link from "next/link";
import { Clock, Droplets, MapPin, Phone, Hospital } from "lucide-react";
import type { BloodRequest } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import BloodGroupBadge from "./BloodGroupBadge";
import { componentLabel, formatDate, getRequestStatus, initialsOf, relativeTime } from "@/lib/request";

export default function RequesterCard({
  req,
  lang = "bn",
  fresh = false,
}: {
  req: BloodRequest;
  lang?: Lang;
  fresh?: boolean;
}) {
  const en = lang === "en";
  const status = getRequestStatus(req, en);
  const critical = status.key === "critical" || status.key === "urgent";

  return (
    <div
      className={`card-hover group relative flex h-full flex-col p-5 transition-shadow ${
        critical ? "ring-1 ring-blood-500/35" : ""
      } ${fresh ? "animate-pop ring-2 ring-blood-500/60" : ""}`}
    >
      {/* সদ্য আসা অনুরোধ — "এইমাত্র এলো" ব্যাজ */}
      {fresh && (
        <span className="absolute -top-2.5 left-4 z-10 inline-flex items-center gap-1 rounded-full bg-blood-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-glow-red">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          {en ? "NEW" : "এইমাত্র এলো"}
        </span>
      )}

      {/* উপরের সারি — avatar + নাম + গ্রুপ (DonorCard-এর হুবহু লেআউট) */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blood-500 to-blood-700 font-display text-lg font-extrabold text-white shadow-glow-red">
            {initialsOf(req.patient_name)}
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-white text-blood-600 shadow-soft ring-1 ring-blood-100 dark:bg-slate-900">
            <Droplets className="h-3.5 w-3.5" strokeWidth={2.2} />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-bold text-ink">{req.patient_name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-ink/50">
            <MapPin className="h-4 w-4 shrink-0 text-blood-500" strokeWidth={1.9} />
            <span className="truncate">
              {req.upazila}
              {req.district ? `, ${req.district}` : ""}
            </span>
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-blood-600">
            {en ? "Needs blood" : "রক্ত প্রয়োজন"}
          </p>
        </div>

        <BloodGroupBadge group={req.blood_group} />
      </div>

      {/* তথ্য গ্রিড */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-ink/50">
        <div>
          <span className="block text-[11px] uppercase tracking-wide text-ink/35">{en ? "Units" : "ইউনিট"}</span>
          <span className="font-medium text-ink/80">
            {req.units_needed} {en ? "unit(s)" : "ব্যাগ"}
          </span>
        </div>
        <div>
          <span className="block text-[11px] uppercase tracking-wide text-ink/35">{en ? "Component" : "কী দরকার"}</span>
          <span className="font-medium text-ink/80">{componentLabel(req.blood_component, en)}</span>
        </div>
        <div className="col-span-2">
          <span className="block text-[11px] uppercase tracking-wide text-ink/35">{en ? "Hospital" : "হাসপাতাল"}</span>
          <span className="flex items-center gap-1 font-medium text-ink/80">
            <Hospital className="h-3.5 w-3.5 shrink-0 text-ink/40" strokeWidth={1.9} />
            <span className="truncate">{req.hospital}</span>
          </span>
        </div>
        <div className="col-span-2">
          <span className="block text-[11px] uppercase tracking-wide text-ink/35">{en ? "Needed on" : "লাগবে যেদিন"}</span>
          <span className="font-medium text-ink/80">{formatDate(req.needed_date, en)}</span>
        </div>
        {req.hemoglobin && (
          <div>
            <span className="block text-[11px] uppercase tracking-wide text-ink/35">{en ? "Hemoglobin" : "হিমোগ্লোবিন"}</span>
            <span className="font-bold text-blood-600">{req.hemoglobin} g/dL</span>
          </div>
        )}
        {req.disease && (
          <div>
            <span className="block text-[11px] uppercase tracking-wide text-ink/35">{en ? "Condition" : "অবস্থা"}</span>
            <span className="truncate font-medium text-ink/80">{req.disease}</span>
          </div>
        )}
      </div>

      {/* লাইভ স্ট্যাটাস + অ্যাকশন (DonorCard-এর মতোই ফুটার) */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-zinc-100 pt-4 dark:border-white/10">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${status.color}`}>
          <span className="relative flex h-2 w-2">
            {status.pulse && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${status.dot}`} />}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${status.dot}`} />
          </span>
          {status.label}
        </span>

        <div className="flex items-center gap-1.5">
          <Link href={`/requests/${req.id}`} className="btn-ghost !px-2 !py-2 text-xs" title={en ? "Details" : "বিস্তারিত"}>
            {en ? "Info" : "বিস্তারিত"}
          </Link>
          <a
            href={`https://wa.me/88${(req.contact_phone ?? "").replace(/[^0-9]/g, "").replace(/^0/, "")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366] text-white transition hover:scale-105"
            title="WhatsApp"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24z" />
            </svg>
          </a>
          <a href={`tel:${req.contact_phone}`} className="btn-blood !px-3 !py-2 text-xs">
            <Phone className="h-4 w-4" strokeWidth={2} /> {en ? "Call" : "কল"}
          </a>
        </div>
      </div>

      {/* কে অনুরোধ করেছেন + কখন */}
      <p className="mt-2 flex items-center justify-between text-[11px] text-ink/40">
        <span className="truncate">
          {en ? "Requested by" : "অনুরোধকারী"}: <span className="font-medium text-ink/60">{req.contact_name}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1">
          <Clock className="h-3 w-3" strokeWidth={1.9} />
          {relativeTime(req.created_at, en)}
        </span>
      </p>
    </div>
  );
}
