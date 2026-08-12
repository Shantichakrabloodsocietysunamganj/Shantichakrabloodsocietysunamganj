import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Droplets, Handshake, MapPin } from "lucide-react";
import Hero from "@/components/home/Hero";
import HeartbeatLine from "@/components/home/HeartbeatLine";
import BloodGroupFinder from "@/components/home/BloodGroupFinder";
import BloodAvailability from "@/components/home/BloodAvailability";
import Leaderboard from "@/components/home/Leaderboard";
import CompatibilityChart from "@/components/home/CompatibilityChart";
import Faq from "@/components/home/Faq";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import Newsletter from "@/components/Newsletter";
import DonorCard from "@/components/DonorCard";
import TrustBand from "@/components/home/TrustBand";
import ActivityFeed from "@/components/home/ActivityFeed";
import LiveSeekers from "@/components/home/LiveSeekers";
import DonationSection from "@/components/home/DonationSection";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/data/site";
import { t, tr, type Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { getSettings } from "@/lib/settings";
import type { Donor } from "@/lib/types";
import { shortDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ | রক্তদান ও জরুরি রক্তসেবা",
  description: "সুনামগঞ্জ ও সিলেট বিভাগে স্বেচ্ছায় রক্তদান, রক্তদাতা খোঁজা ও জরুরি রক্তসেবা সমন্বয়ে শান্তিচক্র ব্লাড সোসাইটির সঙ্গে যুক্ত হন।",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://shantichakrabloodsociety.rahatahmed.site/" },
  openGraph: {
    title: "শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ | রক্তদান ও জরুরি রক্তসেবা",
    description: "সুনামগঞ্জ ও সিলেট বিভাগে স্বেচ্ছায় রক্তদান, রক্তদাতা খোঁজা ও জরুরি রক্তসেবা সমন্বয়ে শান্তিচক্র ব্লাড সোসাইটির সঙ্গে যুক্ত হন।",
    url: "https://shantichakrabloodsociety.rahatahmed.site/",
    type: "website",
    siteName: "শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ",
  },
};

async function getData() {
  const supabase = createClient();
  try {
    const [donors, openReqs, featured, events, testimonials, faqItems, partnersData] = await Promise.all([
      supabase.from("donors").select("*", { count: "exact", head: true }),
      supabase.from("blood_requests").select("*", { count: "exact", head: true }).in("status", ["pending", "approved"]),
      supabase.from("donors").select("*").eq("approved", true).order("is_available", { ascending: false }).order("created_at", { ascending: false }).limit(3),
      supabase.from("events").select("*").eq("status", "upcoming").order("event_date", { ascending: true }).limit(3),
      supabase.from("testimonials").select("*").eq("approved", true).order("created_at", { ascending: false }).limit(3),
      supabase.from("faqs").select("question, answer").order("order", { ascending: true }),
      supabase.from("partners").select("name, logo_url").order("order", { ascending: true }),
    ]);
    return {
      donorCount: donors.count ?? 0,
      openRequestCount: openReqs.count ?? 0,
      featuredDonors: (featured.data as Donor[] | null) ?? [],
      events: (events.data as any[] | null) ?? [],
      testimonials: (testimonials.data as any[] | null) ?? [],
      faqs: (faqItems.data as any[] | null) ?? [],
      partners: (partnersData.data as any[] | null) ?? [],
      ok: !donors.error,
    };
  } catch {
    return { donorCount: 0, openRequestCount: 0, featuredDonors: [], events: [], testimonials: [], faqs: [], partners: [], ok: false };
  }
}

export default async function Home() {
  const { donorCount, openRequestCount, featuredDonors, events, testimonials, faqs, partners, ok } = await getData();
  const lang = await getLang();
  const tx = (v: string) => tr(v, lang);
  const settings = await getSettings();
  const livesSaved = site.stats.livesSaved || donorCount;

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ | রক্তদান ও জরুরি রক্তসেবা",
    url: "https://shantichakrabloodsociety.rahatahmed.site/",
    inLanguage: lang === "en" ? "en" : "bn",
    isPartOf: { "@type": "WebSite", url: "https://shantichakrabloodsociety.rahatahmed.site", name: site.name },
    about: { "@type": "NGO", name: site.name },
    description: "সুনামগঞ্জ ও সিলেট বিভাগে স্বেচ্ছায় রক্তদান, রক্তদাতা খোঁজা ও জরুরি রক্তসেবা সমন্বয়ে শান্তিচক্র ব্লাড সোসাইটির সঙ্গে যুক্ত হন।",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <Hero donorCount={donorCount} openRequestCount={openRequestCount} lang={lang} heroBadge={settings.hero_badge} heroDesc={settings.hero_desc} />

      {/* পরিসংখ্যান - count-up */}
      <section className="container-page relative z-10 -mt-8">
        <div className="card relative grid grid-cols-2 gap-4 overflow-hidden px-6 py-8 sm:grid-cols-4 sm:gap-6 lg:px-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
          <Stat value={donorCount} label={t("home.stats.donors", lang)} />
          <Stat value={openRequestCount} label={t("home.stats.requests", lang)} accent="text-blood-600" />
          <Stat value={livesSaved} label={t("home.stats.lives", lang)} suffix="+" />
          <Stat value={site.stats.upazilas} label={t("home.stats.upazilas", lang)} />
        </div>
        <div className="mt-4">
          <HeartbeatLine lang={lang} />
        </div>
        <div className="mt-4">
          <Reveal><BloodGroupFinder lang={lang} /></Reveal>
        </div>
      </section>

      {/* Blood Availability */}
      <section className="container-page py-12">
        <Reveal><SectionHeading eyebrow={lang === "en" ? "Live Status" : "লাইভ স্ট্যাটাস"} title={lang === "en" ? "Blood Group Availability" : "রক্তের গ্রুপ অনুযায়ী দাতা"} subtitle={lang === "en" ? "Real-time donor availability by blood group." : "প্রতিটি গ্রুপে কতজন প্রস্তুত দাতা আছেন — লাইভ।"} /></Reveal>
        <div className="mt-8"><BloodAvailability lang={lang} /></div>
      </section>

      {/* Leaderboard */}
      <section className="bg-white py-12">
        <div className="container-page">
          <Reveal><SectionHeading eyebrow={lang === "en" ? "Top Donors" : "শীর্ষ দাতা"} title={lang === "en" ? "Donor Leaderboard" : "দাতা তালিকা"} subtitle={lang === "en" ? "Our heroes who stepped up first." : "যারা প্রথম এগিয়ে এলেন — আমাদের নায়ক।"} /></Reveal>
          <div className="mt-8"><Leaderboard lang={lang} /></div>
          <div className="mt-8 flex justify-center">
            <Link href="/become-donor" className="btn-primary">{lang === "en" ? "Apply to be a donor →" : "রক্তদাতা হিসেবে আবেদন করুন →"}</Link>
          </div>
        </div>
      </section>

      {/* কীভাবে কাজ করে */}
      <section className="container-page py-16 sm:py-20">
        <Reveal><SectionHeading eyebrow={t("home.how.eyebrow", lang)} title={t("home.how.title", lang)}
          subtitle={t("home.how.sub", lang)} /></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Reveal delay={0}><Step n="1" title={t("home.step1", lang)} desc={t("home.step1d", lang)} href="/become-donor" cta={t("home.register", lang)} /></Reveal>
          <Reveal delay={120}><Step n="2" title={t("home.step2", lang)} desc={t("home.step2d", lang)} href="/request-blood" cta={t("home.request", lang)} /></Reveal>
          <Reveal delay={240}><Step n="3" title={t("home.step3", lang)} desc={t("home.step3d", lang)} href="/donors" cta={t("home.find", lang)} /></Reveal>
        </div>
      </section>

      {/* আসন্ন কর্মসূচি / Events */}
      {events.length > 0 && (
        <section className="container-page py-16 sm:py-20">
          <Reveal><SectionHeading eyebrow={lang === "en" ? "Upcoming" : "আসন্ন"} title={lang === "en" ? "Upcoming Events" : "আসন্ন কর্মসূচি"} subtitle={lang === "en" ? "Join our next blood donation camps and programs." : "আমাদের পরবর্তী রক্তদান শিবির ও কর্মসূচিতে যুক্ত হোন।"} /></Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {events.map((e: any, i: number) => (
              <Reveal key={e.id} delay={i * 100}><EventCard event={e} lang={lang} /></Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Trust & Credibility */}
      <TrustBand lang={lang} donorCount={donorCount} requestCount={openRequestCount} />

      {/* Premium Donation Section */}
      <DonationSection lang={lang} donorCount={donorCount} />

      {/* রক্ত সামঞ্জস্যতা */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading center={false} eyebrow={lang === "en" ? "Compatibility" : "রক্ত সামঞ্জস্যতা"}
              title={lang === "en" ? "Which groups match?" : "কোন গ্রুপ কার সাথে মেলে?"}
              subtitle={lang === "en" ? "Matching blood correctly is critical — wrong group blood can be fatal." : "সঠিক রক্ত মিলানো জরুরি — ভুল গ্রুপের রক্ত প্রাণঘাতী হতে পারে।"} />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {site.highlights.map((h) => (
                <div key={h.title} className="flex items-start gap-3 rounded-xl bg-canvas p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon name={h.icon} className="h-5 w-5" />
                  </span>
                  <div><p className="font-semibold text-ink">{tx(h.title)}</p><p className="text-sm text-ink/60">{tx(h.desc)}</p></div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}><CompatibilityChart lang={lang} /></Reveal>
        </div>
      </section>

      {/* ফিচার্ড রক্তদাতা */}
      <section className="container-page py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal><SectionHeading center={false} eyebrow={t("home.donors.eyebrow", lang)} title={t("home.donors.title", lang)}
            subtitle={t("home.donors.sub", lang)} /></Reveal>
          <Link href="/donors" className="btn-outline shrink-0">{t("home.viewAll", lang)}</Link>
        </div>
        <div className="mt-10">
          {ok && featuredDonors.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredDonors.map((d, i) => <Reveal key={d.id} delay={i * 100}><DonorCard donor={d} lang={lang} /></Reveal>)}
            </div>
          ) : ok && featuredDonors.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Droplets className="h-7 w-7" />
              </div>
              <p className="font-medium text-ink">{lang === "en" ? "No donors registered yet" : "এখনো কেউ নিবন্ধন করেননি"}</p>
              <p className="mt-1 text-sm text-ink/60">{lang === "en" ? "Be the first to join!" : "প্রথম রক্তদাতা হিসেবে যুক্ত হোন!"}</p>
              <Link href="/become-donor" className="btn-primary mt-5">{t("nav.becomeDonor", lang)}</Link>
            </div>
          ) : (
            <p className="text-center text-sm text-ink/50">{lang === "en" ? "Could not load donors." : "রক্তদাতা তালিকা লোড করা যায়নি।"}</p>
          )}
        </div>
      </section>

      {/* এই মুহূর্তে যাঁরা রক্ত খুঁজছেন — লাইভ রক্তপ্রার্থী */}
      <LiveSeekers lang={lang} />

      {/* Real-time Activity Feed */}
      <ActivityFeed lang={lang} />

      {/* সাফল্যের গল্প / Testimonials */}
      <section className="bg-brand-900 py-16 text-white sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-100">{lang === "en" ? "Success Stories" : "সাফল্যের গল্প"}</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">{lang === "en" ? "Your Experiences" : "আপনাদের অভিজ্ঞতা"}</h2>
            <p className="mt-3 text-base text-brand-100/70">{lang === "en" ? "Lives this network has touched." : "যাদের জীবন এই নেটওয়ার্ক ছুঁয়ে গেছে।"}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(testimonials.length > 0 ? testimonials : site.successStories).map((s: any, i: number) => (
              <Reveal key={s.id ?? i} delay={i * 100}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="mb-3 text-amber-300">{"★".repeat(s.rating ?? 5)}</div>
                  <p className="text-sm leading-relaxed text-brand-100/90">“{tx(s.message ?? s.text)}”</p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blood-500 text-sm font-bold text-white">{(tx(s.name ?? "?")).charAt(0)}</span>
                    <div>
                      <p className="font-semibold text-white">{tx(s.name)}</p>
                      <p className="text-xs text-brand-100/70">{tx(s.role)}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          <Reveal><SectionHeading eyebrow={lang === "en" ? "FAQ" : "সাধারণ প্রশ্ন"} title={lang === "en" ? "Frequently Asked Questions" : "প্রায়শই জিজ্ঞাসিত প্রশ্ন"} /></Reveal>
          <div className="mt-10"><Faq items={faqs.length > 0 ? faqs : undefined} /></div>
        </div>
      </section>

      {/* Partners */}
      {partners.length > 0 && (
        <section className="border-y border-zinc-100 bg-white py-10">
          <div className="container-page">
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-ink/40">{lang === "en" ? "Our Partners" : "আমাদের সহযোগী"}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {partners.map((p: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-lg font-bold text-ink/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.logo_url ? <img src={p.logo_url} alt={`${p.name} - সহযোগী প্রতিষ্ঠান লোগো, শান্তিচক্র ব্লাড সোসাইটি`} className="h-8 w-8 object-contain opacity-60" /> : <Handshake className="h-6 w-6 opacity-70" strokeWidth={1.8} />}
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <Newsletter />

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-blood-600 px-8 py-14 text-center text-white sm:px-16">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <h2 className="text-2xl font-bold sm:text-3xl">{t("home.cta.title", lang)}</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-50">{t("home.cta.sub", lang)}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/become-donor" className="btn-white">{t("home.cta.btn", lang)}</Link>
            <Link href="/donors" className="btn border border-white/40 text-white hover:bg-white/10">{t("hero.findDonors", lang)}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label, accent = "text-brand-600", suffix = "" }: { value: number; label: string; accent?: string; suffix?: string }) {
  return (
    <div className="text-center">
      <p className={`font-display text-4xl font-extrabold tracking-tight sm:text-5xl ${accent}`}>
        <CountUp end={value} suffix={suffix} />
      </p>
      <p className="mt-1.5 text-sm font-medium text-ink/60">{label}</p>
    </div>
  );
}

function Step({ n, title, desc, href, cta }: { n: string; title: string; desc: string; href: string; cta: string }) {
  return (
    <div className="card-hover relative p-6">
      <span className="absolute -top-4 left-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 font-display text-lg font-extrabold text-white shadow-glow">{n}</span>
      <div className="pt-5">
        <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">{desc}</p>
        <Link href={href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:gap-2 hover:text-brand-700">{cta} →</Link>
      </div>
    </div>
  );
}

function EventCard({ event, lang }: { event: any; lang: string }) {
  const tx = (v: string) => tr(v, lang as Lang);
  return (
    <div className="card-hover overflow-hidden">
      {event.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.cover_url} alt={`${tx(event.title)} — ${tx("রক্তদান কর্মসূচি, সুনামগঞ্জ")}`} className="h-40 w-full object-cover" />
      )}
      <div className="p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600">
          <CalendarDays className="h-3.5 w-3.5" /> {shortDate(event.event_date, lang as Lang)}
        </span>
        <h3 className="mt-3 font-display text-lg font-bold text-ink">{tx(event.title)}</h3>
        {event.location && <p className="mt-1 flex items-center gap-1 text-sm text-ink/50"><MapPin className="h-3.5 w-3.5" /> {event.location}</p>}
        {event.description && <p className="mt-2 line-clamp-2 text-sm text-ink/60">{event.description}</p>}
      </div>
    </div>
  );
}
