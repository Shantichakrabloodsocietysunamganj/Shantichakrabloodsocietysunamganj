"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useTr } from "@/lib/useLang";

// Cookie consent banner
export default function CookieBanner() {
  const { t: tx } = useTr();
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
        <p className="flex flex-1 items-center justify-center gap-2 text-center text-sm text-ink/70 sm:justify-start sm:text-left">
          <Cookie className="h-4 w-4 shrink-0 text-amber-500" />
          <span>{tx("এই সাইট আপনার অভিজ্ঞতা উন্নত করতে কুকি ব্যবহার করে। চালিয়ে যাওয়া মানে আপনি এতে সম্মত।")}{" "}
          <Link href="/privacy" className="font-medium text-brand-600 hover:underline">{tx("গোপনীয়তা নীতি পড়ুন")}</Link></span>
        </p>
        <button onClick={accept} className="btn-primary shrink-0 !px-4 !py-2 text-xs">{tx("ঠিক আছে")}</button>
      </div>
    </div>
  );
}
