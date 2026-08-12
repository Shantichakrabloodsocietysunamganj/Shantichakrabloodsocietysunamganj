import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "অ্যাকাউন্ট তৈরি | শান্তিচক্র ব্লাড সোসাইটি",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
