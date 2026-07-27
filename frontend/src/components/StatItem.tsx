// হোমপেজের স্ট্যাটস সেকশন — সার্ভার থেকে লাইভ সংখ্যা গ্রহণ করে
export default function StatItem({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-3xl font-extrabold text-brand-600 sm:text-4xl">
        {value.toLocaleString("bn-BD")}
        {suffix && <span className="text-2xl">{suffix}</span>}
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-600">{label}</p>
    </div>
  );
}
