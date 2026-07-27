import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/data/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.mission.slice(0, 155),
  keywords: [
    "রক্তদান",
    "blood donation",
    "Sunamganj",
    "সুনামগঞ্জ",
    "রক্তদাতা",
    "শান্তিচক্র",
    "Shantichakra",
  ],
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description: site.mission,
    type: "website",
    locale: "bn_BD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-bengali bg-zinc-50 text-zinc-900 antialiased">
        <Navbar />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
