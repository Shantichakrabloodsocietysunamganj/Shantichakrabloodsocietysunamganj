"use client";

import { useEffect, useRef } from "react";

type Drop = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  label: string;
  el: HTMLSpanElement | null;
};

/** ব্লাড গ্রুপ — বাংলাদেশে প্রাচুর্য অনুযায়ী সাজানো (B+ সবচেয়ে বেশি) */
const GROUPS = ["B+", "O+", "A+", "AB+", "B-", "O-", "A-", "AB-"];

/** 3D glossy blood-drop SVG (radial gradient + specular highlight + rim light + group label) */
function dropSvg(size: number, uid: string, label: string): string {
  const w = size;
  const h = size * 1.4;
  const fontSize = label.length > 2 ? 26 : 32;
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
  <text x="50" y="106" text-anchor="middle" font-size="${fontSize}" font-weight="700" fill="#ffffff" fill-opacity="0.92" stroke="#6d0f0f" stroke-opacity="0.5" stroke-width="3" paint-order="stroke" style="pointer-events:none">${label}</text>
</svg>`;
}

// ভাসমান/পড়ন্ত 3D রক্তের ফোঁটা — device tilt (gyroscope) অনুযায়ী gravity
export default function BloodDrops() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // The hero intentionally hides this layer on compact screens. Avoid creating
    // SVG nodes, observers, animation frames, and device-orientation listeners
    // when it cannot be seen.
    if (window.matchMedia("(max-width: 639px)").matches) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = container.clientWidth;
    let height = container.clientHeight;
    let frame = 0;
    let lastTime = 0;
    let inView = true;
    let orientationAttached = false;
    const gravity = { x: 0, y: 0.045 };

    const updateBounds = () => {
      width = container.clientWidth;
      height = container.clientHeight;
    };
    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(updateBounds)
      : null;
    resizeObserver?.observe(container);

    const reset = (drop: Drop, visible = false) => {
      drop.x = Math.random() * Math.max(width - drop.size, 1);
      drop.y = visible
        ? Math.random() * Math.max(height - drop.size * 1.4, 1)
        : -20 - Math.random() * height * 0.4;
      drop.vx = (Math.random() - 0.5) * 0.6;
      drop.vy = Math.random() * 0.6;
      drop.rot = (Math.random() - 0.5) * 18;
    };

    // Keep the decorative layer lighter on small screens where GPU/CPU
    // resources are usually tighter.
    const count = window.matchMedia("(max-width: 640px)").matches ? 6 : 9;
    const drops: Drop[] = Array.from({ length: count }, (_, i) => {
      const drop: Drop = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 14 + Math.random() * 14,
        rot: 0,
        label: GROUPS[i % GROUPS.length],
        el: null,
      };
      reset(drop, reduceMotion);
      return drop;
    });

    container.replaceChildren();
    drops.forEach((drop, i) => {
      const span = document.createElement("span");
      const opacity = 0.42 + Math.random() * 0.28;
      span.style.cssText = [
        "position:absolute",
        "top:0",
        "left:0",
        "will-change:transform",
        "backface-visibility:hidden",
        `opacity:${opacity.toFixed(2)}`,
        "pointer-events:none",
        "line-height:0",
      ].join(";");
      span.innerHTML = dropSvg(drop.size, `d${i}`, drop.label);
      span.style.transform = `translate3d(${drop.x.toFixed(1)}px,${drop.y.toFixed(1)}px,0) rotate(${drop.rot.toFixed(1)}deg)`;
      container.appendChild(span);
      drop.el = span;
    });

    // Reduced-motion users still get a static decorative composition.
    if (reduceMotion) {
      return () => resizeObserver?.disconnect();
    }

    const step = (now: number) => {
      // Normalize against 60fps, cap large background-tab jumps.
      const delta = lastTime ? Math.min((now - lastTime) / (1000 / 60), 2) : 1;
      lastTime = now;
      const drag = Math.pow(0.995, delta);
      const rotationDrag = Math.pow(0.98, delta);

      for (const drop of drops) {
        drop.vx = (drop.vx + gravity.x * delta) * drag;
        drop.vy = (drop.vy + gravity.y * delta) * drag;
        drop.x += drop.vx * delta;
        drop.y += drop.vy * delta;
        drop.rot = (drop.rot + drop.vx * 0.35 * delta) * rotationDrag;

        if (
          drop.y > height + 30 ||
          drop.y < -60 ||
          drop.x > width + 30 ||
          drop.x < -30
        ) {
          reset(drop);
          drop.y = -20;
          drop.x = Math.random() * Math.max(width - drop.size, 1);
          drop.vx = 0;
          drop.vy = 0;
        }

        if (drop.el) {
          drop.el.style.transform = `translate3d(${drop.x.toFixed(1)}px,${drop.y.toFixed(1)}px,0) rotate(${drop.rot.toFixed(1)}deg)`;
        }
      }

      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (frame || !inView || document.hidden) return;
      lastTime = 0;
      frame = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    };

    const viewObserver = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          if (inView) start(); else stop();
        }, { rootMargin: "100px" })
      : null;
    viewObserver?.observe(container);

    const onVisibilityChange = () => {
      if (document.hidden) stop(); else start();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    start();

    // device orientation → gravity (মোবাইল ঝুকলে সেদিকে)
    const onOrient = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma ?? 0;
      const beta = event.beta ?? 0;
      gravity.x = Math.max(-0.12, Math.min(0.12, (gamma / 90) * 0.12));
      gravity.y = Math.max(0.01, Math.min(0.12, (Math.abs(beta) / 90) * 0.06 + 0.04));
    };
    const attachOrientation = () => {
      if (orientationAttached) return;
      orientationAttached = true;
      window.addEventListener("deviceorientation", onOrient, true);
    };

    // iOS এ permission লাগে — প্রথম tap-এ request
    const orientationEvent = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    const requestOrientation = () => {
      if (orientationEvent && typeof orientationEvent.requestPermission === "function") {
        orientationEvent.requestPermission()
          .then((permission: string) => permission === "granted" && attachOrientation())
          .catch(() => {});
      } else {
        attachOrientation();
      }
    };

    if (orientationEvent && typeof orientationEvent.requestPermission === "function") {
      window.addEventListener("pointerdown", requestOrientation, { once: true });
    } else {
      attachOrientation();
    }

    return () => {
      stop();
      resizeObserver?.disconnect();
      viewObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("deviceorientation", onOrient, true);
      window.removeEventListener("pointerdown", requestOrientation);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden [contain:layout_paint_style]"
      aria-hidden="true"
    />
  );
}
