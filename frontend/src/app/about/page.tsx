import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Code, Droplets, Globe, GraduationCap, Images, MapPin, Newspaper, Star, Target } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/data/site";
import { getLang } from "@/lib/i18n-server";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";
import { t, tr, type Lang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে | শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ",
  description:
    "শান্তিচক্র ব্লাড সোসাইটির প্রতিষ্ঠা, উদ্দেশ্য, স্বেচ্ছাসেবী কার্যক্রম ও সিলেট বিভাগে রক্তসেবা নেটওয়ার্ক সম্পর্কে জানুন।",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "আমাদের সম্পর্কে | শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ",
    description:
      "শান্তিচক্র ব্লাড সোসাইটির প্রতিষ্ঠা, উদ্দেশ্য, স্বেচ্ছাসেবী কার্যক্রম ও সিলেট বিভাগে রক্তসেবা নেটওয়ার্ক সম্পর্কে জানুন।",
    url: "https://shantichakrabloodsociety.rahatahmed.site/about",
    type: "website",
  },
};

type Member = { id: string; name: string; role: string; photo_url: string | null };

async function getCommittee() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("committee_members")
      .select("id, name, role, photo_url, category")
      .order("order", { ascending: true });
    if (error || !data) return { ok: false, list: [] as (Member & { category: string })[] };
    return { ok: true, list: data as (Member & { category: string })[] };
  } catch {
    return { ok: false, list: [] as (Member & { category: string })[] };
  }
}

export default async function AboutPage() {
  const { ok, list } = await getCommittee();
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  const founders = ok ? list.filter((m) => m.category === "founder") : site.founders.map((f) => ({ ...f, id: f.name, photo_url: (f as any).photo_url ?? null }));
  const advisors = ok ? list.filter((m) => m.category === "advisor") : [];
  const members = ok ? list.filter((m) => m.category === "member") : site.volunteers.map((v) => ({ ...v, id: v.name, photo_url: null }));

  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("আমাদের সম্পর্কে"), url: "https://shantichakrabloodsociety.rahatahmed.site/about" },
        ]}
      />
      <LocalBusinessJsonLd />
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 to-white py-16 dark:from-slate-950 dark:to-slate-900">
        <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-blood-200/40 blur-3xl" />
        <div className="container-page relative max-w-3xl text-center">
          <span className="eyebrow">{t("about.eyebrow", lang)}</span>
          <h1 className="section-title mt-4 text-4xl sm:text-5xl">{tx(site.name)}</h1>
          <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink/60">{tx(site.mission)}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/become-donor" className="btn-primary">{t("about.join", lang)}</Link>
            <Link href="/donors" className="btn-outline">{t("hero.findDonors", lang)}</Link>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal><div className="card h-full p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Target className="h-6 w-6" strokeWidth={1.8} /></div>
            <h2 className="mt-4 text-xl font-bold text-zinc-900">{t("about.mission", lang)}</h2>
            <p className="mt-2 leading-relaxed text-zinc-600">{tx(site.mission)}</p>
          </div></Reveal>
          <Reveal delay={120}><div className="card h-full p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600"><Star className="h-6 w-6" strokeWidth={1.8} /></div>
            <h2 className="mt-4 text-xl font-bold text-zinc-900">{t("about.vision", lang)}</h2>
            <p className="mt-2 leading-relaxed text-zinc-600">{tx(site.vision)}</p>
          </div></Reveal>
        </div>
      </section>

      <section className="bg-zinc-50 py-16">
        <div className="container-page">
          <Reveal><SectionHeading eyebrow={t("about.values.eyebrow", lang)} title={t("about.values.title", lang)} /></Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="card h-full p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Icon name={v.icon} className="h-6 w-6" strokeWidth={1.8} /></div>
                  <h3 className="mt-3 font-semibold text-zinc-900">{tx(v.title)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{tx(v.desc)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <Reveal><SectionHeading eyebrow={t("about.team.eyebrow", lang)} title={t("about.team.title", lang)} subtitle={t("about.team.sub", lang)} /></Reveal>
        {founders.length > 0 && <PeopleGroup lang={lang} title={t("about.founders", lang)} people={founders} />}
        {advisors.length > 0 && <PeopleGroup lang={lang} title={t("about.advisors", lang)} people={advisors} />}
        {members.length > 0 && <PeopleGroup lang={lang} title={t("about.committee", lang)} people={members} />}
      </section>

      {/* খবরে আমরা / In the News */}
      <section className="bg-zinc-50 py-16">
        <div className="container-page">
          <Reveal><SectionHeading eyebrow={lang === "en" ? "Media Coverage" : "গণমাধ্যমে"} title={lang === "en" ? "Shantichakra in the News" : "খবরে শান্তিচক্র"} subtitle={lang === "en" ? "Where the press has covered our work." : "বিভিন্ন গণমাধ্যমে আমাদের কার্যক্রমের প্রতিবেদন।"} /></Reveal>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {PRESS.map((p, i) => (
              <Reveal key={p.url} delay={i * 80}>
                <a href={p.url} target="_blank" rel="noreferrer" className="card-hover flex h-full flex-col gap-2 p-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600"><Newspaper className="h-3.5 w-3.5" /> {p.source}</span>
                    <span className="text-xs text-ink/40">{tx(p.date)}</span>
                  </div>
                  <p className="font-display text-sm font-bold leading-snug text-ink">{tx(p.title)}</p>
                  <span className="mt-auto text-xs font-semibold text-brand-600">{lang === "en" ? "Read article →" : "পড়ুন →"}</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section — https://www.rahatahmed.site/en */}
      <section className="relative overflow-hidden bg-brand-950 py-20">
        <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-blood-600/20 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-8 h-40 w-40 rounded-full bg-success-500/10 blur-3xl" />
        <div className="container-page relative">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-brand-200 ring-1 ring-white/10">
                <Code className="h-3.5 w-3.5" /> {lang === "en" ? "Website Developer" : "ওয়েবসাইট ডেভেলপার"}
              </span>
              <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {lang === "en" ? "Designed & Developed by" : "ডিজাইন ও ডেভেলপ করেছেন"}
              </h2>
              <a href="https://www.rahatahmed.site/en" target="_blank" rel="noreferrer" className="mt-1 inline-block bg-gradient-to-r from-brand-300 via-white to-blood-200 bg-clip-text font-display text-4xl font-extrabold text-transparent transition hover:opacity-80">
                Rahat Ahmed
              </a>
              <p className="mt-3 text-sm text-brand-200/70">
                {lang === "en"
                  ? "Student · Web Developer · Teacher · Blood Donor — creator of RahatVerse"
                  : "শিক্ষার্থী · ওয়েব ডেভেলপার · শিক্ষক · রক্তদাতা — RahatVerse-এর স্রষ্টা"}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] shadow-glow backdrop-blur-md">
              <div className="grid gap-10 p-8 md:p-10 lg:grid-cols-[260px_1fr]">
                {/* Left: Profile */}
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="relative">
                    <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-brand-400/40 to-blood-500/40 blur-2xl" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://res.cloudinary.com/kbc3dfnj/image/upload/v1786125213/rahatverse/profile/1786125213546.jpg"
                      alt={tx("Rahat Ahmed — ওয়েব ডেভেলপার")}
                      className="relative h-32 w-32 rounded-full object-cover ring-4 ring-white/15"
                    />
                    <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-success-500 ring-4 ring-brand-950" title={lang === "en" ? "Available for projects" : "প্রজেক্টের জন্য উপলব্ধ"}>
                      <span className="h-2 w-2 rounded-full bg-white" />
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-extrabold text-white">Rahat Ahmed</h3>
                    <p className="text-sm text-brand-200">{tx("রাহাত আহমেদ")}</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {(lang === "en"
                      ? ["Web Developer", "Blood Donor", "BNCC Cadet", "Teacher"]
                      : ["ওয়েব ডেভেলপার", "রক্তদাতা", "BNCC ক্যাডেট", "শিক্ষক"]
                    ).map((r) => (
                      <span key={r} className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/85 ring-1 ring-white/10">{r}</span>
                    ))}
                  </div>
                  <a href="https://www.rahatahmed.site/en" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/15 px-3.5 py-1.5 text-xs font-bold text-brand-200 ring-1 ring-brand-400/25 transition hover:bg-brand-500/25">
                    <Globe className="h-3.5 w-3.5" /> rahatahmed.site
                  </a>
                </div>

                {/* Right: Info */}
                <div>
                  <p className="text-sm leading-relaxed text-brand-100/80">
                    {lang === "en"
                      ? "A student and web developer from Sunamganj, Sylhet, Bangladesh — and the creator of RahatVerse. He builds modern digital experiences for education, social service and technology. This complete Blood Donation Management System was designed and developed by him — from UI/UX to database, authentication, admin CMS, and deployment."
                      : "সুনামগঞ্জ, সিলেট, বাংলাদেশের একজন শিক্ষার্থী ও ওয়েব ডেভেলপার — এবং RahatVerse-এর স্রষ্টা। শিক্ষা, সমাজসেবা ও প্রযুক্তির জন্য আধুনিক ডিজিটাল অভিজ্ঞতা তৈরি করেন। এই সম্পূর্ণ রক্তদান ব্যবস্থাপনা প্ল্যাটফর্মটি তিনি ডিজাইন ও ডেভেলপ করেছেন — UI/UX থেকে ডেটাবেস, অথেনটিকেশন, অ্যাডমিন প্যানেল ও ডেপ্লয়মেন্ট পর্যন্ত।"}
                  </p>
                  <blockquote className="mt-4 border-l-2 border-blood-400/60 pl-4 text-sm italic leading-relaxed text-brand-100/70">
                    {lang === "en"
                      ? "“Standing by people, learning, and teaching — these three things drive me forward.”"
                      : "“মানুষের পাশে দাঁড়ানো, শেখা এবং শেখানো — এই তিনটি জিনিস আমাকে এগিয়ে নিয়ে যায়।”"}
                  </blockquote>

                  {/* Quick facts */}
                  <div className="mt-4 space-y-1.5 text-sm text-brand-100/70">
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /> {lang === "en" ? "Sunamganj, Sylhet, Bangladesh" : "সুনামগঞ্জ, সিলেট, বাংলাদেশ"}</p>
                    <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4 shrink-0" /> {lang === "en" ? "HSC 2nd Year (Science), Sunamganj Govt. College" : "এইচএসসি ২য় বর্ষ (বিজ্ঞান), সুনামগঞ্জ সরকারি কলেজ"}</p>
                    <p className="flex items-center gap-2"><Droplets className="h-4 w-4 shrink-0" /> {lang === "en" ? "Blood Group: A+ — has donated blood 4 times" : "রক্তের গ্রুপ: A+ — ৪ বার রক্তদান করেছেন"}</p>
                  </div>

                  {/* Stats */}
                  <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div className="rounded-xl bg-white/5 p-3 text-center ring-1 ring-white/10">
                      <p className="font-display text-xl font-extrabold text-white">9</p>
                      <p className="mt-0.5 text-[10px] text-brand-200/60">{lang === "en" ? "Achievements" : "টি অর্জন"}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-3 text-center ring-1 ring-white/10">
                      <p className="font-display text-xl font-extrabold text-white">5×</p>
                      <p className="mt-0.5 text-[10px] text-brand-200/60">{lang === "en" ? "1st Places" : "বার প্রথম স্থান"}</p>
                    </div>
                    <div className="rounded-xl bg-blood-500/10 p-3 text-center ring-1 ring-blood-400/20">
                      <p className="font-display text-xl font-extrabold text-blood-300">4×</p>
                      <p className="mt-0.5 text-[10px] text-blood-200/70">{lang === "en" ? "Blood Donations" : "বার রক্তদান"}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-3 text-center ring-1 ring-white/10">
                      <p className="font-display text-xl font-extrabold text-white">2×</p>
                      <p className="mt-0.5 text-[10px] text-brand-200/60">{lang === "en" ? "GPA 5.00" : "বার জিপিএ ৫.০০"}</p>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a href="https://www.rahatahmed.site/en" target="_blank" rel="noreferrer" className="btn inline-flex items-center gap-1.5 bg-white text-brand-700 hover:bg-brand-50">
                      <Globe className="h-4 w-4" /> {lang === "en" ? "Visit Website" : "ওয়েবসাইট দেখুন"}
                    </a>
                    <a href="https://www.rahatahmed.site/en/order" target="_blank" rel="noreferrer" className="btn inline-flex items-center gap-1.5 border border-white/25 text-white hover:bg-white/10">
                      <Briefcase className="h-4 w-4" /> {lang === "en" ? "Order a Website" : "ওয়েবসাইট অর্ডার করুন"}
                    </a>
                    <a href="https://www.rahatahmed.site/en/portfolio" target="_blank" rel="noreferrer" className="btn inline-flex items-center gap-1.5 border border-white/25 text-white hover:bg-white/10">
                      <Images className="h-4 w-4" /> {lang === "en" ? "Portfolio" : "পোর্টফোলিও"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom CTA bar */}
              <div className="relative border-t border-white/10 bg-gradient-to-r from-brand-700/50 via-brand-600/30 to-blood-700/50 px-6 py-5 sm:px-10">
                <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10"><Briefcase className="h-5 w-5" /></span>
                    <p className="text-sm font-medium text-white">
                      {lang === "en" ? "Need a website like this for your organization?" : "আপনার সংগঠনের জন্য এরকম ওয়েবসাইট দরকার?"}
                    </p>
                  </div>
                  <a href="https://www.rahatahmed.site/en/contact" target="_blank" rel="noreferrer" className="btn shrink-0 bg-white text-brand-700 hover:bg-brand-50 !py-2 text-sm">
                    {lang === "en" ? "Contact Rahat Ahmed →" : "রাহাত আহমেদের সাথে যোগাযোগ →"}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="rounded-3xl bg-brand-600 px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-bold">{t("about.ctaTitle", lang)}</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-50">{t("about.ctaSub", lang)}</p>
          <Link href="/become-donor" className="mt-6 inline-flex btn bg-white text-brand-700 hover:bg-brand-50">{t("nav.becomeDonor", lang)}</Link>
        </div>
      </section>
    </div>
  );
}

function PeopleGroup({ title, people, lang }: { title: string; people: { id: string; name: string; role: string; photo_url: string | null }[]; lang: Lang }) {
  const tx = (v: string) => tr(v, lang);
  return (
    <div className="mt-12">
      <h3 className="mb-5 text-center text-lg font-bold text-zinc-900">{title}</h3>
      <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p, i) => (
          <Reveal key={p.id} delay={i * 80}>
            <div className="card-hover flex items-center gap-4 p-5">
              {p.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.photo_url} alt={tx(p.name)} className="h-14 w-14 rounded-2xl object-cover" />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-xl font-bold text-brand-600">{(tx(p.name ?? "?")).charAt(0)}</span>
              )}
              <div>
                <h4 className="font-semibold text-zinc-900">{tx(p.name)}</h4>
                <p className="text-sm text-brand-600">{tx(p.role)}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

const VALUES = [
  { icon: "handshake", title: "মানবিকতা", desc: "ধর্ম, বর্ণ বা পেশা ভেদে নয় — প্রতিটি জীবনের পাশে দাঁড়াই।" },
  { icon: "zap", title: "দ্রুততা", desc: "জরুরি মুহূর্তে সবচেয়ে কম সময়ে সঠিক দাতায় পৌঁছাই।" },
  { icon: "lock", title: "নিরাপত্তা", desc: "দাতা ও গ্রহীতার তথ্য সুরক্ষিত ও দায়িত্বশীলভাবে ব্যবহৃত হয়।" },
  { icon: "gem", title: "স্বেচ্ছাসেবা", desc: "কোনো আর্থিক লেনদেশন নেই — পুরোপুরি স্বেচ্ছাসেবী নেটওয়ার্ক।" },
  { icon: "map-pin", title: "স্থানীয়তা", desc: "সিলেট বিভাগের মানুষের জন্য, সিলেটের মানুষের দ্বারা।" },
  { icon: "refresh-cw", title: "নিরবচ্ছিন্নতা", desc: "২৪/৭ অনুরোধ গ্রহণ ও সমন্বয় — কখনো থামি না।" },
];

// গণমাধ্যমে প্রকাশিত প্রতিবেদন (verified)
const PRESS = [
  { source: "Online Sylhet", date: "২৭ জুন ২০২৬", title: "শান্তিচক্র ব্লাড সোসাইটির প্রতিষ্ঠাবার্ষিকীতে নতুন কমিটি ঘোষণা", url: "https://onlinesylhet.com/2026/06/27/11-1704/" },
  { source: "Business Times BD", date: "27 Jun 2026", title: "Shanti Chakra Blood Society Marks Second Anniversary, Announces New Committee", url: "https://www.businesstimes-bd.com/bangladesh/8306" },
  { source: "The Daily Sylheter Shomoy", date: "২৬ আগস্ট ২০২৫", title: "শান্তিগঞ্জ জেবিবি উচ্চ বিদ্যালয়ে বিনামূল্যে রক্তের গ্রুপ নির্ধারণ কর্মসূচি", url: "https://dailysylhetersomoy.com/wc-96/" },
  { source: "Sylher Kotha", date: "২৬ আগস্ট ২০২৫", title: "শান্তিগঞ্জ জেবিবি উচ্চ বিদ্যালয়ে বিনামূল্যে রক্তের গ্রুপ নির্ধারণ কর্মসূচি", url: "https://sylherkotha.com/2025/08/26/%E0%A6%B6%E0%A6%BE%E0%A6%A8%E0%A7%8D%E0%A6%A4%E0%A6%BF%E0%A6%97%E0%A6%9E%E0%A7%8D%E0%A6%9C-%E0%A6%9C%E0%A7%87%E0%A6%AC%E0%A6%BF%E0%A6%AC%E0%A6%BF-%E0%A6%89%E0%A6%9A%E0%A7%8D%E0%A6%9A-%E0%A6%AC/" },
];
