import type { Metadata } from "next";
import { BarChart3, Droplets, Heart, Siren, Syringe, Target, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import DonutChart from "@/components/DonutChart";
import { site } from "@/data/site";
import { getLang } from "@/lib/i18n-server";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "আমাদের প্রভাব ও অর্জন | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "শান্তিচক্র ব্লাড সোসাইটির স্বচ্ছতা, রক্তদানের পরিসংখ্যান, অর্জিত সাফল্য ও সামাজিক প্রভাবের বিস্তারিত বিবরণ।",
  alternates: { canonical: "/impact" },
  openGraph: {
    title: "আমাদের প্রভাব ও অর্জন | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "শান্তিচক্র ব্লাড সোসাইটির স্বচ্ছতা, রক্তদানের পরিসংখ্যান, অর্জিত সাফল্য ও সামাজিক প্রভাবের বিস্তারিত বিবরণ।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/impact",
    type: "website",
  },
};

export default async function ImpactPage() {
  const lang = await getLang();
  const en = lang === "en";
  const supabase = createClient();

  let s = { donors: 0, completed: 0, active_requests: 0, volunteers: 0, donations: 0, units: 0 };
  let groups: { label: string; value: number }[] = [];
  try {
    const { data: rpc } = await supabase.rpc("impact_stats");
    if (rpc && rpc[0]) s = rpc[0] as any;
    const { data: dons } = await supabase.from("donors").select("blood_group").eq("approved", true);
    if (dons && dons.length > s.donors) {
      s.donors = dons.length;
    }
    const map = new Map<string, number>();
    (dons ?? []).forEach((d: any) => map.set(d.blood_group, (map.get(d.blood_group) ?? 0) + 1));
    groups = Array.from(map, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  } catch {}

  const counters = [
    { label: en ? "Registered Donors" : "নিবন্ধিত দাতা", value: s.donors, icon: Droplets, color: "text-brand-600" },
    { label: en ? "Patients Helped" : "সাহায্যপ্রাপ্ত রোগী", value: s.completed, icon: Heart, color: "text-blood-600" },
    { label: en ? "Active Requests" : "চলমান অনুরোধ", value: s.active_requests, icon: Siren, color: "text-amber-600" },
    { label: en ? "Blood Units Collected" : "সংগৃহীত রক্ত (ইউনিট)", value: s.units, icon: Syringe, color: "text-success-600" },
    { label: en ? "Donation Records" : "রক্তদান রেকর্ড", value: s.donations, icon: BarChart3, color: "text-violet-600" },
    { label: en ? "Active Volunteers" : "সক্রিয় স্বেচ্ছাসেবক", value: s.volunteers, icon: Users, color: "text-sky-600" },
  ];
  const goals = en
    ? ["Expand blood service to all 64 districts of Bangladesh", "Build a 10,000+ registered donor network", "Organize regular free blood-grouping & donation camps", "Partner with hospitals and blood banks across the country"]
    : ["সারা বাংলাদেশের ৬৪ জেলায় রক্তসেবা বিস্তার", "১০,০০০+ নিবন্ধিত দাতার নেটওয়ার্ক গড়া", "নিয়মিত ফ্রি রক্তের গ্রুপ নির্ধারণ ও রক্তদান শিবির", "দেশজুড়ে হাসপাতাল ও ব্লাড ব্যাংকের সাথে সহযোগিতা"];

  return (
    <div className="container-page py-12">
      <BreadcrumbJsonLd
        items={[
          { name: "হোম", url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: "আমাদের অর্জন", url: "https://shanticakrabloodsocaiety.rahatahmed.site/impact" },
        ]}
      />
      <SectionHeading eyebrow={en ? "Transparency" : "স্বচ্ছতা"} title={en ? "Our Impact" : "আমাদের অর্জন"} subtitle={en ? "Real numbers, real lives saved — fully transparent." : "প্রকৃত সংখ্যা, বাঁচানো জীবন — সম্পূর্ণ স্বচ্ছতায়।"} />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {counters.map((c, i) => (
          <Reveal key={c.label} delay={i * 70}>
            <div className="card-hover flex items-center gap-4 p-5">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas dark:bg-white/5 ${c.color}`}><c.icon className="h-6 w-6" strokeWidth={1.8} /></span>
              <div>
                <p className={`font-display text-3xl font-extrabold ${c.color}`}><CountUp end={c.value} /></p>
                <p className="text-sm text-ink/55">{c.label}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <Reveal>
          <div className="card h-full p-6">
            <h3 className="font-display text-lg font-bold text-ink">{en ? "Donors by blood group" : "গ্রুপ অনুযায়ী দাতা"}</h3>
            <div className="mt-5">{groups.length ? <DonutChart data={groups} /> : <p className="text-sm text-ink/50">{en ? "No donors yet." : "এখনো কেউ নিবন্ধন করেননি।"}</p>}</div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="card h-full p-6">
            <h3 className="font-display text-lg font-bold text-ink">{en ? "Our Mission & Vision" : "আমাদের লক্ষ্য ও স্বপ্ন"}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">{site.mission}</p>
            <p className="mt-3 rounded-xl bg-brand-50 p-3 text-sm font-medium text-brand-700 dark:bg-white/5">{site.vision}</p>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="card mt-12 p-8">
          <h3 className="text-center font-display text-xl font-bold text-ink">{en ? "Future Goals" : "ভবিষ্যৎ লক্ষ্য"}</h3>
          <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
            {goals.map((g, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-canvas p-4 dark:bg-white/5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Target className="h-4 w-4" strokeWidth={2} /></span>
                <p className="text-sm text-ink/70">{g}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
