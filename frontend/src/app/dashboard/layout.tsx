import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ড্যাশবোর্ড | শান্তিচক্র ব্লাড সোসাইটি",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
