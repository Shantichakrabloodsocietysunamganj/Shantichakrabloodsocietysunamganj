"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/data/site";

const navLinks = [
  { href: "/", label: "হোম" },
  { href: "/donors", label: "রক্তদাতা খুঁজুন" },
  { href: "/request-blood", label: "রক্ত লাগবে?" },
  { href: "/requests", label: "জরুরি অনুরোধ" },
  { href: "/about", label: "আমাদের সম্পর্কে" },
  { href: "/contact", label: "যোগাযোগ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/85 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Logo />
          <div className="leading-tight">
            <div className="text-base font-bold text-zinc-900">{site.shortName}</div>
            <div className="text-[11px] font-medium text-brand-600">রক্তদান সমিতি</div>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          <Link href="/become-donor" className="btn-primary">
            রক্তদাতা হোন
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="মেনু"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-100 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-zinc-100 bg-white lg:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/become-donor"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2"
            >
              রক্তদাতা হোন
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Logo() {
  return (
    <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M12 2s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
      </svg>
    </span>
  );
}

function MenuIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
