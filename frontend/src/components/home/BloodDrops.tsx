"use client";

import { useEffect, useRef } from "react";

type Drop = { x: number; y: number; vx: number; vy: number; size: number; el: HTMLSpanElement | null };

// ভাসমান/পড়ন্ত রক্তের ফোঁটা — device tilt (gyroscope) অনুযায়ী gravity
export default function BloodDrops() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropsRef = useRef<Drop[]>([]);
  const gravityRef = useRef({ x: 0, y: 0.045 }); // ডিফল্ট: নিচে
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const W = () => container.clientWidth;
    const H = () => container.clientHeight;

    // drop তৈরি
    const make = (d: Drop) => {
      d.x = Math.random() * W();
      d.y = -20 - Math.random() * H() * 0.4;
      d.vx = (Math.random() - 0.5) * 0.6;
      d.vy = Math.random() * 0.6;
    };
    const COUNT = 9;
    const drops: Drop[] = Array.from({ length: COUNT }, () => {
      const d: Drop = { x: 0, y: 0, vx: 0, vy: 0, size: 9 + Math.random() * 9, el: null };
      make(d);
      return d;
    });
    dropsRef.current = drops;

    // render elements
    container.innerHTML = "";
    drops.forEach((d) => {
      const span = document.createElement("span");
      span.style.cssText = "position:absolute;top:0;left:0;will-change:transform;color:#e74b4b;opacity:.38;";
      span.innerHTML = `<svg width="${d.size}" height="${d.size * 1.4}" viewBox="0 0 12 17" fill="currentColor"><path d="M6 0s6 7 6 11a6 6 0 0 1-12 0C0 7 6 0 6 0z"/></svg>`;
      container.appendChild(span);
      d.el = span;
    });

    if (reduce) {
      gravityRef.current = { x: 0, y: 0 };
      return;
    }

    // physics loop
    const step = () => {
      const w = W();
      const h = H();
      const g = gravityRef.current;
      for (const d of drops) {
        d.vx += g.x;
        d.vy += g.y;
        // সামান্য drag
        d.vx *= 0.995;
        d.x += d.vx;
        d.y += d.vy;
        // off-screen → reset (gravity দিক অনুযায়ী)
        if (d.y > h + 30 || d.y < -60 || d.x > w + 30 || d.x < -30) {
          make(d);
          // নতুন করে উপরে না হয়ে gravity-র উৎস দিক থেকে আসুক
          d.y = -20;
          d.x = Math.random() * w;
          d.vy = 0;
          d.vx = 0;
        }
        if (d.el) d.el.style.transform = `translate3d(${d.x.toFixed(1)}px,${d.y.toFixed(1)}px,0)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    // device orientation → gravity (মোবাইল ঝুকলে সেদিকে)
    const onOrient = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0; // left/right tilt (-90..90)
      const beta = e.beta ?? 0; // front/back (-180..180)
      const gx = Math.max(-0.12, Math.min(0.12, (gamma / 90) * 0.12));
      const gy = Math.max(0.01, Math.min(0.12, (Math.abs(beta) / 90) * 0.06 + 0.04));
      gravityRef.current = { x: gx, y: gy };
    };
    const tryOrient = () => {
      window.addEventListener("deviceorientation", onOrient, true);
    };

    // iOS এ permission লাগে — প্রথম tap-এ request
    const DOE = window.DeviceOrientationEvent as any;
    const onRequest = () => {
      if (DOE && typeof DOE.requestPermission === "function") {
        DOE.requestPermission().then((p: string) => p === "granted" && tryOrient()).catch(() => {});
      } else {
        tryOrient();
      }
      window.removeEventListener("pointerdown", onRequest);
    };
    if (DOE && typeof DOE.requestPermission === "function") {
      window.addEventListener("pointerdown", onRequest, { once: true });
    } else {
      tryOrient();
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("deviceorientation", onOrient, true);
      window.removeEventListener("pointerdown", onRequest);
    };
  }, []);

  return <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true" />;
}
