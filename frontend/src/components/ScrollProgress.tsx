"use client";

import { useEffect, useRef } from "react";

// পেজের উপরে স্ক্রল প্রগ্রেস বার — compositor transform, React re-render ছাড়া
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const maxScroll = Math.max(root.scrollHeight - root.clientHeight, 1);
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const contentObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(scheduleUpdate)
      : null;

    update();
    contentObserver?.observe(document.body);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    return () => {
      contentObserver?.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-brand-600 via-brand-500 to-blood-500 will-change-transform"
      />
    </div>
  );
}
