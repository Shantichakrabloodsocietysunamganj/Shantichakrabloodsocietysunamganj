import Link from "next/link";
import { site } from "@/data/site";
import type { SiteSettings } from "@/lib/settings";
import { t, type Lang } from "@/lib/i18n";

export default function Footer({ settings, lang }: { settings: SiteSettings; lang: Lang }) {
  const phone = settings.phone || site.phone;
  const email = settings.email || site.email;
  const address = settings.address || site.address;
  const facebook = settings.facebook || site.facebook;
  const whatsapp = settings.whatsapp || site.whatsapp;

  return (
    <footer className="relative mt-24 overflow-hidden bg-slate-950 text-slate-300">
      {/* gradient hairline + glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />

      <div className="container-page relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white/10 text-white ring-1 ring-white/15">
              {settings.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.logo_url} alt="logo" className="h-full w-full object-contain" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12 2s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
                </svg>
              )}
            </span>
            <div>
              <div className="font-display font-bold text-white">{site.shortName}</div>
              <div className="text-xs text-slate-400">{site.taglineEn}</div>
            </div>
          </div>
          <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-slate-400">{site.mission}</p>
          <div className="mt-5 flex gap-2">
            <a href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 ring-1 ring-white/10 transition hover:bg-brand-600 hover:text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" /></svg>
            </a>
            <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 ring-1 ring-white/10 transition hover:bg-success-600 hover:text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24z" /></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">{t("footer.quickLinks", lang)}</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li><Link className="transition hover:text-white" href="/donors">{t("nav.donors", lang)}</Link></li>
            <li><Link className="transition hover:text-white" href="/request-blood">{t("nav.needBlood", lang)}</Link></li>
            <li><Link className="transition hover:text-white" href="/become-donor">{t("nav.becomeDonor", lang)}</Link></li>
            <li><Link className="transition hover:text-white" href="/eligibility">{t("nav.eligibility", lang)}</Link></li>
            <li><Link className="transition hover:text-white" href="/emergency">🚑 {t("nav.emergency", lang)}</Link></li>
            <li><Link className="transition hover:text-white" href="/donate">{t("nav.donate", lang)}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">{t("footer.more", lang)}</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li><Link className="transition hover:text-white" href="/about">{t("nav.about", lang)}</Link></li>
            <li><Link className="transition hover:text-white" href="/impact">{t("nav.impact", lang)}</Link></li>
            <li><Link className="transition hover:text-white" href="/media">{t("nav.media", lang)}</Link></li>
            <li><Link className="transition hover:text-white" href="/events">{t("nav.events", lang)}</Link></li>
            <li><Link className="transition hover:text-white" href="/gallery">{t("nav.gallery", lang)}</Link></li>
            <li><Link className="transition hover:text-white" href="/blog">{t("nav.blog", lang)}</Link></li>
            <li><Link className="transition hover:text-white" href="/faq">{lang === "en" ? "FAQ" : "সাধারণ প্রশ্ন"}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">{t("footer.contact", lang)}</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li className="flex gap-2">📍 <span>{address}</span></li>
            <li className="flex gap-2">📞 <span>{phone}</span></li>
            <li className="flex gap-2">✉️ <span className="break-all">{email}</span></li>
          </ul>
          <a href={facebook} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/10 transition hover:bg-white/10">
            {t("footer.join", lang)}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}। {t("footer.rights", lang)}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <a href="https://rahatahmedbd.github.io/" target="_blank" rel="noreferrer" className="font-semibold text-white hover:underline">
              💻 Developed by Rahat Ahmed
            </a>
            <span className="hidden sm:inline">•</span>
            <a href="https://rahatahmedbd.github.io/" target="_blank" rel="noreferrer" className="hover:text-white hover:underline">
              {lang === "en" ? "Need a website like this? Order →" : "আপনার সংগঠনের জন্য এরকম ওয়েবসাইট? অর্ডার করুন →"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
