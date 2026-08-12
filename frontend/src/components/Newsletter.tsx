"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useToast } from "@/components/Toast";
import { t, useLangClient } from "@/lib/i18n";

export default function Newsletter() {
  const toast = useToast();
  const lang = useLangClient();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setEmail("");
      toast("success", t("newsletter.success", lang));
    }, 600);
  };

  return (
    <section className="container-page pb-20">
      <div className="card overflow-hidden">
        <div className="grid items-center gap-6 p-8 sm:p-10 md:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight text-ink"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Mail className="h-5 w-5" /></span> {t("newsletter.title", lang)}</h2>
            <p className="mt-2 text-ink/60">{t("newsletter.sub", lang)}</p>
          </div>
          <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder", lang)}
              className="input"
            />
            <button disabled={busy} className="btn-primary shrink-0">{busy ? "…" : t("newsletter.btn", lang)}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
