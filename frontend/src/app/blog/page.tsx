import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = { title: "ব্লগ ও খবর" };

export default async function BlogPage() {
  const supabase = createClient();
  let posts: any[] = [];
  let ok = false;
  try {
    const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    if (!error) { posts = data ?? []; ok = true; }
  } catch {}

  return (
    <div className="container-page py-12">
      <SectionHeading eyebrow="ব্লগ ও খবর" title="সর্বশেষ আপডেট"
        subtitle="রক্তদান, স্বাস্থ্য ও সমিতির কার্যক্রম সম্পর্কে খবর।" />

      <div className="mt-10">
        {!ok ? (
          <p className="text-center text-sm text-ink/50">ব্লগ লোড করা যায়নি।</p>
        ) : posts.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-3xl">📝</p>
            <p className="mt-2 font-medium text-ink">এখনো কোনো পোস্ট নেই</p>
            <p className="mt-1 text-sm text-ink/60">শীঘ্রই নতুন খবর যোগ হবে।</p>
            <Link href="/" className="btn-outline mt-4">হোমে যান</Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug || p.id}`} className="card-hover block overflow-hidden">
                {p.cover_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover_url} alt={p.title} className="h-44 w-full object-cover" loading="lazy" />
                )}
                <div className="p-5">
                  <p className="text-xs text-ink/40">{new Date(p.created_at).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })}</p>
                  <h3 className="mt-1 font-bold text-ink">{p.title}</h3>
                  {p.excerpt && <p className="mt-2 text-sm text-ink/60">{p.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
