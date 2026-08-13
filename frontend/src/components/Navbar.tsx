"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, Search, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { openCommandPalette } from "@/lib/commandPalette";
import { SERVICE_CATEGORIES, SERVICES, serviceTitle } from "@/data/services";
import { site } from "@/data/site";
import { t, type Lang } from "@/lib/i18n";
import { useTr } from "@/lib/useLang";

const primaryLinks = [
  { href: "/", key: "nav.home" },
  { href: "/donors", key: "nav.donors" },
  { href: "/request-blood", key: "nav.needBlood" },
  { href: "/requests", key: "nav.urgent" },
  { href: "/blood-seekers", key: "nav.seekers" },
];

const mobileExtraLinks = [
  { href: "/services", key: "nav.services" },
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
  const { t: tx, lang: currentLang } = useTr();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!servicesOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-services-menu]")) setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

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
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">
              {t("nav.subtype", lang)}
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-0.5 xl:flex">
          {primaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              {t(l.key, lang)}
            </Link>
          ))}
          <div className="relative" data-services-menu>
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={() => setServicesOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              {t("nav.services", lang)}
              <ChevronDown className={`h-3.5 w-3.5 transition ${servicesOpen ? "rotate-180" : ""}`} />
            </button>
            {servicesOpen && (
              <div className="absolute left-1/2 top-full z-50 mt-2 w-[44rem] max-w-[min(44rem,calc(100vw-2rem))] -translate-x-1/2 origin-top animate-panel-in rounded-2xl border border-zinc-100 bg-white p-4 shadow-card-hover dark:border-white/10 dark:bg-slate-900">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {SERVICE_CATEGORIES.map((cat) => (
                    <div key={cat.id}>
                      <p className="px-2 text-[11px] font-bold uppercase tracking-wide text-ink/40">
                        {currentLang === "en" ? cat.titleEn : cat.titleBn}
                      </p>
                      <ul className="mt-1.5 space-y-0.5">
                        {SERVICES.filter((s) => s.category === cat.id).slice(0, 6).map((s) => (
                          <li key={s.id}>
                            <Link
                              href={s.href}
                              onClick={() => setServicesOpen(false)}
                              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ink/75 hover:bg-brand-50 hover:text-brand-700"
                            >
                              <span>{s.icon}</span>
                              <span className="truncate">{serviceTitle(s, currentLang)}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-white/10">
                  <Link href="/services" onClick={() => setServicesOpen(false)} className="text-sm font-semibold text-brand-600 hover:underline">
                    {tx("সব সেবা দেখুন →")}
                  </Link>
                  <Link href="/match" onClick={() => setServicesOpen(false)} className="text-sm font-semibold text-blood-600 hover:underline">
                    {tx("দ্রুত সহায়তা শুরু করুন →")}
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link
            href="/contact"
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-brand-50 hover:text-brand-700"
          >
            {t("nav.contact", lang)}
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label={tx("সেবা খুঁজুন…")}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-zinc-50 px-2.5 text-xs font-semibold text-ink/55 ring-1 ring-zinc-100 transition hover:bg-brand-50 hover:text-brand-700 dark:bg-white/5 dark:ring-white/10"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">{tx("সেবা খুঁজুন…")}</span>
            <kbd className="hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-ink/45 ring-1 ring-zinc-200 lg:inline dark:bg-slate-800 dark:ring-white/10">Ctrl K</kbd>
          </button>
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
          className="inline-flex h-12 w-12 items-center justify-center rounded-lg text-ink hover:bg-zinc-100 xl:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {open && (
        <div className="animate-panel-in origin-top max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain border-t border-zinc-100 bg-white/95 backdrop-blur-xl supports-[height:100dvh]:max-h-[calc(100dvh-4rem)] xl:hidden dark:border-white/10 dark:bg-slate-950/90">
          <div className="container-page flex flex-col gap-1 py-3">
            <div className="mb-1 flex items-center justify-between px-1">
              <LanguageToggle lang={lang} />
              <ThemeToggle />
            </div>
            {[...primaryLinks, ...mobileExtraLinks].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-brand-50 hover:text-brand-700"
              >
                {t(l.key, lang)}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => { setOpen(false); openCommandPalette(); }}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink/80 hover:bg-brand-50 hover:text-brand-700"
            >
              ⌘ {tx("সেবা খুঁজুন…")}
            </button>
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
  return (
    <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-zinc-100">
      {logoUrl ? (
        // Custom admin-supplied URLs remain a regular image so any valid hosted
        // logo works without changing the image-domain allowlist.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ)" width={36} height={36} className="h-full w-full rounded-full object-cover" />
      ) : (
        <Image
          src="/images/logo.png"
          alt="Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ)"
          width={36}
          height={36}
          sizes="36px"
          priority
          className="h-full w-full rounded-full object-cover"
        />
      )}
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
