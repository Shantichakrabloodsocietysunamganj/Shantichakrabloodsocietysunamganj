"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { site } from "@/data/site";
import { t, type Lang } from "@/lib/i18n";
import { useTr } from "@/lib/useLang";

const navLinks = [
  { href: "/", key: "nav.home" },
  { href: "/donors", key: "nav.donors" },
  { href: "/request-blood", key: "nav.needBlood" },
  { href: "/requests", key: "nav.urgent" },
  { href: "/blood-seekers", key: "nav.seekers" },
  { href: "/gallery", key: "nav.gallery" },
  { href: "/blog", key: "nav.blog" },
  { href: "/about", key: "nav.about" },
  { href: "/impact", key: "nav.impact" },
  { href: "/media", key: "nav.media" },
  { href: "/events", key: "nav.events" },
  { href: "/donate", key: "nav.donate" },
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
  const { t: tx } = useTr();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const next = window.scrollY > 8;
      setScrolled((current) => (current === next ? current : next));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-zinc-200/70 bg-white/80 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70"
          : "border-b border-transparent bg-white/60 backdrop-blur-md dark:bg-slate-950/40"
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <Logo logoUrl={logoUrl} />
          <div className="leading-tight">
            <div className="font-display text-[15px] font-extrabold tracking-tight text-ink">{tx(site.shortName)}</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-600">
              {t("nav.subtype", lang)}
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-0.5 xl:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-brand-50 hover:text-brand-700"
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
              {(profile.role === "admin" || profile.role === "moderator") && (
                <Link href="/admin" className="btn-ghost inline-flex items-center gap-1.5 !px-3 !py-2 text-xs"><Shield className="h-3.5 w-3.5" /> {profile.role === "admin" ? t("nav.admin", lang) : "মডারেটর"}</Link>
              )}
              <Link href="/dashboard" className="btn-ghost inline-flex items-center gap-1.5 !px-3 !py-2 text-xs"><LayoutDashboard className="h-3.5 w-3.5" /> {t("nav.dashboard", lang)}</Link>
              <NotificationBell />
              <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-2.5 py-1.5 ring-1 ring-zinc-100 dark:bg-white/5 dark:ring-white/10">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-xs font-bold text-white">
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
          aria-label={tx("মেনু")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-zinc-100 xl:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {open && (
        <div className="animate-panel-in origin-top border-t border-zinc-100 bg-white/95 backdrop-blur-xl xl:hidden dark:border-white/10 dark:bg-slate-950/90">
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
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="btn-outline text-center">{t("nav.dashboard", lang)}</Link>
                  <button onClick={() => { setOpen(false); logout(); }} className="btn-outline">{t("nav.logout", lang)}</button>
                </>
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
  const { t: tx } = useTr();
  return (
    <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-zinc-100">
      <Image src={logoUrl || "/images/logo.png"} alt={tx("শান্তিচক্র ব্লাড সোসাইটি লোগো - সুনামগঞ্জ স্বেচ্ছাসেবী রক্তদান সংগঠন")} width={36} height={36} sizes="36px" className="h-full w-full rounded-full object-cover" />
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
