"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { site } from "@/data/site";
import { t, type Lang } from "@/lib/i18n";

const navLinks = [
  { href: "/", key: "nav.home" },
  { href: "/donors", key: "nav.donors" },
  { href: "/request-blood", key: "nav.needBlood" },
  { href: "/requests", key: "nav.urgent" },
  { href: "/gallery", key: "nav.gallery" },
  { href: "/blog", key: "nav.blog" },
  { href: "/about", key: "nav.about" },
  { href: "/contact", key: "nav.contact" },
];

export default function Navbar({
  profile,
  logoUrl,
  lang,
}: {
  profile: { full_name: string | null; role: string } | null;
  logoUrl?: string | null;
  lang: Lang;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/85 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          <Logo logoUrl={logoUrl} />
          <div className="leading-tight">
            <div className="text-[15px] font-bold text-ink">{site.shortName}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-brand-600">
              {t("nav.subtype", lang)}
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-0.5 xl:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {t(l.key, lang)}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <LanguageToggle lang={lang} />
          {profile ? (
            <div className="flex items-center gap-2">
              {profile.role === "admin" && (
                <Link href="/admin" className="btn-ghost !px-3 !py-2 text-xs">🛡️ {t("nav.admin", lang)}</Link>
              )}
              <Link href="/dashboard" className="btn-ghost !px-3 !py-2 text-xs">📊 {t("nav.dashboard", lang)}</Link>
              <NotificationBell />
              <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-2.5 py-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {(profile.full_name ?? "?").charAt(0)}
                </span>
                <span className="hidden text-sm font-medium text-ink lg:inline">
                  {profile.full_name?.split(" ")[0]}
                </span>
              </div>
              <button onClick={logout} className="btn-outline !px-3 !py-2 text-xs">{t("nav.logout", lang)}</button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-ghost !px-3 !py-2 text-sm">{t("nav.login", lang)}</Link>
              <Link href="/become-donor" className="btn-primary !px-4 !py-2 text-sm">{t("nav.becomeDonor", lang)}</Link>
            </>
          )}
        </div>

        <button
          aria-label="মেনু"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-zinc-100 xl:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-zinc-100 bg-white xl:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            <div className="mb-1 flex items-center justify-between px-1">
              <LanguageToggle lang={lang} />
              <ThemeToggle />
            </div>
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-brand-50 hover:text-brand-700"
              >
                {t(l.key, lang)}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              {profile ? (
                <button onClick={() => { setOpen(false); logout(); }} className="btn-outline">{t("nav.logout", lang)}</button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="btn-outline text-center">{t("nav.login", lang)}</Link>
                  <Link href="/become-donor" onClick={() => setOpen(false)} className="btn-primary text-center">{t("nav.becomeDonor", lang)}</Link>
                </>
              )}
            </div>
            <Link href="/request-blood" onClick={() => setOpen(false)} className="btn-blood mt-2 w-full">
              🚨 {t("hero.emergency", lang)}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Logo({ logoUrl }: { logoUrl?: string | null }) {
  if (logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-100">
        <img src={logoUrl} alt="লোগো" className="h-full w-full object-contain p-0.5" />
      </span>
    );
  }
  return (
    <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-sm">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M12 2s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
      </svg>
    </span>
  );
}

function MenuIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
