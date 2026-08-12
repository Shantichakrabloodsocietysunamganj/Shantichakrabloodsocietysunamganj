"use client";

// লাইভ সংযোগের ছোট ইন্ডিকেটর — সবুজ পালস = রিয়েল-টাইম চালু
export default function LiveBadge({
  live,
  lastUpdated,
  en = false,
  className = "",
}: {
  live: boolean;
  lastUpdated?: number;
  en?: boolean;
  className?: string;
}) {
  const time =
    lastUpdated
      ? new Date(lastUpdated).toLocaleTimeString(en ? "en-GB" : "bn-BD", { hour: "2-digit", minute: "2-digit" })
      : null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        live ? "bg-success-50 text-success-700" : "bg-zinc-100 text-zinc-500"
      } ${className}`}
      title={time ? (en ? `Updated ${time}` : `আপডেট: ${time}`) : undefined}
    >
      <span className="relative flex h-2 w-2">
        {live && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-500 opacity-70" />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${live ? "bg-success-500" : "bg-zinc-400"}`} />
      </span>
      {live ? (en ? "LIVE" : "লাইভ") : en ? "Auto-refresh" : "স্বয়ংক্রিয় আপডেট"}
    </span>
  );
}
