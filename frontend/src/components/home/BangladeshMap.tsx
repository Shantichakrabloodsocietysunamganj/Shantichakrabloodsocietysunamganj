"use client";

// Real Bangladesh SVG map (accurate outline) — the hero's map centerpiece.
import BangladeshMapSVG from "./BangladeshMapSVG";

export default function BangladeshMap() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <BangladeshMapSVG />
    </div>
  );
}
