"use client";

import { useState } from "react";

export default function CopyButton({ text, label = "কপি করুন" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // পুরনো ব্রাউজারের জন্য fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      type="button"
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
        copied
          ? "bg-success-500 text-white"
          : "bg-brand-600 text-white hover:bg-brand-700"
      }`}
    >
      {copied ? "✓ কপি হয়েছে" : `📋 ${label}`}
    </button>
  );
}
