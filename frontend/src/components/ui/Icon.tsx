import { Gem, Handshake, Lock, MapPin, RefreshCw, Zap, type LucideIcon } from "lucide-react";

// স্ট্রিং-কি থেকে lucide আইকনে ম্যাপ — ইমোজির বদলে consistent SVG আইকন
const ICONS: Record<string, LucideIcon> = {
  handshake: Handshake,
  zap: Zap,
  lock: Lock,
  gem: Gem,
  "map-pin": MapPin,
  "refresh-cw": RefreshCw,
};

export default function Icon({
  name,
  className = "h-6 w-6",
  strokeWidth = 2,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = ICONS[name] ?? Handshake;
  return <Cmp className={className} strokeWidth={strokeWidth} />;
}
