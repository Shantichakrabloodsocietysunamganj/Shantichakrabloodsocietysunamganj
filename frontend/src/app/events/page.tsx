import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/Reveal";
import { getLang } from "@/lib/i18n-server";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "রক্তদান কর্মসূচি ও ক্যাম্প | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "শান্তিচক্র ব্লাড সোসাইটির রক্তদান শিবির, বিনামূল্যে রক্তের গ্রুপ নির্ধারণ ও স্বাস্থ্য সচেতনতামূলক বিভিন্ন কর্মসূচির বিবরণ।",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "রক্তদান কর্মসূচি ও ক্যাম্প | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "শান্তিচক্র ব্লাডসম্পৃক্ত শিবির, বিনামূল্যে রক্তের গ্রুপ নির্ধারণ ও স্বাস্থ্য সচেতনতামূলক বিভিন্ন কর্মসূচির বিবরণ।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/events",
    type: "website",
  },
};

function fmt(d: string, en: boolean) {
  try { return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" }); } catch { return d; }
}

export default async function EventsPage() {
  const lang = await getLang();
  const en = lang === "en";
  const supabase = createClient();
  let events: any[] = [];
  try {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    events = data ?? [];
  } catch {}

  const upcoming = events.filter((e) => new Date(e.event_date) >= new Date(new Date().toDateString())).reverse();
  const past = events.filter((e) => new Date(e.event_date) < new Date(new Date().toDateString()));

  return (
    <div className="container-page py-12">
      <BreadcrumbJsonLd
        items={[
          { name: "হোম", url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: "রক্তদান কর্মসূচি ও ক্যাম্প", url: "https://shanticakrabloodsocaiety.rahatahmed.site/events" },
        ]}
      />
      <SectionHeading eyebrow={en ? "Events" : "কর্মসূচি"} title={en ? "Events & Programs" : "ইভেন্ট ও কর্মসূচি"} subtitle={en ? "Blood donation camps, awareness programs and community events." : "রক্তদান শিবির, সচেতনতামূলক ও সামাজিক কর্মসূচি।"} />

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-ink">
            <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-70" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success-500" /></span>
            {en ? "Upcoming" : "আসন্ন কর্মসূচি"}
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e, i) => <Reveal key={e.id} delay={i * 80}><EventCard e={e} en={en} /></Reveal>)}
          </div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div className="mt-12">
          <h3 className="mb-5 font-display text-lg font-bold text-ink/70">{en ? "Past Events" : "অতীত কর্মসূচি"}</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {past.map((e, i) => <Reveal key={e.id} delay={i * 60}><EventCard e={e} en={en} past /></Reveal>)}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="card mt-10 p-12 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Calendar className="h-6 w-6" /></span>
          <p className="mt-2 font-medium text-ink">{en ? "No events yet" : "এখনো কোনো কর্মসূচি নেই"}</p>
          <p className="mt-1 text-sm text-ink/60">{en ? "New events will appear here." : "নতুন কর্মসূচি এখানে প্রকাশ করা হবে।"}</p>
        </div>
      )}
    </div>
  );
}

function EventCard({ e, en, past }: { e: any; en: boolean; past?: boolean }) {
  return (
    <div className={`card-hover overflow-hidden ${past ? "opacity-75" : ""}`}>
      {e.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={e.cover_url} alt={e.title} className="h-40 w-full object-cover" loading="lazy" />
      )}
      <div className="p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600 dark:bg-white/5">
          <Calendar className="h-3.5 w-3.5" />{fmt(e.event_date, en)}
        </span>
        <h3 className="mt-3 font-display text-lg font-bold text-ink">{e.title}</h3>
        {e.location && <p className="mt-1 flex items-center gap-1 text-sm text-ink/50"><MapPin className="h-3.5 w-3.5 shrink-0" />{e.location}</p>}
        {e.description && <p className="mt-2 line-clamp-2 text-sm text-ink/60">{e.description}</p>}
      </div>
    </div>
  );
}
