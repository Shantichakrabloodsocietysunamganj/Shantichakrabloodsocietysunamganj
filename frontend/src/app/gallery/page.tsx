import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryGrid from "@/components/GalleryGrid";
import { ImageIcon } from "@/components/icons";

export const metadata: Metadata = { title: "গ্যালারি" };

export default async function GalleryPage() {
  const supabase = createClient();
  let images: any[] = [];
  let ok = false;
  try {
    const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    if (!error) { images = data ?? []; ok = true; }
  } catch {}

  return (
    <div className="container-page py-12">
      <SectionHeading eyebrow="গ্যালারি" title="আমাদের মুহূর্তগুলো"
        subtitle="রক্তদান শিবির, কর্মসূচি ও সমিতির কার্যক্রমের ছবি।" />

      <div className="mt-10">
        {!ok ? (
          <p className="text-center text-sm text-ink/50">গ্যালারি লোড করা যায়নি।</p>
        ) : images.length === 0 ? (
          <div className="card p-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><ImageIcon className="h-6 w-6" /></span>
            <p className="mt-2 font-medium text-ink">এখনো কোনো ছবি যোগ করা হয়নি</p>
            <p className="mt-1 text-sm text-ink/60">অ্যাডমিন ড্যাশবোর্ড থেকে ছবি যোগ করা হবে।</p>
          </div>
        ) : (
          <GalleryGrid images={images} />
        )}
      </div>
    </div>
  );
}
