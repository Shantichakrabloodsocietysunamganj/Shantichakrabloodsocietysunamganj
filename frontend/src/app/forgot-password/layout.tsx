import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "পাসওয়ার্ড পুনরুদ্ধার | শান্তিচক্র ব্লাড সোসাইটি",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
