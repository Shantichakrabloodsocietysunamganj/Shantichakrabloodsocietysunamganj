import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-50 text-4xl">🩸</div>
      <h1 className="mt-6 text-3xl font-bold text-zinc-900">৪০৪ — পেজ পাওয়া যায়নি</h1>
      <p className="mt-2 max-w-md text-zinc-600">আপনি যে পেজটি খুঁজছেন সেটি এখানে নেই। হয়তো সরে গেছে।</p>
      <Link href="/" className="btn-primary mt-6">হোমে ফিরুন</Link>
    </div>
  );
}
