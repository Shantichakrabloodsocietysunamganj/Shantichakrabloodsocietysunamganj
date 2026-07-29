"use client";

// গ্লসি 3D রক্তের ফোঁটা — radial gradient, highlight, glow, floating
export default function BloodDrop3D({ size = 160 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size * 1.4 }}>
      {/* পেছনের glow */}
      <span className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blood-500/30 blur-2xl animate-pulse" />

      <svg
        viewBox="0 0 100 140"
        className="relative animate-float drop-shadow-[0_12px_30px_rgba(214,40,40,0.5)]"
        width={size}
        height={size * 1.4}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="drop3d" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="35%" stopColor="#ef4444" />
            <stop offset="75%" stopColor="#d62828" />
            <stop offset="100%" stopColor="#841515" />
          </radialGradient>
          <radialGradient id="dropHi" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dropRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* মূল ফোঁটা */}
        <path
          d="M50,4 C50,4 92,58 92,94 A42,42 0 1 1 8,94 C8,58 50,4 50,4 Z"
          fill="url(#drop3d)"
          stroke="#a61e1e"
          strokeWidth="1"
        />
        {/* উপরের প্রান্তের হালকা আলো */}
        <path
          d="M50,10 C50,10 86,58 86,90 A38,38 0 0 1 70,58 C60,42 52,22 50,10 Z"
          fill="url(#dropRim)"
        />
        {/* প্রধান হাইলাইট (specular) */}
        <ellipse cx="36" cy="78" rx="11" ry="20" fill="url(#dropHi)" transform="rotate(-18 36 78)" />
        {/* ছোট হাইলাইট */}
        <circle cx="42" cy="64" r="4" fill="#fff" opacity="0.6" />
        {/* নিচের ছায়ার গাঢ় অংশ */}
        <path d="M50,128 A42,42 0 0 1 8,94 C8,80 22,96 40,110 C52,119 50,126 50,128 Z" fill="#630e0e" opacity="0.35" />
      </svg>

      {/* ছোট ছিটকানি (sparkle) */}
      <span className="absolute right-2 top-6 h-1.5 w-1.5 rounded-full bg-white/80 animate-ping" />
    </div>
  );
}
