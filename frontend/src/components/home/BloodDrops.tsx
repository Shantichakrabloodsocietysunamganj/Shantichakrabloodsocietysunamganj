"use client";

// ভাসমান/পড়ন্ত রক্তের ফোঁটা — hero background-এ animation
const DROPS = [
  { left: "8%", size: 14, delay: 0, dur: 9, op: 0.5 },
  { left: "20%", size: 9, delay: 2, dur: 11, op: 0.35 },
  { left: "33%", size: 18, delay: 1, dur: 13, op: 0.45 },
  { left: "48%", size: 10, delay: 3.5, dur: 10, op: 0.3 },
  { left: "62%", size: 16, delay: 0.5, dur: 12, op: 0.4 },
  { left: "74%", size: 8, delay: 2.5, dur: 9.5, op: 0.3 },
  { left: "86%", size: 13, delay: 1.5, dur: 11.5, op: 0.4 },
  { left: "94%", size: 11, delay: 3, dur: 10.5, op: 0.35 },
];

export default function BloodDrops() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {DROPS.map((d, i) => (
        <span
          key={i}
          className="absolute -top-10 text-blood-400"
          style={{
            left: d.left,
            opacity: d.op,
            animation: `dropFall ${d.dur}s linear ${d.delay}s infinite`,
          }}
        >
          <svg width={d.size} height={d.size * 1.4} viewBox="0 0 12 17" fill="currentColor">
            <path d="M6 0s6 7 6 11a6 6 0 0 1-12 0C0 7 6 0 6 0z" />
          </svg>
        </span>
      ))}
      <style>{`
        @keyframes dropFall {
          0% { transform: translateY(-10px) scale(0.9); opacity: 0; }
          15% { opacity: 0.6; }
          90% { opacity: 0.5; }
          100% { transform: translateY(560px) scale(1.1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
