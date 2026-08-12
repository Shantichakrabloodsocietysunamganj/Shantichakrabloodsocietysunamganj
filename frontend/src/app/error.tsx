"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTr } from "@/lib/useLang";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t: tx } = useTr();
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl">🩸</div>
      <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink">
        {tx("কিছু একটা সমস্যা হয়েছে")}
      </h1>
      <p className="mt-2 max-w-md text-ink/60">
        {tx("দুঃখিত, পেজটি লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন অথবা হোমে ফিরে যান।")}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="btn-primary">{tx("আবার চেষ্টা করুন")}</button>
        <Link href="/" className="btn-outline">{tx("হোমে যান")}</Link>
      </div>
    </div>
  );
}
