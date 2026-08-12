const MAP: Record<string, { label: string; cls: string }> = {
  // `pending` is kept only for older rows; requests no longer wait for approval.
  pending: { label: "লাইভ", cls: "bg-brand-100 text-brand-700" },
  approved: { label: "লাইভ", cls: "bg-brand-100 text-brand-700" },
  completed: { label: "সম্পন্ন", cls: "bg-success-100 text-success-700" },
  cancelled: { label: "বাতিল", cls: "bg-zinc-200 text-zinc-600" },
  open: { label: "চলমান", cls: "bg-brand-100 text-brand-700" },
  active: { label: "সক্রিয়", cls: "bg-success-100 text-success-700" },
  inactive: { label: "নিষ্ক্রিয়", cls: "bg-zinc-200 text-zinc-600" },
  upcoming: { label: "আসন্ন", cls: "bg-brand-100 text-brand-700" },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = MAP[status] ?? MAP.pending;
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}
