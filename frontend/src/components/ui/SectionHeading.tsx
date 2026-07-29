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
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink text-balance sm:text-3xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-ink/60">{subtitle}</p>}
    </div>
  );
}
