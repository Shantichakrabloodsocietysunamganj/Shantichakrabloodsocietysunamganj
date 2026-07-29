// সার্ভার থেকে site_settings আনা (fallback: src/data/site.ts)
import { createClient } from "@/lib/supabase/server";
import { site } from "@/data/site";

export type SiteSettings = {
  logo_url: string | null;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  whatsapp: string;
  hero_image: string | null;
  hero_badge: string;
  hero_desc: string;
  mission: string;
  vision: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string | null;
  ga_id: string;
};

export async function getSettings(): Promise<SiteSettings> {
  const fb: SiteSettings = {
    logo_url: null, phone: site.phone, email: site.email, address: site.address,
    facebook: site.facebook, whatsapp: site.whatsapp, hero_image: null,
    hero_badge: "", hero_desc: "", mission: site.mission, vision: site.vision,
    meta_title: "", meta_description: "", meta_keywords: "", og_image: null, ga_id: "",
  };
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("logo_url,phone,email,address,facebook,whatsapp,hero_image,hero_badge,hero_desc,mission,vision,meta_title,meta_description,meta_keywords,og_image,ga_id")
      .eq("id", 1).single();
    if (error || !data) return fb;
    return {
      logo_url: data.logo_url || fb.logo_url,
      phone: data.phone || fb.phone,
      email: data.email || fb.email,
      address: data.address || fb.address,
      facebook: data.facebook || fb.facebook,
      whatsapp: data.whatsapp || fb.whatsapp,
      hero_image: data.hero_image || fb.hero_image,
      hero_badge: data.hero_badge || fb.hero_badge,
      hero_desc: data.hero_desc || fb.hero_desc,
      mission: data.mission || fb.mission,
      vision: data.vision || fb.vision,
      meta_title: data.meta_title || fb.meta_title,
      meta_description: data.meta_description || fb.meta_description,
      meta_keywords: data.meta_keywords || fb.meta_keywords,
      og_image: data.og_image || fb.og_image,
      ga_id: data.ga_id || fb.ga_id,
    };
  } catch { return fb; }
}
