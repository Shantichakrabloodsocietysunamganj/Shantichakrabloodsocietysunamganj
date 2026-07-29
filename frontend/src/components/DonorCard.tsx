"use client";

import type { Donor } from "@/lib/types";
import BloodGroupBadge from "./BloodGroupBadge";
import Link from "next/link";

export default function DonorCard({ donor }: { donor: Donor }) {
  const initials = donor.full_name.trim().charAt(0).toUpperCase();

  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-start gap-4">
        {donor.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={donor.photo_url}
            alt={donor.full_name}
            className="h-14 w-14 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-xl font-bold text-brand-600">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-zinc-900">{donor.full_name}</h3>
          <p className="flex items-center gap-1 text-sm text-zinc-500">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className="truncate">{donor.upazila}{donor.area ? `, ${donor.area}` : ""}</span>
          </p>
        </div>
        <BloodGroupBadge group={donor.blood_group} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-500">
        <div>
          <span className="block text-zinc-400">বয়স</span>
          <span className="font-medium text-zinc-700">{donor.age ? `${donor.age} বছর` : "—"}</span>
        </div>
        <div>
          <span className="block text-zinc-400">লিঙ্গ</span>
          <span className="font-medium text-zinc-700">{donor.gender ?? "—"}</span>
        </div>
        <div className="col-span-2">
          <span className="block text-zinc-400">সর্বশেষ রক্তদান</span>
          <span className="font-medium text-zinc-700">
            {donor.last_donation_date ? formatDate(donor.last_donation_date) : "এখনো নেই"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${
            donor.is_available ? "text-emerald-600" : "text-zinc-400"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${donor.is_available ? "bg-emerald-500" : "bg-zinc-300"}`} />
          {donor.is_available ? "রক্তদানে প্রস্তুত" : "এই মুহূর্তে অনুপস্থিত"}
        </span>
        <div className="flex items-center gap-2">
          <Link href={`/donor/${donor.id}`} className="btn-ghost !px-2 !py-2 text-xs" title="QR যাচাই">QR</Link>
          <a href={`tel:${donor.phone}`} className="btn-primary !px-3 !py-2 text-xs"><PhoneIcon /> কল</a>
        </div>
      </div>
    </div>
  );
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
