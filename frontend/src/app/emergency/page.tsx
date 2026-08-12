import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/Reveal";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { site } from "@/data/site";
import {
  nationalHotlines,
  sunamganjFacilities,
  sunamganjNote,
  sylhetFacilities,
  ambulanceSteps,
  facilityTypeLabel,
  facilityTypeIcon,
  type Facility,
} from "@/data/emergency";
import { telHref } from "@/lib/format";
import { AlertTriangle, Ambulance, Building2, DataIcon, Droplets, Hospital, MapPin, Phone } from "@/components/icons";

export const metadata: Metadata = {
  title: "জরুরি ডিরেক্টরি ও রক্তসেবা | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "সুনামগঞ্জ ও সিলেট বিভাগের জরুরি হাসপাতাল, ব্লাড ব্যাংক ও হটলাইন নম্বর এবং তাৎক্ষণিক রক্তসেবা যোগাযোগ ডিরেক্টরি।",
  alternates: { canonical: "/emergency" },
  openGraph: {
    title: "জরুরি ডিরেক্টরি ও রক্তসেবা | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "সুনামগঞ্জ ও সিলেট বিভাগের জরুরি হাসপাতাল, ব্লাড ব্যাংক ও হটলাইন নম্বর এবং তাৎক্ষণিক রক্তসেবা যোগাযোগ ডিরেক্টরি।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/emergency",
    type: "website",
  },
};

function FacilityCard({ f }: { f: Facility }) {
  return (
    <div className="card flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-snug text-ink">{f.name}</h3>
        {f.bloodBank && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blood-50 px-2.5 py-1 text-[11px] font-semibold text-blood-600 ring-1 ring-blood-200">
            <Droplets className="h-3 w-3" /> ব্লাড ব্যাংক
          </span>
        )}
      </div>
      <p className="mt-1.5 flex items-center gap-1 text-sm text-ink/60"><MapPin className="h-3.5 w-3.5 shrink-0" />{f.area}</p>
      <p className="mt-1 flex items-center gap-1 text-xs text-ink/50"><DataIcon name={facilityTypeIcon[f.type]} className="h-3.5 w-3.5 shrink-0" />{facilityTypeLabel[f.type]}{f.note ? ` • ${f.note}` : ""}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {f.phones.map((p) => (
          <a
            key={p}
            href={`tel:${telHref(p)}`}
            className="btn-outline !px-3 !py-1.5 text-sm font-semibold"
          >
            <Phone className="mr-1 inline h-3.5 w-3.5" />{p}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function EmergencyPage() {
  return (
    <div className="container-page py-12">
      <BreadcrumbJsonLd
        items={[
          { name: "হোম", url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: "জরুরি ডিরেক্টরি", url: "https://shanticakrabloodsocaiety.rahatahmed.site/emergency" },
        ]}
      />
      <SectionHeading
        eyebrow="জরুরি ডিরেক্টরি"
        title="জরুরি নম্বর, হাসপাতাল ও ব্লাড ব্যাংক"
        subtitle="জরুরি মুহূর্তে প্রয়োজনীয় সব ফোন নম্বর এক জায়গায়। যেকোনো নম্বরে চাপ দিলেই কল যাবে।"
      />

      {/* ⚠️ সতর্ক বার্তা */}
      <Reveal className="mx-auto mt-8 max-w-3xl">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-blood-500 px-6 py-5 text-center text-white shadow-lg sm:flex-row sm:text-left">
          <Ambulance className="h-8 w-8 shrink-0" />
          <p className="text-sm leading-relaxed">
            <span className="font-bold">প্রাণঘাতী জরুরি অবস্থায় দেরি না করে সরাসরি{" "}
            <a href="tel:999" className="underline underline-offset-2">৯৯৯</a>
            -এ কল করুন।</span>{" "}
            রক্তের প্রয়োজনে আমাদের দাতা নেটওয়ার্কের সাহায্য নিতে হলে{" "}
            <a href={`tel:${site.phone}`} className="font-semibold underline underline-offset-2">
              {site.phone}
            </a>
            -এ যোগাযোগ করুন।
          </p>
        </div>
      </Reveal>

      {/* জাতীয় হটলাইন */}
      <div className="mt-14">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink"><Phone className="h-5 w-5 text-blood-600" />জাতীয় জরুরি হটলাইন</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {nationalHotlines.map((h, i) => (
            <Reveal key={h.number} delay={i * 70}>
              <a
                href={`tel:${h.number}`}
                className="card group flex h-full flex-col items-center p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blood-50 text-blood-600 ring-1 ring-blood-100"><DataIcon name={h.icon} className="h-6 w-6" /></span>
                <span className="mt-3 font-display text-2xl font-extrabold tracking-wide text-blood-600 group-hover:underline">
                  {h.number}
                </span>
                <span className="mt-1 font-semibold text-ink">{h.name}</span>
                <span className="mt-1.5 text-xs leading-relaxed text-ink/60">{h.desc}</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      {/* সুনামগঞ্জ জেলা */}
      <div className="mt-14">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink"><Hospital className="h-5 w-5 text-blood-600" />সুনামগঞ্জ জেলা</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {sunamganjFacilities.map((f) => (
            <FacilityCard key={f.name} f={f} />
          ))}
          <div className="card flex h-full flex-col justify-center bg-canvas p-5">
            <p className="flex items-center gap-1.5 font-semibold text-ink"><Building2 className="h-4 w-4 text-brand-600" />উপজেলা স্বাস্থ্য কমপ্লেক্স</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">{sunamganjNote}</p>
          </div>
        </div>
      </div>

      {/* সিলেটের হাসপাতাল ও ব্লাড ব্যাংক */}
      <div className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink"><Droplets className="h-5 w-5 text-blood-600" />সিলেটের হাসপাতাল ও ব্লাড ব্যাংক</h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-ink/70 dark:bg-white/10">
            <Droplets className="h-3 w-3 text-blood-600" />চিহ্নিত প্রতিষ্ঠানে ব্লাড ব্যাংক আছে
          </span>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sylhetFacilities.map((f, i) => (
            <Reveal key={f.name} delay={i * 50}>
              <FacilityCard f={f} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* অ্যাম্বুলেন্স */}
      <div className="mt-14">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink"><Ambulance className="h-5 w-5 text-blood-600" />অ্যাম্বুলেন্স কীভাবে পাবেন?</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {ambulanceSteps.map((s, i) => (
            <div key={s.title} className="card relative p-5 pt-6">
              <span className="absolute -top-3 left-5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="font-semibold text-ink">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* রক্ত লাগলে CTA */}
      <Reveal className="mt-14">
        <div className="rounded-3xl bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-10 text-center text-white">
          <h2 className="flex items-center justify-center gap-2 font-display text-2xl font-bold"><Droplets className="h-6 w-6" />জরুরি রক্ত প্রয়োজন?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/80">
            হাসপাতালে রক্ত না পেলে আমাদের ওয়েবসাইটে অনুরোধ পোস্ট করুন — নিবন্ধিত দাতারা দ্রুত সাড়া দেন।
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/request-blood" className="btn-primary !bg-white !text-brand-700">
              রক্তের অনুরোধ করুন
            </Link>
            <Link href="/donors" className="btn-outline !border-white/40 !text-white hover:!bg-white/10">
              রক্তদাতা খুঁজুন
            </Link>
          </div>
        </div>
      </Reveal>

      {/* দায়মুক্তি */}
      <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-ink/50">
        <AlertTriangle className="mr-1 inline h-3.5 w-3.5 text-amber-500" />এই ডিরেক্টরির নম্বরগুলো জনস্বার্থে উন্মুক্ত উৎস থেকে সংগৃহীত। কোনো নম্বর পরিবর্তিত বা ভুল
        মনে হলে অনুগ্রহ করে <Link href="/contact" className="font-semibold text-brand-600 hover:underline">আমাদের জানান</Link> — দ্রুত সংশোধন করা হবে।
      </p>
    </div>
  );
}
