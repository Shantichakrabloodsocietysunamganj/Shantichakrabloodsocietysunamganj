"use client";

import { site } from "@/data/site";

// ভাসমান WhatsApp + Messenger বোতাম (ডান নিচে)
export default function FloatingActions() {
  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
      <a
        href={site.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp গ্রুপ"
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.512 5.26l-.999 3.648 3.476-.907z"/></svg>
      </a>
      <a
        href={site.facebook}
        target="_blank"
        rel="noreferrer"
        aria-label="Messenger গ্রুপ"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0084FF] text-white shadow-lg transition-transform hover:scale-110"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.06 1.79c.02.57.61.94 1.13.71l2-1.05c.17-.09.37-.11.55-.06.9.25 1.86.38 2.85.38 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm6 7.46l-2.93 4.65c-.47.74-1.47.93-2.18.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.15 2.39c-.42.32-.97-.18-.69-.63l2.93-4.65c.47-.74 1.47-.93 2.18-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.15-2.39c.42-.32.97.18.69.63z"/></svg>
      </a>
    </div>
  );
}
