"use client";

import dynamic from "next/dynamic";

// True WebGL 3D map — client-only (no SSR) to keep three.js out of the server bundle
const Map3D = dynamic(() => import("./BangladeshMap3D"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[3/4] w-full items-center justify-center">
      <div className="h-44 w-44 animate-pulse rounded-full bg-blood-500/25 blur-2xl" />
    </div>
  ),
});

export default function BangladeshMap() {
  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-md">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-blood-500/10 blur-3xl" />
      <div className="absolute inset-0">
        <Map3D />
      </div>
    </div>
  );
}
