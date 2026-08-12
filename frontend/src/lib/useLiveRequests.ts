"use client";

// =====================================================================
//  useLiveRequests — রক্তের অনুরোধ লাইভ (real-time) ফিড
//  Supabase Realtime (postgres_changes) দিয়ে নতুন অনুরোধ সাথে সাথেই
//  ইউজারের স্ক্রিনে চলে আসে। Realtime বন্ধ থাকলে polling fallback কাজ করে।
// =====================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BloodRequest } from "@/lib/types";

export const LIVE_STATUSES = ["pending", "approved"] as const;

export type UseLiveRequestsOptions = {
  /** কত গুলো অনুরোধ দেখানো হবে */
  limit?: number;
  /** নির্দিষ্ট রক্তের গ্রুপ ফিল্টার */
  group?: string;
  /** নির্দিষ্ট উপজেলা ফিল্টার */
  upazila?: string;
  /** সম্পন্ন/বাতিল অনুরোধও দেখাবে কি না */
  includeClosed?: boolean;
  /** fallback polling interval (ms) — 0 দিলে বন্ধ */
  pollMs?: number;
};

export type LiveRequestsState = {
  requests: BloodRequest[];
  loading: boolean;
  error: string | null;
  /** সদ্য আসা অনুরোধের id — কার্ডে "নতুন" হাইলাইট দেখানোর জন্য */
  freshIds: Set<string>;
  /** realtime সংযোগ চালু আছে কি না */
  live: boolean;
  /** সর্বশেষ আপডেটের সময় */
  lastUpdated: number;
  refresh: () => Promise<void>;
};

const FRESH_MS = 25000; // ২৫ সেকেন্ড পর্যন্ত "নতুন" ব্যাজ

export function useLiveRequests(options: UseLiveRequestsOptions = {}): LiveRequestsState {
  const { limit = 60, group = "", upazila = "", includeClosed = false, pollMs = 45000 } = options;

  const supabase = useMemo(() => createClient(), []);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const [live, setLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => Date.now());

  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const optsRef = useRef({ limit, group, upazila, includeClosed });
  optsRef.current = { limit, group, upazila, includeClosed };

  // একটি অনুরোধ বর্তমান ফিল্টারে মানানসই কি না
  const matches = useCallback((r: BloodRequest) => {
    const o = optsRef.current;
    if ((r as any).deleted_at) return false; // ট্র্যাশে যাওয়া অনুরোধ দেখাবে না
    if (!o.includeClosed && !LIVE_STATUSES.includes(r.status as any)) return false;
    if (o.group && r.blood_group !== o.group) return false;
    if (o.upazila && r.upazila !== o.upazila) return false;
    return true;
  }, []);

  const markFresh = useCallback((id: string) => {
    setFreshIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    clearTimeout(timersRef.current[id]);
    timersRef.current[id] = setTimeout(() => {
      setFreshIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, FRESH_MS);
  }, []);

  const sortList = (list: BloodRequest[]) =>
    [...list].sort((a, b) => {
      const an = new Date(a.needed_date).getTime();
      const bn = new Date(b.needed_date).getTime();
      if (an !== bn) return an - bn;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const load = useCallback(async () => {
    const o = optsRef.current;
    try {
      let query = supabase
        .from("blood_requests")
        .select("*")
        .is("deleted_at", null)
        .order("needed_date", { ascending: true })
        .order("created_at", { ascending: false });
      if (!o.includeClosed) query = query.in("status", LIVE_STATUSES as unknown as string[]);
      if (o.group) query = query.eq("blood_group", o.group);
      if (o.upazila) query = query.eq("upazila", o.upazila);
      const { data, error: err } = await query.limit(o.limit);
      if (err) throw err;
      setRequests(sortList((data as BloodRequest[]) ?? []));
      setError(null);
      setLastUpdated(Date.now());
    } catch (e: any) {
      setError(e?.message ?? "error");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // প্রথম লোড + ফিল্টার বদলালে রিলোড
  useEffect(() => {
    setLoading(true);
    load();
  }, [load, group, upazila, includeClosed, limit]);

  // ---- Realtime subscription ----
  useEffect(() => {
    const channel = supabase
      .channel("live-blood-requests")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "blood_requests" }, (payload) => {
        const row = payload.new as BloodRequest;
        if (!matches(row)) return;
        setRequests((prev) => {
          if (prev.some((r) => r.id === row.id)) return prev;
          return sortList([row, ...prev]).slice(0, optsRef.current.limit);
        });
        markFresh(row.id);
        setLastUpdated(Date.now());
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "blood_requests" }, (payload) => {
        const row = payload.new as BloodRequest;
        setRequests((prev) => {
          const exists = prev.some((r) => r.id === row.id);
          if (!matches(row)) return exists ? prev.filter((r) => r.id !== row.id) : prev;
          if (!exists) return sortList([row, ...prev]).slice(0, optsRef.current.limit);
          return sortList(prev.map((r) => (r.id === row.id ? row : r)));
        });
        setLastUpdated(Date.now());
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "blood_requests" }, (payload) => {
        const old = payload.old as { id?: string };
        if (!old?.id) return;
        setRequests((prev) => prev.filter((r) => r.id !== old.id));
        setLastUpdated(Date.now());
      })
      .subscribe((status) => {
        setLive(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, matches, markFresh]);

  // ---- Fallback polling (realtime না থাকলেও ডেটা তাজা থাকে) ----
  useEffect(() => {
    if (!pollMs) return;
    const id = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      load();
    }, pollMs);
    return () => clearInterval(id);
  }, [load, pollMs]);

  // ট্যাবে ফিরলেই রিফ্রেশ
  useEffect(() => {
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [load]);

  // টাইমার ক্লিনআপ
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  return { requests, loading, error, freshIds, live, lastUpdated, refresh: load };
}
