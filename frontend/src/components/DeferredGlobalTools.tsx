"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// These optional, interactive tools are intentionally deferred until the browser
// is idle. They remain available on every page without competing with the hero,
// navigation, and primary emergency actions during initial render.
const AIAssistant = dynamic(() => import("@/components/AIAssistant"), { ssr: false });
const LiveRequestAlert = dynamic(() => import("@/components/LiveRequestAlert"), { ssr: false });
const RequesterFollowUp = dynamic(() => import("@/components/RequesterFollowUp"), { ssr: false });
const CommandPalette = dynamic(() => import("@/components/CommandPalette"), { ssr: false });

export default function DeferredGlobalTools() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => setReady(true);
    const idle = window.requestIdleCallback?.(load, { timeout: 2000 });
    const fallback = idle === undefined ? window.setTimeout(load, 1200) : undefined;

    return () => {
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      if (fallback !== undefined) window.clearTimeout(fallback);
    };
  }, []);

  return (
    <>
      <CommandPalette />
      {ready ? <><LiveRequestAlert /><RequesterFollowUp /><AIAssistant /></> : null}
    </>
  );
}
