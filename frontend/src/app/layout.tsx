import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/data/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";
import FloatingActions from "@/components/FloatingActions";
import CookieBanner from "@/components/CookieBanner";
import AIAssistant from "@/components/AIAssistant";
import EmergencyBanner from "@/components/EmergencyBanner";
import LiveRequestAlert from "@/components/LiveRequestAlert";
import { ToastProvider } from "@/components/Toast";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { getLang } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.meta_title || `${site.name} | রক্তদান ও জরুরি রক্তসেবা`;
  const desc = settings.meta_description || "সুনামগঞ্জ ও সিলেট বিভাগে স্বেচ্ছায় রক্তদান, রক্তদাতা খোঁজা ও জরুরি রক্তসেবা সমন্বয়ে শান্তিচক্র ব্লাড সোসাইটির সঙ্গে যুক্ত হন।";
  const keywords = settings.meta_keywords
    ? settings.meta_keywords.split(",").map((s) => s.trim())
    : [
        "শান্তিচক্র ব্লাড সোসাইটি",
        "শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ",
        "Shantichakra Blood Society",
        "Shantichakra Blood Society Sunamganj",
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
    title: { default: title, template: `%s | ${site.name}` },
    description: desc,
    keywords,
    metadataBase: new URL("https://shanticakrabloodsocaiety.rahatahmed.site"),
    openGraph: {
      title,
      description: desc,
      type: "website",
      locale: "bn_BD",
      siteName: site.name,
      url: "https://shanticakrabloodsocaiety.rahatahmed.site",
      ...(settings.og_image ? { images: [{ url: settings.og_image }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description: desc, ...(settings.og_image ? { images: [settings.og_image] } : {}) },
    alternates: { canonical: "/" },
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
    category: "health",
  };
}

export const viewport = { themeColor: "#0b4f9c", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await getSession();
  const settings = await getSettings();
  const lang = await getLang();

  const SITE_URL = "https://shanticakrabloodsocaiety.rahatahmed.site";
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    alternateName: "Shantichakra Blood Society Sunamganj",
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
    name: site.name,
    alternateName: "Shantichakra Blood Society Sunamganj",
    url: SITE_URL,
    description: "সুনামগঞ্জ ও সিলেট বিভাগে স্বেচ্ছায় রক্তদান, রক্তদাতা খোঁজা ও জরুরি রক্তসেবা সমন্বয়ে শান্তিচক্র ব্লাড সোসাইটি।",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
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
        <ToastProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white">
            {lang === "en" ? "Skip to content" : "মূল বিষয়বস্তুতে যান"}
          </a>
          <ScrollProgress />
          <Navbar profile={profile} logoUrl={settings.logo_url} lang={lang} />
          <EmergencyBanner />
          <main id="main" className="min-h-[60vh]">{children}</main>
          <Footer settings={settings} lang={lang} />
          <BackToTop />
          <FloatingActions />
          <LiveRequestAlert />
          <AIAssistant />
          <CookieBanner />
        </ToastProvider>
      </body>
    </html>
  );
}
