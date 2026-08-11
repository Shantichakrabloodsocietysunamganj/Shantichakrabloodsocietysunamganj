"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

// Cookie consent banner
export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("cookie-ok")) setShow(true);
    } catch {}
  }, []);

  const accept = () => {
    try { localStorage.setItem("cookie-ok", "1"); } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-fade-up p-4">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-glow backdrop-blur-md sm:flex-row">
        <p className="flex-1 text-center text-sm text-ink/70 sm:text-left">
          <Cookie className="mr-1.5 inline h-4 w-4 text-amber-600" />এই সাইট আপনার অভিজ্ঞতা উন্নত করতে কুকি ব্যবহার করে। চালিয়ে যাওয়া মানে আপনি এতে সম্মত।{" "}
          <Link href="/privacy" className="font-medium text-brand-600 hover:underline">বিস্তারিত</Link>
        </p>
        <button onClick={accept} className="btn-primary shrink-0 !px-4 !py-2 text-xs">ঠিক আছে</button>
      </div>
    </div>
  );
}
