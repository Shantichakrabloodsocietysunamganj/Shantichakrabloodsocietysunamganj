import Link from "next/link";
import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-200 bg-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 2s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
              </svg>
            </span>
            <div>
              <div className="font-bold text-zinc-900">{site.name}</div>
              <div className="text-xs text-brand-600">{site.taglineEn}</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-600">{site.mission}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-zinc-900">দ্রুত লিংক</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-600">
            <li><Link className="hover:text-brand-600" href="/donors">রক্তদাতা খুঁজুন</Link></li>
            <li><Link className="hover:text-brand-600" href="/request-blood">রক্তের অনুরোধ</Link></li>
            <li><Link className="hover:text-brand-600" href="/become-donor">রক্তদাতা হোন</Link></li>
            <li><Link className="hover:text-brand-600" href="/about">আমাদের সম্পর্কে</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-zinc-900">যোগাযোগ</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-600">
            <li>📍 {site.address}</li>
            <li>📞 {site.phone}</li>
            <li>✉️ {site.email}</li>
            <li className="pt-1">
              <a href={site.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium text-brand-600 hover:underline">
                Facebook পেজ →
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-100">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}। সর্বস্বত্ব সংরক্ষিত।</p>
          <p>স্বেচ্ছাসেবীভাবে তৈরি — সুনামগঞ্জের জন্য ❤️</p>
        </div>
      </div>
    </footer>
  );
}
