import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "নোটিফিকেশন | শান্তিচক্র ব্লাড সোসাইটি",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
