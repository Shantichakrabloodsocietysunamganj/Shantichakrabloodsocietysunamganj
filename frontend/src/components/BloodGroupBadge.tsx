import { BLOOD_GROUP_COLORS } from "@/data/constants";

export default function BloodGroupBadge({
  group,
  size = "md",
}: {
  group: string;
  size?: "sm" | "md" | "lg";
}) {
  const color = BLOOD_GROUP_COLORS[group] ?? "bg-zinc-100 text-ink ring-zinc-200";
  const sizing =
    size === "lg"
      ? "h-14 w-14 text-xl"
      : size === "sm"
        ? "h-8 min-w-8 px-1 text-xs"
        : "h-11 w-11 text-base";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-2xl font-bold ring-1 ${color} ${sizing}`}
    >
      {group}
    </span>
  );
}
