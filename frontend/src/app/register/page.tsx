"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, AuthError, AuthSuccess } from "@/components/auth/AuthShell";
import { useTr } from "@/lib/useLang";

export default function RegisterPage() {
  const { t: tx } = useTr();
  const supabase = createClient();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (password.length < 6) {
      setError(tx("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"));
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // ইমেইল কনফার্মেশন চালু থাকলে বার্তা দেখানো; নাহলে সরাসরি লগইন
    if (data.user && !data.session) {
      setInfo(tx("ইমেইলে ভেরিফিকেশন লিংক পাঠানো হয়েছে। ইমেইল কনফার্ম করে লগইন করুন।"));
    } else if (data.session) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <AuthShell title={tx("অ্যাকাউন্ট তৈরি করুন")} subtitle={tx("রক্তদান সমিতিতে যুক্ত হোন")}>
      <form onSubmit={submit} className="space-y-4">
        {error && <AuthError text={error} />}
        {info && <AuthSuccess text={info} />}

        <div>
          <label className="label">{tx("পুরো নাম")}</label>
          <input required className="input" value={fullName}
            onChange={(e) => setFullName(e.target.value)} placeholder={tx("আপনার নাম")} />
        </div>
        <div>
          <label className="label">{tx("মোবাইল নম্বর")}</label>
          <input required className="input" value={phone}
            onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" />
        </div>
        <div>
          <label className="label">{tx("ইমেইল")}</label>
          <input type="email" required className="input" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="label">{tx("পাসওয়ার্ড")}</label>
          <input type="password" required className="input" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder={tx("কমপক্ষে ৬ অক্ষর")} />
        </div>

        <button disabled={loading} className="btn-primary w-full">
          {loading ? tx("তৈরি হচ্ছে…") : tx("অ্যাকাউন্ট তৈরি করুন")}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink/60">
        {tx("আগে থেকে অ্যাকাউন্ট আছে?")}{" "}
        <Link href="/login" className="font-semibold text-brand-600 hover:underline">
          {tx("লগইন করুন")}
        </Link>
      </p>
    </AuthShell>
  );
}
