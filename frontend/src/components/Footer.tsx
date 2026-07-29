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
    <footer className="mt-20 bg-brand-900 text-brand-100/90">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white/15 text-white">
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
              <div className="font-bold text-white">{site.shortName}</div>
              <div className="text-xs text-brand-200/80">{site.taglineEn}</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-brand-100/70">{lang === "en" ? site.mission : site.mission}</p>
          <div className="mt-5 flex gap-2">
            <a href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-white hover:bg-white/20">f</a>
            <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-white hover:bg-white/20">w</a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">{t("footer.quickLinks", lang)}</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-100/70">
            <li><Link className="hover:text-white" href="/donors">{t("nav.donors", lang)}</Link></li>
            <li><Link className="hover:text-white" href="/request-blood">{t("nav.needBlood", lang)}</Link></li>
            <li><Link className="hover:text-white" href="/become-donor">{t("nav.becomeDonor", lang)}</Link></li>
            <li><Link className="hover:text-white" href="/register">{t("nav.register", lang)}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">{t("footer.more", lang)}</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-100/70">
            <li><Link className="hover:text-white" href="/about">{t("nav.about", lang)}</Link></li>
            <li><Link className="hover:text-white" href="/gallery">{t("nav.gallery", lang)}</Link></li>
            <li><Link className="hover:text-white" href="/blog">{t("nav.blog", lang)}</Link></li>
            <li><Link className="hover:text-white" href="/faq">{lang === "en" ? "FAQ" : "সাধারণ প্রশ্ন"}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">{t("footer.contact", lang)}</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-100/70">
            <li className="flex gap-2">📍 <span>{address}</span></li>
            <li className="flex gap-2">📞 <span>{phone}</span></li>
            <li className="flex gap-2">✉️ <span className="break-all">{email}</span></li>
          </ul>
          <a href={facebook} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20">
            {t("footer.join", lang)}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-brand-100/60 sm:flex-row">
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
