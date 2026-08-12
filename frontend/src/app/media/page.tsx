import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/Reveal";
import { getLang } from "@/lib/i18n-server";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "মিডিয়া কভারেজ ও খবর | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "জাতীয় ও স্থানীয় সংবাদমাধ্যমে শান্তিচক্র ব্লাড সোসাইটির স্বেচ্ছাসেবী রক্তদান কার্যক্রম ও খবরের সংগ্রহ।",
  alternates: { canonical: "/media" },
  openGraph: {
    title: "মিডিয়া কভারেজ ও খবর | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "জাতীয় ও স্থানীয় সংবাদমাধ্যমে শান্তিচক্র ব্লাড সোসাইটির স্বেচ্ছাসেবী রক্তদান কার্যক্রম ও খবরের সংগ্রহ।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/media",
    type: "website",
  },
};

const FALLBACK = [
  { title: "শান্তিচক্র ব্লাড সোসাইটির প্রতিষ্ঠাবার্ষিকীতে নতুন কমিটি ঘোষণা", source: "Online Sylhet", url: "https://onlinesylhet.com/2026/06/27/11-1704/", published_date: "2026-06-27", category: "online" },
  { title: "Shanti Chakra Blood Society Marks Second Anniversary, Announces New Committee", source: "Business Times BD", url: "https://www.businesstimes-bd.com/bangladesh/8306", published_date: "2026-06-27", category: "online" },
  { title: "শান্তিগঞ্জ জেবিবি উচ্চ বিদ্যালয়ে বিনামূল্যে রক্তের গ্রুপ নির্ধারণ কর্মসূচি", source: "The Daily Sylheter Shomoy", url: "https://dailysylhetersomoy.com/wc-96/", published_date: "2025-08-26", category: "online" },
  { title: "শান্তিগঞ্জ জেবিবি উচ্চ বিদ্যালয়ে বিনামূল্যে রক্তের গ্রুপ নির্ধারণ কর্মসূচি", source: "Sylher Kotha", url: "https://sylherkotha.com/2025/08/26/", published_date: "2025-08-26", category: "online" },
];

function fmt(d: string | null, en: boolean) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(en ? "en-GB" : "bn-BD", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return d;
  }
}

export default async function MediaPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  const en = lang === "en";
  let items: any[] = [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("media_coverage").select("*").order("published_date", { ascending: false, nullsFirst: false });
    if (!error && data && data.length) items = data;
    else items = FALLBACK;
  } catch {
    items = FALLBACK;
  }

  return (
    <div className="container-page py-12">
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: tx("মিডিয়া কভারেজ"), url: "https://shanticakrabloodsocaiety.rahatahmed.site/media" },
        ]}
      />
      <SectionHeading eyebrow={en ? "Media" : "মিডিয়া"} title={en ? "Media Coverage" : "মিডিয়া কভারেজ"} subtitle={en ? "Where the press has covered our work." : "বিভিন্ন গণমাধ্যমে আমাদের কার্যক্রমের প্রতিবেদন।"} />
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((m: any, i: number) => (
          <Reveal key={m.id ?? i} delay={i * 80}>
            <a href={m.url ?? "#"} target="_blank" rel="noreferrer" className="card-hover flex h-full flex-col overflow-hidden">
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50 dark:from-white/5 dark:to-transparent">
                {m.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.thumbnail} alt={tx(m.title)} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl">📰</div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-700">{tx(m.source)}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs text-ink/40">{fmt(m.published_date, en)}</p>
                <h3 className="mt-1 font-display font-bold leading-snug text-ink">{tx(m.title)}</h3>
                {m.summary && <p className="mt-2 line-clamp-2 text-sm text-ink/55">{tx(m.summary)}</p>}
                <span className="mt-auto pt-3 text-sm font-bold text-brand-600">{en ? "Read article →" : "পড়ুন →"}</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
