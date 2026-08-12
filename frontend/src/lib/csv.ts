import { tr, type Lang } from "@/lib/i18n";

function currentLang(): Lang {
  if (typeof document === "undefined") return "bn";
  return /(?:^|;\s*)lang=en\b/.test(document.cookie) ? "en" : "bn";
}

// CSV এক্সপোর্ট হেল্পার — রিপোর্টের জন্য
export function exportCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows.length) {
    alert(tr("এক্সপোর্ট করার মতো তথ্য নেই", currentLang()));
    return;
  }
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
