import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/data/site";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata = { title: "আমাদের সম্পর্কে" };

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
  const founders = ok ? list.filter((m) => m.category === "founder") : site.founders.map((f) => ({ ...f, id: f.name, photo_url: (f as any).photo_url ?? null }));
  const advisors = ok ? list.filter((m) => m.category === "advisor") : [];
  const members = ok ? list.filter((m) => m.category === "member") : site.volunteers.map((v) => ({ ...v, id: v.name, photo_url: null }));

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50/70 to-white py-16">
        <div className="container-page max-w-3xl text-center">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
            {t("about.eyebrow", lang)}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-zinc-900">{site.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-600">{site.mission}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/become-donor" className="btn-primary">{t("about.join", lang)}</Link>
            <Link href="/donors" className="btn-outline">{t("hero.findDonors", lang)}</Link>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal><div className="card h-full p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">🎯</div>
            <h2 className="mt-4 text-xl font-bold text-zinc-900">{t("about.mission", lang)}</h2>
            <p className="mt-2 leading-relaxed text-zinc-600">{site.mission}</p>
          </div></Reveal>
          <Reveal delay={120}><div className="card h-full p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl">🌟</div>
            <h2 className="mt-4 text-xl font-bold text-zinc-900">{t("about.vision", lang)}</h2>
            <p className="mt-2 leading-relaxed text-zinc-600">{site.vision}</p>
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
                  <div className="text-3xl">{v.icon}</div>
                  <h3 className="mt-3 font-semibold text-zinc-900">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <Reveal><SectionHeading eyebrow={t("about.team.eyebrow", lang)} title={t("about.team.title", lang)} subtitle={t("about.team.sub", lang)} /></Reveal>

        {founders.length > 0 && <PeopleGroup title={t("about.founders", lang)} people={founders} />}
        {advisors.length > 0 && <PeopleGroup title={t("about.advisors", lang)} people={advisors} />}
        {members.length > 0 && <PeopleGroup title={t("about.committee", lang)} people={members} />}
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

function PeopleGroup({ title, people }: { title: string; people: { id: string; name: string; role: string; photo_url: string | null }[] }) {
  return (
    <div className="mt-12">
      <h3 className="mb-5 text-center text-lg font-bold text-zinc-900">{title}</h3>
      <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p, i) => (
          <Reveal key={p.id} delay={i * 80}>
            <div className="card-hover flex items-center gap-4 p-5">
              {p.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.photo_url} alt={p.name} className="h-14 w-14 rounded-2xl object-cover" />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-xl font-bold text-brand-600">{(p.name ?? "?").charAt(0)}</span>
              )}
              <div>
                <h4 className="font-semibold text-zinc-900">{p.name}</h4>
                <p className="text-sm text-brand-600">{p.role}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

const VALUES = [
  { icon: "🤝", title: "মানবিকতা", desc: "ধর্ম, বর্ণ বা পেশা ভেদে নয় — প্রতিটি জীবনের পাশে দাঁড়াই।" },
  { icon: "⚡", title: "দ্রুততা", desc: "জরুরি মুহূর্তে সবচেয়ে কম সময়ে সঠিক দাতায় পৌঁছাই।" },
  { icon: "🔒", title: "নিরাপত্তা", desc: "দাতা ও গ্রহীতার তথ্য সুরক্ষিত ও দায়িত্বশীলভাবে ব্যবহৃত হয়।" },
  { icon: "💎", title: "স্বেচ্ছাসেবা", desc: "কোনো আর্থিক লেনদেশন নেই — পুরোপুরি স্বেচ্ছাসেবী নেটওয়ার্ক।" },
  { icon: "📍", title: "স্থানীয়তা", desc: "সিলেট বিভাগের মানুষের জন্য, সিলেটের মানুষের দ্বারা।" },
  { icon: "🔄", title: "নিরবচ্ছিন্নতা", desc: "২৪/৭ অনুরোধ গ্রহণ ও সমন্বয় — কখনো থামি না।" },
];
