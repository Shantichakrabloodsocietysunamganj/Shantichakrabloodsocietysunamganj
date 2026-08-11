"use client";

import Link from "next/link";
import { site } from "@/data/site";
import { Siren } from "@/components/icons";

// ভাসমান sticky বোতাম — Emergency + Call + WhatsApp + Messenger (ডান নিচে)
export default function FloatingActions() {
  return (
    <div className="fixed bottom-6 left-4 z-40 flex flex-col gap-2.5">
      {/* Emergency blood request */}
      <Link
        href="/request-blood"
        aria-label="জরুরি রক্তের অনুরোধ"
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-blood-600 text-white shadow-glow-red transition-transform hover:scale-110"
      >
        <Siren className="h-5 w-5" />
        <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-blood-700 opacity-0 shadow transition-opacity group-hover:opacity-100 dark:bg-slate-800 dark:text-blood-300">জরুরি রক্ত</span>
      </Link>
      {/* Call */}
      <a
        href={`tel:${site.phone}`}
        aria-label="কল করুন"
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg transition-transform hover:scale-110"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 0 1 2-2h2.6a1 1 0 0 1 .95.68l1.05 3.14a1 1 0 0 1-.5 1.21l-1.6.8a14 14 0 0 0 6 6l.8-1.6a1 1 0 0 1 1.21-.5l3.14 1.05a1 1 0 0 1 .68.95V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5z" /></svg>
        <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-brand-700 opacity-0 shadow transition-opacity group-hover:opacity-100 dark:bg-slate-800 dark:text-brand-300">কল করুন</span>
      </a>
      {/* WhatsApp */}
      <a
        href={site.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp গ্রুপ"
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24z" /></svg>
      </a>
      {/* Messenger */}
      <a
        href={site.facebook}
        target="_blank"
        rel="noreferrer"
        aria-label="Messenger গ্রুপ"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0084FF] text-white shadow-lg transition-transform hover:scale-110"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.06 1.79c.02.57.61.94 1.13.71l2-1.05c.17-.09.37-.11.55-.06.9.25 1.86.38 2.85.38 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm6 7.46l-2.93 4.65c-.47.74-1.47.93-2.18.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.15 2.39c-.42.32-.97-.18-.69-.63l2.93-4.65c.47-.74 1.47-.93 2.18-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.15-2.39c.42-.32.97.18.69.63z" /></svg>
      </a>
    </div>
  );
}
