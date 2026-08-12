"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, AuthError, AuthSuccess } from "@/components/auth/AuthShell";
import { useTr } from "@/lib/useLang";

export default function ForgotPasswordPage() {
  const { t: tx } = useTr();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/login`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  };

  return (
    <AuthShell title={tx("পাসওয়ার্ড রিসেট")} subtitle={tx("রিসেট লিংকের জন্য ইমেইল দিন")}>
      {done ? (
        <div className="text-center">
          <AuthSuccess text={tx("রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে। ইনবক্স চেক করুন।")} />
          <Link href="/login" className="btn-outline mt-5">{tx("লগইন পেজে ফিরুন")}</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <AuthError text={error} />}
          <div>
            <label className="label">{tx("ইমেইল")}</label>
            <input type="email" required className="input" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <button disabled={loading} className="btn-primary w-full">
            {loading ? tx("পাঠানো হচ্ছে…") : tx("রিসেট লিংক পাঠান")}
          </button>
        </form>
      )}
      <p className="mt-5 text-center text-sm text-ink/60">
        <Link href="/login" className="font-semibold text-brand-600 hover:underline">
          {tx("← লগইনে ফিরুন")}
        </Link>
      </p>
    </AuthShell>
  );
}
