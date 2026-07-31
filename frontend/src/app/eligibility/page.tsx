import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import EligibilityChecker from "@/components/EligibilityChecker";

export const metadata: Metadata = {
  title: "রক্তদানের যোগ্যতা যাচাই",
  description:
    "বয়স, ওজন ও স্বাস্থ্য — মাত্র ১ মিনিটের কুইজে জেনে নিন আপনি এখন রক্ত দিতে পারবেন কি না।",
};

export default function EligibilityPage() {
  return (
    <div className="container-page py-12">
      <SectionHeading
        eyebrow="যোগ্যতা যাচাই"
        title="আমি কি এখন রক্ত দিতে পারব?"
        subtitle="কয়েকটি সহজ প্রশ্নের উত্তর দিয়ে মুহূর্তেই জেনে নিন — কোনো তথ্য সেভ হয় না।"
      />
      <div className="mt-10">
        <EligibilityChecker />
      </div>
    </div>
  );
}
