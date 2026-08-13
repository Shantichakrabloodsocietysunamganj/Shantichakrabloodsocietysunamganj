"use client";

// =====================================================================
//  useLiveRequests — রক্তের অনুরোধ লাইভ (real-time) ফিড
//  Supabase Realtime (postgres_changes) দিয়ে নতুন অনুরোধ সাথে সাথেই
//  ইউজারের স্ক্রিনে চলে আসে। Realtime বন্ধ থাকলে polling fallback কাজ করে।
//
//  Privacy (Phase 1+2): base-table realtime events are disabled — they
//  would expose sensitive columns. Safe-view polling keeps the public feed
//  fresh using only `public_blood_requests` columns. sessionStorage stores
//  only the sanitized public projection.
// =====================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BloodRequest, PublicBloodRequest } from "@/lib/types";
import { toPublicRequest } from "@/lib/sanitize";

export const LIVE_STATUSES = ["pending", "approved"] as const;

const RECENT_REQUEST_KEY = "shantichakra:recent-blood-request";
const RECENT_REQUEST_MAX_AGE_MS = 60 * 60 * 1000;

type StoredRequest = { request: PublicBloodRequest; savedAt: number };

/**
 * Keep the just-submitted request in this tab as its PUBLIC projection.
 * Sensitive fields (contact_phone, hemoglobin, disease, age, gender) are
 * stripped before anything reaches sessionStorage.
 */
export function rememberRecentlyPostedRequest(request: BloodRequest) {
  if (typeof window === "undefined") return;
  try {
    const value: StoredRequest = { request: toPublicRequest(request), savedAt: Date.now() };
    window.sessionStorage.setItem(RECENT_REQUEST_KEY, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private/restricted browsers. The database
    // insert has already succeeded, so there is nothing else to do here.
  }
}

function getRecentlyPostedRequest(): PublicBloodRequest | null {
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
  requests: PublicBloodRequest[];
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
  const [requests, setRequests] = useState<PublicBloodRequest[]>([]);
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
  const matches = useCallback((r: PublicBloodRequest) => {
    const o = optsRef.current;
    if (!o.includeClosed && !(LIVE_STATUSES as readonly string[]).includes(r.status)) return false;
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

  const sortList = (list: PublicBloodRequest[]) =>
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
      let query = supabase
        .from("public_blood_requests")
        .select("id, patient_name, blood_group, units_needed, hospital, district, upazila, needed_date, contact_name, message, blood_component, request_type, status, created_at")
        .order("needed_date", { ascending: true })
        .order("created_at", { ascending: false });
      if (!o.includeClosed) query = query.in("status", LIVE_STATUSES as unknown as string[]);
      if (o.group) query = query.eq("blood_group", o.group);
      if (o.upazila) query = query.eq("upazila", o.upazila);
      const result = await query.limit(o.limit);
      if (result.error) throw result.error;

      const rows = (result.data as PublicBloodRequest[]) ?? [];
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
    } catch (e) {
      // The request submitted in this tab is still safe to show while the
      // network/database list is temporarily unavailable.
      if (recentMatches) setRequests([recentMatches]);
      setError(recentMatches ? null : (e instanceof Error ? e.message : "error"));
    } finally {
      setLoading(false);
    }
  }, [supabase, matches]);

  // প্রথম লোড + ফিল্টার বদলালে রিলোড
  useEffect(() => {
    setLoading(true);
    load();
  }, [load, group, upazila, includeClosed, limit]);

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
