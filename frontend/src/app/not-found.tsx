import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden py-20 text-center">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="relative">
        <p className="font-display text-[7rem] font-extrabold leading-none tracking-tighter">
          <span className="bg-gradient-to-br from-brand-600 to-blood-600 bg-clip-text text-transparent">৪০৪</span>
        </p>
        <div className="mx-auto -mt-2 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-600 to-blood-700 text-3xl text-white shadow-glow">🩸</div>
        <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-ink">পেজ পাওয়া যায়নি</h1>
        <p className="mx-auto mt-2 max-w-md text-ink/60">আপনি যে পেজটি খুঁজছেন সেটি এখানে নেই। হয়তো সরে গেছে বা আর নেই।</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">হোমে ফিরুন</Link>
          <Link href="/donors" className="btn-outline">রক্তদাতা খুঁজুন</Link>
        </div>
      </div>
    </div>
  );
}
