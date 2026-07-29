"use client";

import { useEffect, useState } from "react";

// পেজের উপরে স্ক্রল প্রগ্রেস বার
export default function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      setWidth(Math.min(scrolled * 100, 100));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1">
      <div
        className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-blood-500 transition-[width] duration-150 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
