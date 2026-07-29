export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
          {eyebrow}
        </span>
      )}
      <h2 className="section-title mt-4">{title}</h2>
      {center && (
        <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
      )}
      {subtitle && <p className="mt-4 text-base leading-relaxed text-zinc-600">{subtitle}</p>}
    </div>
  );
}
