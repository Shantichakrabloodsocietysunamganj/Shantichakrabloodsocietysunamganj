import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/data/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";
import FloatingActions from "@/components/FloatingActions";
import CookieBanner from "@/components/CookieBanner";
import EmergencyBanner from "@/components/EmergencyBanner";
import { ToastProvider } from "@/components/Toast";
import LanguageProvider from "@/components/LanguageProvider";
import DeferredGlobalTools from "@/components/DeferredGlobalTools";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { getLang } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.meta_title || "Shantichakra Blood Society Sunamganj | শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ — রক্তদান ও জরুরি রক্তসেবা";
  const desc = settings.meta_description || "Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ) is a community service blood donation organization in Bangladesh providing emergency blood assistance across Sunamganj and Sylhet. সুনামগঞ্জ ও সিলেট বিভাগে স্বেচ্ছায় রক্তদান, রক্তদাতা খোঁজা ও জরুরি রক্তসেবায় আমাদের সঙ্গে যুক্ত হন।";
  const keywords = settings.meta_keywords
    ? settings.meta_keywords.split(",").map((s) => s.trim())
    : [
        "Shantichakra Blood Society Sunamganj",
        "Shantichakra Blood Society",
        "Shantichakra Blood Society Bangladesh",
        "Shantichakra blood donation",
        "blood donation Sunamganj",
        "blood donor Sunamganj",
        "emergency blood support Sunamganj",
        "শান্তিচক্র ব্লাড সোসাইটি",
        "শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ",
        "সুনামগঞ্জ রক্তদান",
        "সুনামগঞ্জ রক্তদাতা",
        "সুনামগঞ্জ রক্তের প্রয়োজন",
        "সুনামগঞ্জ জরুরি রক্ত",
        "শান্তিগঞ্জ রক্তদাতা",
        "সিলেট বিভাগ রক্তদাতা",
        "সিলেট রক্তদান সংগঠন",
        "সুনামগঞ্জ স্বেচ্ছাসেবী সংগঠন",
        "রক্তদাতা খুঁজুন",
        "রক্তদাতা হিসেবে নিবন্ধন",
        "জরুরি রক্তের অনুরোধ",
        "A+ রক্তদাতা সুনামগঞ্জ",
        "B+ রক্তদাতা সুনামগঞ্জ",
        "O+ রক্তদাতা সুনামগঞ্জ",
        "জরুরি রক্ত সেবা সুনামগঞ্জ",
      ];

  return {
    title: { default: title, template: "%s | Shantichakra Blood Society Sunamganj" },
    description: desc,
    keywords,
    metadataBase: new URL("https://shantichakrabloodsociety.rahatahmed.site"),
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title,
      description: desc,
      type: "website",
      locale: "bn_BD",
      siteName: "Shantichakra Blood Society Sunamganj",
      url: "https://shantichakrabloodsociety.rahatahmed.site/",
      images: [{ url: settings.og_image || "/opengraph-image", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [settings.og_image || "/opengraph-image"],
    },
    alternates: {
      canonical: "/",
    },
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
    category: "health",
  };
}

export const viewport = { themeColor: "#0b4f9c", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await getSession();
  const settings = await getSettings();
  const lang = await getLang();

  const SITE_URL = "https://shantichakrabloodsociety.rahatahmed.site";
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "NGO"],
    name: "Shantichakra Blood Society Sunamganj",
    alternateName: "শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ",
    url: SITE_URL,
    logo: settings.logo_url || `${SITE_URL}/images/logo.png`,
    description: site.mission.slice(0, 280),
    foundingDate: "2024",
    telephone: settings.phone || site.phone,
    email: settings.email || site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "শান্তিগঞ্জ",
      addressLocality: "শান্তিগঞ্জ, সুনামগঞ্জ",
      addressRegion: "সিলেট",
      addressCountry: "BD",
    },
    areaServed: "Sylhet Division, Bangladesh",
    sameAs: [settings.facebook || site.facebook].filter(Boolean),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Shantichakra Blood Society Sunamganj",
    alternateName: "শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ",
    url: SITE_URL,
    inLanguage: lang === "en" ? "en" : "bn",
    description: "Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ) — রক্তদান ও জরুরি রক্তসেবা",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/donors?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}` }} />
        {settings.ga_id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga_id}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${settings.ga_id}');` }} />
          </>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body className="font-sans bg-canvas text-ink antialiased">
        <LanguageProvider lang={lang}>
        <ToastProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white">
            {lang === "en" ? "Skip to content" : "মূল বিষয়বস্তুতে যান"}
          </a>
          <ScrollProgress />
          <Navbar profile={profile} logoUrl={settings.logo_url} lang={lang} />
          <EmergencyBanner />
          <main id="main" className="min-h-[60vh] min-w-0 overflow-x-clip">{children}</main>
          <Footer settings={settings} lang={lang} />
          <BackToTop />
          <FloatingActions />
          <DeferredGlobalTools />
          <CookieBanner />
        </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
