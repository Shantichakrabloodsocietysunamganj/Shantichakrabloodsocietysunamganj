import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryGrid from "@/components/GalleryGrid";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "রক্তদান কর্মসূচির ছবি | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "সুনামগঞ্জ ও সিলেট বিভাগের বিভিন্ন রক্তদান ক্যাম্প, স্বেচ্ছাসেবী কার্যক্রম ও সচেতনতামূলক কর্মসূচির ছবির গ্যালারি।",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "রক্তদান কর্মসূচির ছবি | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "সুনামগঞ্জ ও সিলেট বিভাগের বিভিন্ন রক্তদান ক্যাম্প, স্বেচ্ছাসেবী কার্যক্রম ও সচেতনতামূলক কর্মসূচির ছবির গ্যালারি।",
    url: "https://shantichakrabloodsociety.rahatahmed.site/gallery",
    type: "website",
  },
};

export default async function GalleryPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  const supabase = createClient();
  let images: any[] = [];
  let ok = false;
  try {
    const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    if (!error) { images = data ?? []; ok = true; }
  } catch {}

  return (
    <div className="container-page py-12">
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("গ্যালারি"), url: "https://shantichakrabloodsociety.rahatahmed.site/gallery" },
        ]}
      />
      <SectionHeading eyebrow={tx("গ্যালারি")} title={tx("আমাদের মুহূর্তগুলো")}
        subtitle={tx("রক্তদান শিবির, কর্মসূচি ও সমিতির কার্যক্রমের ছবি।")} />

      <div className="mt-10">
        {!ok ? (
          <p className="text-center text-sm text-ink/50">{tx("গ্যালারি লোড করা যায়নি।")}</p>
        ) : images.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-3xl">🖼️</p>
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
