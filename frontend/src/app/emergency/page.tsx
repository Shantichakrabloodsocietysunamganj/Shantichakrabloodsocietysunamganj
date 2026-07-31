import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";
import {
  nationalHotlines,
  sunamganjFacilities,
  sunamganjNote,
  sylhetFacilities,
  ambulanceSteps,
  facilityTypeLabel,
  type Facility,
} from "@/data/emergency";
import { telHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "জরুরি নম্বর ও হাসপাতাল",
  description:
    "সুনামগঞ্জ ও সিলেটের হাসপাতাল, ব্লাড ব্যাংক এবং জাতীয় জরুরি হটলাইনের তালিকা — এক ক্লিকে কল করুন।",
};

function FacilityCard({ f }: { f: Facility }) {
  return (
    <div className="card flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-snug text-ink">{f.name}</h3>
        {f.bloodBank && (
          <span className="shrink-0 rounded-full bg-blood-50 px-2.5 py-1 text-[11px] font-semibold text-blood-600 ring-1 ring-blood-200">
            🩸 ব্লাড ব্যাংক
          </span>
        )}
      </div>
      <p className="mt-1.5 text-sm text-ink/60">📍 {f.area}</p>
      <p className="mt-1 text-xs text-ink/50">{facilityTypeLabel[f.type]}{f.note ? ` • ${f.note}` : ""}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {f.phones.map((p) => (
          <a
            key={p}
            href={`tel:${telHref(p)}`}
            className="btn-outline !px-3 !py-1.5 text-sm font-semibold"
          >
            📞 {p}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function EmergencyPage() {
  return (
    <div className="container-page py-12">
      <SectionHeading
        eyebrow="জরুরি ডিরেক্টরি"
        title="জরুরি নম্বর, হাসপাতাল ও ব্লাড ব্যাংক"
        subtitle="জরুরি মুহূর্তে প্রয়োজনীয় সব ফোন নম্বর এক জায়গায়। যেকোনো নম্বরে চাপ দিলেই কল যাবে।"
      />

      {/* ⚠️ সতর্ক বার্তা */}
      <Reveal className="mx-auto mt-8 max-w-3xl">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-blood-500 px-6 py-5 text-center text-white shadow-lg sm:flex-row sm:text-left">
          <span className="text-3xl">🚑</span>
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
        <h2 className="font-display text-xl font-bold text-ink">☎️ জাতীয় জরুরি হটলাইন</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {nationalHotlines.map((h, i) => (
            <Reveal key={h.number} delay={i * 70}>
              <a
                href={`tel:${h.number}`}
                className="card group flex h-full flex-col items-center p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-3xl">{h.icon}</span>
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
        <h2 className="font-display text-xl font-bold text-ink">🏥 সুনামগঞ্জ জেলা</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {sunamganjFacilities.map((f) => (
            <FacilityCard key={f.name} f={f} />
          ))}
          <div className="card flex h-full flex-col justify-center bg-canvas p-5">
            <p className="font-semibold text-ink">🏘️ উপজেলা স্বাস্থ্য কমপ্লেক্স</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">{sunamganjNote}</p>
          </div>
        </div>
      </div>

      {/* সিলেটের হাসপাতাল ও ব্লাড ব্যাংক */}
      <div className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-ink">🩸 সিলেটের হাসপাতাল ও ব্লাড ব্যাংক</h2>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-ink/70 dark:bg-white/10">
            🩸 চিহ্নিত প্রতিষ্ঠানে ব্লাড ব্যাংক আছে
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
        <h2 className="font-display text-xl font-bold text-ink">🚑 অ্যাম্বুলেন্স কীভাবে পাবেন?</h2>
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
          <h2 className="font-display text-2xl font-bold">🩸 জরুরি রক্ত প্রয়োজন?</h2>
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
        ⚠️ এই ডিরেক্টরির নম্বরগুলো জনস্বার্থে উন্মুক্ত উৎস থেকে সংগৃহীত। কোনো নম্বর পরিবর্তিত বা ভুল
        মনে হলে অনুগ্রহ করে <Link href="/contact" className="font-semibold text-brand-600 hover:underline">আমাদের জানান</Link> — দ্রুত সংশোধন করা হবে।
      </p>
    </div>
  );
}
