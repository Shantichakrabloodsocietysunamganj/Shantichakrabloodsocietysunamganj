"use client";

import { useEffect, useState } from "react";
import { scrollToPageTop } from "@/lib/motion";

// নিচের দিকে স্ক্রল করলে উপরে ওঠার বোতাম
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const next = window.scrollY > 500;
      setShow((current) => (current === next ? current : next));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToPageTop}
      aria-label="উপরে যান"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-glow transition-[opacity,transform,background-color] duration-300 ease-out-expo hover:-translate-y-1 hover:bg-brand-700 ${
        show ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
