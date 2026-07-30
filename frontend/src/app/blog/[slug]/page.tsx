import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient();
  const { data: post } = await supabase.from("blogs").select("title, excerpt").eq("slug", params.slug).maybeSingle();
  if (!post) return { title: "ব্লগ" };
  return { title: (post as any).title, description: (post as any).excerpt ?? "" };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  let { data: post } = await supabase.from("blogs").select("*").eq("slug", params.slug).maybeSingle();
  if (!post) {
    const { data: byId } = await supabase.from("blogs").select("*").eq("id", params.slug).maybeSingle();
    post = byId;
  }
  if (!post) notFound();
  const p = post as any;

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">← সব পোস্ট</Link>

        <article className="card overflow-hidden">
          {p.cover_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.cover_url} alt={p.title} className="h-64 w-full object-cover sm:h-80" />
          )}
          <div className="p-6 sm:p-10">
            <p className="text-xs text-ink/40">
              {new Date(p.created_at).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })}
              {p.author && ` • ${p.author}`}
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">{p.title}</h1>
            {p.excerpt && <p className="mt-3 text-lg leading-relaxed text-ink/60">{p.excerpt}</p>}
            {p.content && (
              <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/75">
                {p.content.split("\n").map((para: string, i: number) =>
                  para.trim() ? <p key={i}>{para}</p> : null,
                )}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
