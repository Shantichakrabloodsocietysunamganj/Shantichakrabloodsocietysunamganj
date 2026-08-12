import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryGrid from "@/components/GalleryGrid";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { getLang } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "রক্তদান কর্মসূচির ছবি | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "সুনামগঞ্জ ও সিলেট বিভাগের বিভিন্ন রক্তদান ক্যাম্প, স্বেচ্ছাসেবী কার্যক্রম ও সচেতনতামূলক কর্মসূচির ছবির গ্যালারি।",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "রক্তদান কর্মসূচির ছবি | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "সুনামগঞ্জ ও সিলেট বিভাগের বিভিন্ন রক্তদান ক্যাম্প, স্বেচ্ছাসেবী কার্যক্রম ও সচেতনতামূলক কর্মসূচির ছবির গ্যালারি।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/gallery",
    type: "website",
  },
};

export default async function GalleryPage() {
  const supabase = createClient();
  const lang = await getLang();
  const en = lang === "en";
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
          { name: en ? "Home" : "হোম", url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: en ? "Gallery" : "গ্যালারি", url: "https://shanticakrabloodsocaiety.rahatahmed.site/gallery" },
        ]}
      />
      <SectionHeading eyebrow={t("gallery.eyebrow", lang)} title={t("gallery.title", lang)}
        subtitle={t("gallery.sub", lang)} />

      <div className="mt-10">
        {!ok ? (
          <p className="text-center text-sm text-ink/50">{t("gallery.loadFail", lang)}</p>
        ) : images.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-3xl">🖼️</p>
            <p className="mt-2 font-medium text-ink">{t("gallery.noPhoto", lang)}</p>
            <p className="mt-1 text-sm text-ink/60">{t("gallery.adminAdd", lang)}</p>
          </div>
        ) : (
          <GalleryGrid images={images} />
        )}
      </div>
    </div>
  );
}
