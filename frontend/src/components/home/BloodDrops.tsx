"use client";

import { useEffect, useRef } from "react";

type Drop = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  el: HTMLSpanElement | null;
};

/** 3D glossy blood-drop SVG (radial gradient + specular highlight + rim light) */
function dropSvg(size: number, uid: string): string {
  const w = size;
  const h = size * 1.4;
  return `<svg width="${w}" height="${h}" viewBox="0 0 100 140" fill="none" aria-hidden="true" style="filter:drop-shadow(0 ${Math.max(2, size * 0.12)}px ${Math.max(4, size * 0.28)}px rgba(132,21,21,0.55))">
  <defs>
    <radialGradient id="bd3d-${uid}" cx="38%" cy="32%" r="75%">
      <stop offset="0%" stop-color="#ff6b6b"/>
      <stop offset="35%" stop-color="#ef4444"/>
      <stop offset="75%" stop-color="#d62828"/>
      <stop offset="100%" stop-color="#841515"/>
    </radialGradient>
    <radialGradient id="bdhi-${uid}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bdrim-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path d="M50,4 C50,4 92,58 92,94 A42,42 0 1 1 8,94 C8,58 50,4 50,4 Z" fill="url(#bd3d-${uid})" stroke="#a61e1e" stroke-width="1"/>
  <path d="M50,10 C50,10 86,58 86,90 A38,38 0 0 1 70,58 C60,42 52,22 50,10 Z" fill="url(#bdrim-${uid})"/>
  <ellipse cx="36" cy="78" rx="11" ry="20" fill="url(#bdhi-${uid})" transform="rotate(-18 36 78)"/>
  <circle cx="42" cy="64" r="4" fill="#fff" opacity="0.65"/>
  <path d="M50,128 A42,42 0 0 1 8,94 C8,80 22,96 40,110 C52,119 50,126 50,128 Z" fill="#630e0e" opacity="0.35"/>
</svg>`;
}

// ভাসমান/পড়ন্ত 3D রক্তের ফোঁটা — device tilt (gyroscope) অনুযায়ী gravity
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
      d.rot = (Math.random() - 0.5) * 18;
    };
    const COUNT = 9;
    const drops: Drop[] = Array.from({ length: COUNT }, () => {
      const d: Drop = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 10 + Math.random() * 12,
        rot: 0,
        el: null,
      };
      make(d);
      return d;
    });
    dropsRef.current = drops;

    // render elements — 3D glossy SVG
    container.innerHTML = "";
    drops.forEach((d, i) => {
      const span = document.createElement("span");
      const opacity = 0.42 + Math.random() * 0.28;
      span.style.cssText = [
        "position:absolute",
        "top:0",
        "left:0",
        "will-change:transform,opacity",
        `opacity:${opacity.toFixed(2)}`,
        "pointer-events:none",
        "line-height:0",
      ].join(";");
      span.innerHTML = dropSvg(d.size, `d${i}`);
      container.appendChild(span);
      d.el = span;
    });

    if (reduce) {
      gravityRef.current = { x: 0, y: 0 };
      // still paint once so reduced-motion users see the 3D drops
      for (const d of drops) {
        if (d.el) {
          d.el.style.transform = `translate3d(${d.x.toFixed(1)}px,${d.y.toFixed(1)}px,0) rotate(${d.rot.toFixed(1)}deg)`;
        }
      }
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
        // slight tilt toward velocity for 3D motion feel
        d.rot += d.vx * 0.35;
        d.rot *= 0.98;
        // off-screen → reset (gravity দিক অনুযায়ী)
        if (d.y > h + 30 || d.y < -60 || d.x > w + 30 || d.x < -30) {
          make(d);
          // নতুন করে উপরে না হয়ে gravity-র উৎস দিক থেকে আসুক
          d.y = -20;
          d.x = Math.random() * w;
          d.vy = 0;
          d.vx = 0;
        }
        if (d.el) {
          d.el.style.transform = `translate3d(${d.x.toFixed(1)}px,${d.y.toFixed(1)}px,0) rotate(${d.rot.toFixed(1)}deg)`;
        }
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
    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    const onRequest = () => {
      if (DOE && typeof DOE.requestPermission === "function") {
        DOE.requestPermission()
          .then((p: string) => p === "granted" && tryOrient())
          .catch(() => {});
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

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
