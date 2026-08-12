import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { STATIC_BLOG_ARTICLES } from "@/data/blog-articles";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient();
  let { data: post } = await supabase.from("blogs").select("title, excerpt, cover_url").eq("slug", params.slug).maybeSingle();
  if (!post) {
    const staticArticle = STATIC_BLOG_ARTICLES.find((sa) => sa.slug === params.slug || sa.id === params.slug);
    if (staticArticle) post = staticArticle;
  }
  if (!post) return { title: "ব্লগ | শান্তিচক্র ব্লাড সোসাইটি" };

  const p = post as any;
  const title = p.title;
  const description = p.excerpt ?? "";
  const url = `https://shanticakrabloodsocaiety.rahatahmed.site/blog/${params.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      ...(p.cover_url ? { images: [{ url: p.cover_url }] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  const supabase = createClient();
  let { data: post } = await supabase.from("blogs").select("*").eq("slug", params.slug).maybeSingle();
  if (!post) {
    const { data: byId } = await supabase.from("blogs").select("*").eq("id", params.slug).maybeSingle();
    post = byId;
  }
  if (!post) {
    const staticArticle = STATIC_BLOG_ARTICLES.find((sa) => sa.slug === params.slug || sa.id === params.slug);
    if (staticArticle) post = staticArticle;
  }
  if (!post) notFound();
  const p = post as any;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt || "",
    image: p.cover_url || "https://shanticakrabloodsocaiety.rahatahmed.site/images/logo.png",
    datePublished: new Date(p.created_at).toISOString(),
    dateModified: new Date(p.created_at).toISOString(),
    author: {
      "@type": "Organization",
      name: p.author || "শান্তিচক্র ব্লাড সোসাইটি",
    },
    publisher: {
      "@type": "Organization",
      name: "শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ",
      logo: {
        "@type": "ImageObject",
        url: "https://shanticakrabloodsocaiety.rahatahmed.site/images/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://shanticakrabloodsocaiety.rahatahmed.site/blog/${params.slug}`,
    },
  };

  const contentParagraphs: string[] = Array.isArray(p.content)
    ? p.content
    : typeof p.content === "string"
    ? p.content.split("\n").filter((para: string) => Boolean(para.trim()))
    : [];

  return (
    <div className="container-page py-10">
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: tx("ব্লগ ও খবর"), url: "https://shanticakrabloodsocaiety.rahatahmed.site/blog" },
          { name: p.title, url: `https://shanticakrabloodsocaiety.rahatahmed.site/blog/${params.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
        >
          {tx("← সব পোস্ট")}
        </Link>

        <article className="card overflow-hidden">
          {p.cover_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.cover_url} alt={tx(p.title)} className="h-64 w-full object-cover sm:h-80" />
          )}
          <div className="p-6 sm:p-10">
            <p className="text-xs text-ink/40">
              {new Date(p.created_at).toLocaleDateString(lang === "en" ? "en-GB" : "bn-BD", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {p.author && ` • ${tx(p.author)}`}
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">
              {tx(p.title)}
            </h1>
            {p.excerpt && (
              <p className="mt-3 text-lg leading-relaxed text-ink/60">{tx(p.excerpt)}</p>
            )}
            {contentParagraphs.length > 0 && (
              <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/75">
                {contentParagraphs.map((para: string, i: number) => (
                  <p key={i}>{tx(para)}</p>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
