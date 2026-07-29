"use client";

// হিরো ব্যাকগ্রাউন্ডে ভাসমান কণা (particle field) — হালকা, পরিমিত
const P = [
  { l: "8%", t: "22%", s: 3, d: 10, dl: 0 },
  { l: "20%", t: "60%", s: 2, d: 12, dl: 1.5 },
  { l: "32%", t: "30%", s: 3, d: 11, dl: 0.8 },
  { l: "44%", t: "78%", s: 2, d: 13, dl: 2.2 },
  { l: "55%", t: "18%", s: 3, d: 12, dl: 1.2 },
  { l: "62%", t: "55%", s: 2, d: 11, dl: 2.0 },
  { l: "72%", t: "80%", s: 3, d: 9, dl: 0.6 },
  { l: "82%", t: "35%", s: 2, d: 12, dl: 1.8 },
  { l: "90%", t: "65%", s: 3, d: 10.5, dl: 0.4 },
  { l: "14%", t: "45%", s: 2, d: 13, dl: 1.1 },
  { l: "48%", t: "12%", s: 2, d: 12, dl: 2.4 },
  { l: "68%", t: "15%", s: 3, d: 10, dl: 0.9 },
];

export default function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {P.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: p.l,
            top: p.t,
            width: p.s,
            height: p.s,
            opacity: 0.2,
            animation: `particleFloat ${p.d}s ease-in-out ${p.dl}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes particleFloat {
          0%,100% { transform: translate(0,0); opacity: 0.12; }
          50% { transform: translate(8px,-18px); opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}
