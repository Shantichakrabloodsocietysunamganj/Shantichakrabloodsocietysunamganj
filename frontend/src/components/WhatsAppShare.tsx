"use client";

import type { BloodRequest } from "@/lib/types";
import { site } from "@/data/site";

// WhatsApp-এ রক্তের অনুরোধ শেয়ার করার বাটন
export default function WhatsAppShare({ req }: { req: BloodRequest }) {
  const text = `🩸 *জরুরি রক্তের অনুরোধ*\n\n` +
    `রোগী: ${req.patient_name}\n` +
    `গ্রুপ: ${req.blood_group}\n` +
    `ইউনিট: ${req.units_needed}\n` +
    `হাসপাতাল: ${req.hospital}\n` +
    `এলাকা: ${req.upazila}\n` +
    `তারিখ: ${new Date(req.needed_date).toLocaleDateString("bn-BD")}\n` +
    `যোগাযোগ: ${req.contact_phone}\n\n` +
    `— ${site.name}`;

  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white transition hover:scale-105"
      aria-label="WhatsApp-এ শেয়ার করুন"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24z"/></svg>
      শেয়ার
    </a>
  );
}
