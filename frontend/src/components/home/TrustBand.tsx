import type { Lang } from "@/lib/i18n";
import { BadgeCheck, Calendar, Droplets, Handshake, Heart, HandHeart, type LucideIcon } from "@/components/icons";

// বিশ্বাসযোগ্যতা ও সততা ব্যাজ — homepage trust section
export default function TrustBand({ lang, donorCount, requestCount }: { lang: Lang; donorCount: number; requestCount: number }) {
  const en = lang === "en";
  const items = [
    { icon: "✅", title: en ? "Voluntary Blood Society" : "স্বেচ্ছাসেবী রক্তদান সংগঠন", desc: en ? "Official voluntary blood network" : "পরিচিত স্বেচ্ছাসেবী রক্তদান নেটওয়ার্ক" },
    { icon: "🕐", title: en ? "24/7 Emergency Support" : "২৪/৭ জরুরি সেবা", desc: en ? "Blood support any time, any day" : "যেকোনো সময় রক্তসেবা" },
    { icon: "🤝", title: en ? "Volunteer-Driven" : "স্বেচ্ছাসেবক নেতৃত্বে", desc: en ? "Run entirely by volunteers" : "সম্পূর্ণ স্বেচ্ছাসেবকদের দ্বারা পরিচালিত" },
    { icon: "🆓", title: en ? "100% Free Service" : "১০০% ফ্রি সেবা", desc: en ? "No money — purely humanitarian" : "কোনো অর্থ নয় — পুরোপুরি মানবিক" },
    { icon: "📅", title: en ? "Serving Since 2024" : "২০২৪ সাল থেকে", desc: en ? "Trusted across Sylhet Division" : "সিলেট বিভাগ জুড়ে আস্থা" },
    { icon: "🩸", title: en ? "Real Impact" : "প্রকৃত অর্থে জীবন রক্ষা", desc: en ? `${donorCount} donors · ${requestCount} requests` : `${donorCount} দাতা · ${requestCount} অনুরোধ` },
  ];
  return (
    <section className="container-page py-14">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="card-hover flex items-start gap-4 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 dark:bg-white/5 dark:text-brand-300">
              <it.icon className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display font-bold text-ink">{it.title}</p>
              <p className="mt-0.5 text-sm text-ink/55">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
