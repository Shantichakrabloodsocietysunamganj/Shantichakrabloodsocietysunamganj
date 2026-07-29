export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-title mt-4">
        {title}
      </h2>
      {center && (
        <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
      )}
      {subtitle && <p className="mt-4 text-base leading-relaxed text-ink/60">{subtitle}</p>}
    </div>
  );
}
