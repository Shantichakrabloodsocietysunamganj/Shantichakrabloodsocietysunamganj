"use client";

import { useEffect, useRef } from "react";
import { localeOf } from "@/lib/format";
import { useLang } from "@/lib/useLang";

// SSR/প্রথম রেন্ডারে আসল সংখ্যাই দেখায় (JS ব্যর্থ হলেও মান ঠিক থাকে);
// স্ক্রলে দৃশ্যমান হলে ০ থেকে গুনে চূড়ান্ত মানে পৌঁছায় (count-up animation)।
export default function CountUp({
  end,
  duration = 1600,
  suffix = "",
  className = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const lang = useLang();
  const locale = localeOf(lang);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let started = false;
    const format = (value: number) => `${value.toLocaleString(locale)}${suffix}`;
    const finish = () => { el.textContent = format(end); };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    const startCount = () => {
      if (started) return;
      started = true;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        // Updating text directly avoids a React tree render on every frame.
        el.textContent = format(Math.round(end * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      startCount();
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        startCount();
        observer.unobserve(el);
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, duration, suffix, locale]);

  return (
    <span ref={ref} className={className}>
      {end.toLocaleString(locale)}{suffix}
    </span>
  );
}
