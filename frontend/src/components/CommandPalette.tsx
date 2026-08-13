"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BLOOD_GROUPS } from "@/data/constants";
import { searchServices, serviceDesc, serviceTitle, type ServiceItem } from "@/data/services";
import { OPEN_PALETTE_EVENT } from "@/lib/commandPalette";
import { useTr } from "@/lib/useLang";

export { openCommandPalette, OPEN_PALETTE_EVENT } from "@/lib/commandPalette";

type Row =
  | { kind: "service"; item: ServiceItem }
  | { kind: "group"; group: string; href: string };

export default function CommandPalette() {
  const { t: tx, lang, en } = useTr();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setActive(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const rows: Row[] = useMemo(() => {
    const services = (q.trim() ? searchServices(q) : searchServices("")).slice(0, 10).map((item) => ({
      kind: "service" as const,
      item,
    }));
    const needle = q.trim().toUpperCase();
    const groups = BLOOD_GROUPS.filter((g) => !needle || g.includes(needle) || needle.includes(g.replace("+", "").replace("-", "")))
      .slice(0, 4)
      .map((group) => ({ kind: "group" as const, group, href: `/donors?group=${encodeURIComponent(group)}` }));
    return [...services, ...groups];
  }, [q]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  const go = (row: Row) => {
    const href = row.kind === "service" ? row.item.href : row.href;
    close();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(rows.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && rows[active]) {
      e.preventDefault();
      go(rows[active]);
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label={tx("কমান্ড প্যালেট")}>
      <button type="button" className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" aria-label={tx("প্যালেট বন্ধ করুন")} onClick={close} />
      <div className="relative w-full max-w-xl origin-top animate-panel-in overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-zinc-100 px-4">
          <span className="text-ink/40">⌘</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={tx("সেবা বা পেজ খুঁজুন")}
            className="h-14 w-full bg-transparent text-base text-ink outline-none placeholder:text-ink/35"
          />
          <kbd className="hidden rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink/50 sm:inline">Esc</kbd>
        </div>
        <div ref={listRef} className="max-h-[22rem] overflow-y-auto p-2">
          {rows.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-ink/50">{tx("কোনো ফলাফল নেই")}</p>
          ) : (
            <ul>
              {rows.map((row, i) => (
                <li key={row.kind === "service" ? row.item.id : row.group}>
                  <button
                    type="button"
                    data-idx={i}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(row)}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left ${
                      i === active ? "bg-brand-50 text-brand-800" : "text-ink"
                    }`}
                  >
                    <span className="mt-0.5 text-lg">{row.kind === "service" ? row.item.icon : "🩸"}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {row.kind === "service"
                          ? serviceTitle(row.item, lang)
                          : en
                            ? `${row.group} donors`
                            : `${row.group} দাতা`}
                      </span>
                      <span className="block truncate text-xs text-ink/50">
                        {row.kind === "service"
                          ? serviceDesc(row.item, lang)
                          : en
                            ? `Jump to ${row.group} donors`
                            : `${row.group} গ্রুপের দাতা দেখুন`}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="border-t border-zinc-100 px-4 py-2 text-[11px] text-ink/40">
          {tx("নেভিগেট করতে ↑↓, খুলতে Enter, বন্ধ করতে Esc")}
        </p>
      </div>
    </div>
  );
}
