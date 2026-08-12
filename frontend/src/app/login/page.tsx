"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, AuthError } from "@/components/auth/AuthShell";
import { useLangClient } from "@/lib/i18n";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const lang = useLangClient();
  const en = lang === "en";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <AuthShell title={en ? "Login" : "লগইন করুন"} subtitle={en ? "Enter your account" : "আপনার অ্যাকাউন্টে প্রবেশ করুন"}>
      <form onSubmit={submit} className="space-y-4">
        {error && <AuthError text={error} />}
        <div>
          <label className="label">{en ? "Email" : "ইমেইল"}</label>
          <input
            type="email" required className="input" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="label">{en ? "Password" : "পাসওয়ার্ড"}</label>
          <input
            type="password" required className="input" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
          />
        </div>
        <button disabled={loading} className="btn-primary w-full">
          {loading ? (en ? "Logging in…" : "লগইন হচ্ছে…") : (en ? "Login" : "লগইন")}
        </button>
      </form>

      <div className="mt-5 space-y-2 text-center text-sm">
        <p className="text-ink/60">
          {en ? "Forgot password?" : "পাসওয়ার্ড মনে নেই?"}{" "}
          <Link href="/forgot-password" className="font-semibold text-brand-600 hover:underline">
            {en ? "Reset" : "রিসেট করুন"}
          </Link>
        </p>
        <p className="text-ink/60">
          {en ? "New here?" : "নতুন এখানে?"}{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">
            {en ? "Create account" : "অ্যাকাউন্ট তৈরি করুন"}
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
