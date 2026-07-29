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
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-zinc-600">{subtitle}</p>}
    </div>
  );
}
