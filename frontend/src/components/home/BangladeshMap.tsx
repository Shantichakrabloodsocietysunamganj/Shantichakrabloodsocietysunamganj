"use client";

import dynamic from "next/dynamic";
import BangladeshMapSVG from "./BangladeshMapSVG";
import MapErrorBoundary from "./MapErrorBoundary";

// Primary: true WebGL 3D map (client-only). Fallback/loading: reliable real-outline SVG map.
// The hero is never empty — SVG shows during load and on any WebGL failure.
const Map3D = dynamic(() => import("./BangladeshMap3D"), {
  ssr: false,
  loading: () => <BangladeshMapSVG />,
});

export default function BangladeshMap() {
  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-md">
      <MapErrorBoundary fallback={<BangladeshMapSVG />}>
        <Map3D />
      </MapErrorBoundary>
    </div>
  );
}
