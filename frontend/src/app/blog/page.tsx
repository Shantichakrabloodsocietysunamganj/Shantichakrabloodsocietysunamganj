import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import { STATIC_BLOG_ARTICLES } from "@/data/blog-articles";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { getLang } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "রক্তদান ও স্বাস্থ্য সচেতনতা ব্লগ | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "রক্তদানের উপকারিতা, যোগ্যতা, জরুরি রক্তের প্রয়োজনে করণীয় এবং স্বাস্থ্য সচেতনতামূলক বিভিন্ন নিবন্ধ ও তথ্য।",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "রক্তদান ও স্বাস্থ্য সচেতনতা ব্লগ | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "রক্তদানের উপকারিতা, যোগ্যতা, জরুরি রক্তের প্রয়োজনে করণীয় এবং স্বাস্থ্য সচেতনতামূলক বিভিন্ন নিবন্ধ ও তথ্য।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/blog",
    type: "website",
  },
};

export default async function BlogPage() {
  const supabase = createClient();
  const lang = await getLang();
  const en = lang === "en";
  let dbPosts: any[] = [];
  try {
    const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    if (!error) {
      dbPosts = data ?? [];
    }
  } catch {}

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
          { name: en ? "Home" : "হোম", url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: en ? "Blog & News" : "ব্লগ ও খবর", url: "https://shanticakrabloodsocaiety.rahatahmed.site/blog" },
        ]}
      />
      <SectionHeading
        eyebrow={t("blog.eyebrow", lang)}
        title={t("blog.title", lang)}
        subtitle={t("blog.sub", lang)}
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
                  alt={p.title}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-5">
                <p className="text-xs text-ink/40">
                  {new Date(p.created_at).toLocaleDateString(en ? "en-US" : "bn-BD", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h3 className="mt-1 font-bold text-ink">{p.title}</h3>
                {p.excerpt && (
                  <p className="mt-2 text-sm text-ink/60">{p.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
