import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import { STATIC_BLOG_ARTICLES } from "@/data/blog-articles";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "রক্তদান ও স্বাস্থ্য সচেতনতা ব্লগ | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "রক্তদানের উপকারিতা, যোগ্যতা, জরুরি রক্তের প্রয়োজনে করণীয় এবং স্বাস্থ্য সচেতনতামূলক বিভিন্ন নিবন্ধ ও তথ্য।",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "রক্তদান ও স্বাস্থ্য সচেতনতা ব্লগ | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "রক্তদানের উপকারিতা, যোগ্যতা, জরুরি রক্তের প্রয়োজনে করণীয় এবং স্বাস্থ্য সচেতনতামূলক বিভিন্ন নিবন্ধ ও তথ্য।",
    url: "https://shantichakrabloodsociety.rahatahmed.site/blog",
    type: "website",
  },
};

export default async function BlogPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  const supabase = createClient();
  let dbPosts: any[] = [];
  try {
    const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    if (!error) {
      dbPosts = data ?? [];
    }
  } catch {}

  // Combine database blog posts and static educational articles without duplication by slug
  const allPosts = [
    ...dbPosts,
    ...STATIC_BLOG_ARTICLES.filter(
      (sa) => !dbPosts.some((dp: any) => (dp.slug || dp.id) === sa.slug),
    ),
  ];

  return (
    <div className="container-page py-12">
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("ব্লগ ও খবর"), url: "https://shantichakrabloodsociety.rahatahmed.site/blog" },
        ]}
      />
      <SectionHeading
        eyebrow={tx("ব্লগ ও খবর")}
        title={tx("রক্তদান ও স্বাস্থ্য সচেতনতা ব্লগ")}
        subtitle={tx("রক্তদান, স্বাস্থ্য ও সমিতির কার্যক্রম সম্পর্কে প্রয়োজনীয় নিবন্ধ ও খবর।")}
      />

      <div className="mt-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((p) => (
            <Link
              key={p.id || p.slug}
              href={`/blog/${p.slug || p.id}`}
              className="card-hover block overflow-hidden"
            >
              {p.cover_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.cover_url}
                  alt={tx(p.title)}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-5">
                <p className="text-xs text-ink/40">
                  {new Date(p.created_at).toLocaleDateString(lang === "en" ? "en-GB" : "bn-BD", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h3 className="mt-1 font-bold text-ink">{tx(p.title)}</h3>
                {p.excerpt && (
                  <p className="mt-2 text-sm text-ink/60">{tx(p.excerpt)}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
