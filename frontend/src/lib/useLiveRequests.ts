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

const RECENT_REQUEST_KEY = "shantichakra:recent-blood-request";
const RECENT_REQUEST_MAX_AGE_MS = 60 * 60 * 1000;

type StoredRequest = { request: BloodRequest; savedAt: number };

/**
 * Keep the request that was just submitted in this tab. This makes the
 * post-submit list reliable even when Supabase Realtime is still connecting
 * or PostgREST has a short replication/cache delay.
 */
export function rememberRecentlyPostedRequest(request: BloodRequest) {
  if (typeof window === "undefined") return;
  try {
    const value: StoredRequest = { request, savedAt: Date.now() };
    window.sessionStorage.setItem(RECENT_REQUEST_KEY, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private/restricted browsers. The database
    // insert has already succeeded, so there is nothing else to do here.
  }
}

function getRecentlyPostedRequest(): BloodRequest | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(RECENT_REQUEST_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as StoredRequest;
    if (!value?.request?.id || Date.now() - value.savedAt > RECENT_REQUEST_MAX_AGE_MS) {
      window.sessionStorage.removeItem(RECENT_REQUEST_KEY);
      return null;
    }
    return value.request;
  } catch {
    return null;
  }
}

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
  /** পেজ খোলার পরে কতগুলো নতুন অনুরোধ realtime-এ এসেছে (ইউজারকে জানানোর জন্য) */
  newCount: number;
  /** নতুন-অনুরোধ কাউন্টার রিসেট (ইউজার দেখার পর) */
  resetNew: () => void;
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
  const [newCount, setNewCount] = useState(0);
  const loadedOnceRef = useRef(false);

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
    const recent = getRecentlyPostedRequest();
    const recentMatches = recent && matches(recent) ? recent : null;

    try {
      const runQuery = (filterDeleted: boolean) => {
        let query = supabase
          .from("blood_requests")
          .select("*")
          .order("needed_date", { ascending: true })
          .order("created_at", { ascending: false });
        if (filterDeleted) query = query.is("deleted_at", null);
        if (!o.includeClosed) query = query.in("status", LIVE_STATUSES as unknown as string[]);
        if (o.group) query = query.eq("blood_group", o.group);
        if (o.upazila) query = query.eq("upazila", o.upazila);
        return query.limit(o.limit);
      };

      let result = await runQuery(true);
      // Older deployments may not yet have the soft-delete column. Do not let
      // that schema drift make the entire public request list appear empty.
      if (result.error && /deleted_at/i.test(result.error.message ?? "")) {
        result = await runQuery(false);
      }
      if (result.error) throw result.error;

      const rows = (result.data as BloodRequest[]) ?? [];
      const merged = recentMatches && !rows.some((r) => r.id === recentMatches.id)
        ? [recentMatches, ...rows]
        : rows;
      setRequests(sortList(merged).slice(0, o.limit));
      setError(null);
      setLastUpdated(Date.now());
      // প্রথম লোড শেষে কাউন্টার শূন্য — তারপর realtime-এ যা আসবে তাই গোনা হবে
      if (!loadedOnceRef.current) {
        loadedOnceRef.current = true;
        setNewCount(0);
      }
    } catch (e: any) {
      // The request submitted in this tab is still safe to show while the
      // network/database list is temporarily unavailable.
      if (recentMatches) setRequests([recentMatches]);
      setError(recentMatches ? null : (e?.message ?? "error"));
    } finally {
      setLoading(false);
    }
  }, [supabase, matches]);

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
        setNewCount((c) => c + 1);
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

  return { requests, loading, error, freshIds, live, lastUpdated, newCount, resetNew: () => setNewCount(0), refresh: load };
}
