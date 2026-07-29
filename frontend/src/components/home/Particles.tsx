"use client";

// হিরো ব্যাকগ্রাউন্ডে ভাসমান কণা (particle field)
const P = [
  { l: "5%", t: "20%", s: 3, d: 8, dl: 0 }, { l: "12%", t: "60%", s: 2, d: 10, dl: 1.5 },
  { l: "18%", t: "30%", s: 4, d: 12, dl: 0.8 }, { l: "25%", t: "75%", s: 2, d: 9, dl: 2.2 },
  { l: "30%", t: "15%", s: 3, d: 11, dl: 0.4 }, { l: "37%", t: "50%", s: 2, d: 13, dl: 1.8 },
  { l: "42%", t: "80%", s: 4, d: 10, dl: 2.6 }, { l: "48%", t: "25%", s: 2, d: 9.5, dl: 0.2 },
  { l: "55%", t: "65%", s: 3, d: 12.5, dl: 1.2 }, { l: "60%", t: "35%", s: 2, d: 11, dl: 2.0 },
  { l: "66%", t: "85%", s: 4, d: 9, dl: 0.6 }, { l: "70%", t: "20%", s: 2, d: 13, dl: 1.6 },
  { l: "76%", t: "55%", s: 3, d: 10.5, dl: 0.9 }, { l: "82%", t: "40%", s: 2, d: 12, dl: 2.4 },
  { l: "88%", t: "70%", s: 4, d: 9.5, dl: 0.3 }, { l: "92%", t: "30%", s: 2, d: 11.5, dl: 1.9 },
  { l: "8%", t: "45%", s: 2, d: 12, dl: 1.1 }, { l: "22%", t: "10%", s: 3, d: 10, dl: 2.8 },
  { l: "44%", t: "10%", s: 2, d: 13.5, dl: 0.7 }, { l: "63%", t: "10%", s: 3, d: 9.5, dl: 2.1 },
  { l: "80%", t: "10%", s: 2, d: 11, dl: 0.5 }, { l: "34%", t: "40%", s: 2, d: 10.5, dl: 1.4 },
  { l: "52%", t: "45%", s: 3, d: 12.5, dl: 0.1 }, { l: "73%", t: "50%", s: 2, d: 11, dl: 2.3 },
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
            opacity: 0.25,
            animation: `particleFloat ${p.d}s ease-in-out ${p.dl}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes particleFloat {
          0%,100% { transform: translate(0,0); opacity: 0.15; }
          50% { transform: translate(8px,-18px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
