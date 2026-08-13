import Link from "next/link";
import { SERVICES, serviceBadge, serviceDesc, serviceTitle } from "@/data/services";
import type { Lang } from "@/lib/i18n";
import { tr } from "@/lib/i18n";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/Reveal";

export default function ServicesPreview({ lang }: { lang: Lang }) {
  const tx = (s: string) => tr(s, lang);
  const previewIds = ["match", "request-blood", "donors", "compatibility", "track", "sos", "guide", "eligibility"];
  const items = previewIds
    .map((id) => SERVICES.find((s) => s.id === id))
    .filter((s): s is (typeof SERVICES)[number] => Boolean(s));

  return (
    <section className="container-page py-16 sm:py-20">
      <Reveal>
        <SectionHeading
          eyebrow={tx("নতুন সেবা")}
          title={tx("যা জীবন বাঁচাতে সময় কমায়")}
          subtitle={tx("জরুরি রক্ত থেকে দাতা নিবন্ধন, সামঞ্জস্যতা যাচাই, অনুরোধ ট্র্যাক ও SOS শেয়ার — যা লাগবে, এখানেই।")}
        />
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s, i) => {
          const badge = serviceBadge(s, lang);
          return (
            <Reveal key={s.id} delay={i * 60}>
              <Link href={s.href} className="card-hover flex h-full flex-col p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-xl">{s.icon}</span>
                  {badge && (
                    <span className="rounded-full bg-blood-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blood-600 ring-1 ring-blood-200">
                      {badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display font-bold text-ink">{serviceTitle(s, lang)}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink/60">{serviceDesc(s, lang)}</p>
              </Link>
            </Reveal>
          );
        })}
      </div>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/services" className="btn-primary">{tx("সব সেবা দেখুন →")}</Link>
        <Link href="/match" className="btn-outline">{tx("দ্রুত সহায়তা শুরু করুন →")}</Link>
      </div>
    </section>
  );
}
