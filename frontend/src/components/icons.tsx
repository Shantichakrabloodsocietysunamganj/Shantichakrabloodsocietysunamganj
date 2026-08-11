// =============================================================
//  কেন্দ্রীয় আইকন সিস্টেম — Lucide React + কাস্টম inline SVG
//  সব আইকন এক জায়গা থেকে — সাইটজুড়ে consistent look।
// =============================================================

import {
  Activity,
  AlarmClock,
  AlertTriangle,
  Ambulance,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Award,
  BadgeCheck,
  Banknote,
  BarChart3,
  Bell,
  Bot,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Copy,
  CreditCard,
  Download,
  Droplets,
  FileText,
  FlaskConical,
  Gem,
  HandHeart,
  Handshake,
  Heart,
  HeartPulse,
  HelpCircle,
  Hospital,
  Image as ImageIcon,
  Inbox,
  Laptop,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Medal,
  Megaphone,
  MessageCircle,
  Mic,
  Newspaper,
  PartyPopper,
  Pencil,
  Phone,
  Printer,
  RefreshCw,
  RotateCcw,
  Search,
  SearchX,
  Send,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  Siren,
  Smartphone,
  Sparkles,
  Star,
  Stethoscope,
  Syringe,
  Tag,
  Trash2,
  Trophy,
  Undo2,
  Upload,
  User,
  UserPlus,
  Users,
  Volume2,
  X,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";

export {
  Activity,
  AlarmClock,
  AlertTriangle,
  Ambulance,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Award,
  BadgeCheck,
  Banknote,
  BarChart3,
  Bell,
  Bot,
  Building2,
  Laptop,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Copy,
  CreditCard,
  Download,
  Droplets,
  FileText,
  FlaskConical,
  Gem,
  HandHeart,
  Handshake,
  Heart,
  HeartPulse,
  HelpCircle,
  Hospital,
  ImageIcon,
  Inbox,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Medal,
  Megaphone,
  MessageCircle,
  Mic,
  Newspaper,
  PartyPopper,
  Pencil,
  Phone,
  Printer,
  RefreshCw,
  RotateCcw,
  Search,
  SearchX,
  Send,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  Siren,
  Smartphone,
  Sparkles,
  Star,
  Stethoscope,
  Syringe,
  Tag,
  Trash2,
  Trophy,
  Undo2,
  Upload,
  User,
  UserPlus,
  Users,
  Volume2,
  X,
  XCircle,
  Zap,
  type LucideIcon,
};

type IconProps = { className?: string };

/* ---------- কাস্টম SVG — রক্তের ফোঁটা (ব্র্যান্ড স্টাইল) ---------- */
export function BloodDropIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bd-grad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f87171" />
          <stop offset="0.55" stopColor="#dc2626" />
          <stop offset="1" stopColor="#991b1b" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.7c.9 1.9 6.3 8.2 6.3 12.3a6.3 6.3 0 1 1-12.6 0C5.7 10.9 11.1 4.6 12 2.7z"
        fill="url(#bd-grad)"
      />
      <path
        d="M9.2 13.2c.15 1.9 1.35 3.1 3 3.35"
        stroke="#fecaca"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <circle cx="9.1" cy="11.4" r="0.9" fill="#fecaca" opacity="0.95" />
    </svg>
  );
}

/* ---------- কাস্টম SVG — ঢেকুর (heartbeat pulse সহ ফোঁটা) ---------- */
export function BloodDropPulseIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2.7c.9 1.9 6.3 8.2 6.3 12.3a6.3 6.3 0 1 1-12.6 0C5.7 10.9 11.1 4.6 12 2.7z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M12 2.7c.9 1.9 6.3 8.2 6.3 12.3a6.3 6.3 0 1 1-12.6 0C5.7 10.9 11.1 4.6 12 2.7z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8 15h2l1.2-2.6 1.6 4 1.2-2.4H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- কাস্টম SVG — দাতা টিয়ার ব্যাজ (🥇🥈🥉💎🛡⚪-এর বদলে) ---------- */
export type TierKey = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "guardian" | "new";

export const tierMeta: Record<TierKey, { label: string; ring: string; bg: string; text: string; glow: string }> = {
  new: { label: "নতুন", ring: "ring-zinc-300", bg: "from-zinc-100 to-zinc-200", text: "text-zinc-500", glow: "" },
  bronze: { label: "ব্রোঞ্জ", ring: "ring-amber-400/70", bg: "from-amber-100 to-amber-200", text: "text-amber-700", glow: "shadow-[0_0_12px_rgba(217,119,6,0.25)]" },
  silver: { label: "সিলভার", ring: "ring-slate-300", bg: "from-slate-100 to-slate-200", text: "text-slate-600", glow: "shadow-[0_0_12px_rgba(100,116,139,0.25)]" },
  gold: { label: "গোল্ড", ring: "ring-yellow-400/80", bg: "from-yellow-100 to-amber-200", text: "text-yellow-700", glow: "shadow-[0_0_14px_rgba(234,179,8,0.35)]" },
  platinum: { label: "প্লাটিনাম", ring: "ring-cyan-300", bg: "from-cyan-50 to-sky-200", text: "text-cyan-700", glow: "shadow-[0_0_14px_rgba(6,182,212,0.3)]" },
  diamond: { label: "ডায়মন্ড", ring: "ring-violet-300", bg: "from-violet-100 to-fuchsia-200", text: "text-violet-700", glow: "shadow-[0_0_16px_rgba(139,92,246,0.35)]" },
  guardian: { label: "গার্ডিয়ান", ring: "ring-brand-400/80", bg: "from-brand-100 to-brand-200", text: "text-brand-700", glow: "shadow-[0_0_16px_rgba(220,38,38,0.3)]" },
};

export function TierBadge({ tier, className = "w-5 h-5" }: { tier: TierKey } & IconProps) {
  // মেডেল স্টাইল ব্যাজ — ribbon + disc + star/drop
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8.5 2.5 6 9l3-1.5L10.5 3zM15.5 2.5 18 9l-3-1.5L13.5 3z" fill="currentColor" opacity="0.55" />
      <circle cx="12" cy="14" r="6.4" fill="currentColor" opacity="0.18" />
      <circle cx="12" cy="14" r="6.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="14" r="3.1" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2.1 1.6" opacity="0.75" />
      {tier === "diamond" || tier === "platinum" ? (
        <path d="M12 11.8l1.5 2.2-1.5 2.2-1.5-2.2z" fill="currentColor" />
      ) : tier === "guardian" ? (
        <path d="M12 11.3c.28.55 2 2.45 2 3.7a2 2 0 1 1-4 0c0-1.25 1.72-3.15 2-3.7z" fill="currentColor" />
      ) : (
        <path d="M12 11.6l.75 1.5 1.66.24-1.2 1.17.28 1.65L12 15.4l-1.49.76.28-1.65-1.2-1.17 1.66-.24z" fill="currentColor" />
      )}
    </svg>
  );
}

/* ---------- কাস্টম SVG — Facebook (📘-এর বদলে) ---------- */
export function FacebookIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.87.24-1.46 1.5-1.46h1.4V4.95c-.24-.03-1.07-.1-2.04-.1-2.02 0-3.4 1.23-3.4 3.5V11H8.5v3H11v7z" />
    </svg>
  );
}

/* ---------- কাস্টম SVG — WhatsApp ---------- */
export function WhatsAppIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8zM9.1 7.4c-.2 0-.5.07-.7.35-.3.27-1 1-1 2.4s1 2.8 1.15 3c.15.2 2 3.2 5 4.35 2.45.97 2.95.78 3.5.73.53-.05 1.7-.7 1.95-1.37.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.34l-1.9-.9c-.27-.1-.47-.15-.66.1-.2.27-.76.9-.93 1.1-.17.18-.34.2-.63.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53l-.87-2.06c-.22-.53-.44-.46-.62-.47z" />
    </svg>
  );
}

/* ---------- কাস্টম SVG — bKash / Nagad / Rocket (মোবাইল ব্যাংকিং) ---------- */
export function MobileBankingIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="7" y="2.5" width="10" height="19" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10.5 5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.8 14.6l1.4 1.4 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- ডেটা-ফাইলের icon key → কম্পোনেন্ট ম্যাপ ---------- */
const dataIconMap: Record<string, LucideIcon | ((p: IconProps) => JSX.Element)> = {
  droplet: Droplets,
  siren: Siren,
  stethoscope: Stethoscope,
  flask: FlaskConical,
  shield: Shield,
  "shield-check": ShieldCheck,
  hospital: Hospital,
  building: Building2,
  handshake: Handshake,
  ambulance: Ambulance,
  phone: Phone,
  "map-pin": MapPin,
  heart: Heart,
  zap: Zap,
  lock: Lock,
  gem: Gem,
  users: Users,
  calendar: Calendar,
  newspaper: Newspaper,
  megaphone: Megaphone,
  camera: Camera,
  image: ImageIcon,
  mail: Mail,
  alert: AlertTriangle,
  check: CheckCircle2,
  clock: Clock,
  activity: Activity,
  "bar-chart": BarChart3,
  sparkles: Sparkles,
  award: Award,
  trophy: Trophy,
  medal: Medal,
  syringe: Syringe,
  "heart-pulse": HeartPulse,
  "hand-heart": HandHeart,
  "credit-card": CreditCard,
  smartphone: Smartphone,
  clipboard: ClipboardList,
  bell: Bell,
  search: Search,
  star: Star,
  car: ({ className = "w-5 h-5" }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 11l1.5-4.2A2 2 0 0 1 8.4 5.5h7.2a2 2 0 0 1 1.9 1.3L19 11m-14 0h14a2 2 0 0 1 2 2v4h-2.2M5 11a2 2 0 0 0-2 2v4h2.2m0 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m9.6 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0M9.2 17h5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  refresh: RefreshCw,
  target: ({ className = "w-5 h-5" }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    </svg>
  ),
  globe: ({ className = "w-5 h-5" }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

/** ডেটা ফাইলে (site.ts / emergency.ts) string key হিসেবে আইকন রাখা হয় — এই কম্পোনেন্ট রেন্ডার করে */
export function DataIcon({ name, className = "w-5 h-5" }: { name: string } & IconProps) {
  const Cmp = dataIconMap[name] ?? Droplets;
  return <Cmp className={className} aria-hidden="true" />;
}

/** স্ট্যাট কার্ডের জন্য — রঙিন রাউন্ডেড বক্সের ভেতরে আইকন (emoji-র বদলে প্রিমিয়াম লুক) */
export function IconChip({
  icon: Icon,
  tone = "brand",
  className = "",
  iconClassName = "w-5 h-5",
}: {
  icon: LucideIcon | ((p: IconProps) => JSX.Element);
  tone?: "brand" | "red" | "amber" | "emerald" | "sky" | "violet" | "zinc" | "rose";
  className?: string;
  iconClassName?: string;
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-50 text-brand-600 ring-brand-100",
    red: "bg-blood-50 text-blood-600 ring-blood-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    sky: "bg-sky-50 text-sky-600 ring-sky-100",
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
    rose: "bg-rose-50 text-rose-600 ring-rose-100",
    zinc: "bg-zinc-100 text-zinc-500 ring-zinc-200",
  };
  return (
    <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${tones[tone]} ${className}`}>
      <Icon className={iconClassName} aria-hidden="true" />
    </span>
  );
}
