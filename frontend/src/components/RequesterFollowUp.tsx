"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Droplets, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  forgetOwnedBloodRequest,
  getOwnedBloodRequests,
  postponeOwnedBloodRequest,
  type OwnedBloodRequest,
} from "@/lib/requestOwnership";
import { useLangClient } from "@/lib/i18n";
import { useToast } from "@/components/Toast";

/** Only appears in the browser that originally posted the request. */
export default function RequesterFollowUp() {
  const supabase = useMemo(() => createClient(), []);
  const lang = useLangClient();
  const en = lang === "en";
  const toast = useToast();
  const [request, setRequest] = useState<OwnedBloodRequest | null>(null);
  const [busy, setBusy] = useState(false);

  const check = useCallback(async () => {
    if (request || document.hidden) return;
    const due = getOwnedBloodRequests().filter((item) => new Date(item.nextPromptAt).getTime() <= Date.now());
    if (!due.length) return;

    const { data, error } = await supabase
      .from("blood_requests")
      .select("id,status")
      .in("id", due.map((item) => item.id));
    if (error) return;

    const statuses = new Map((data ?? []).map((row: any) => [row.id, row.status]));
    for (const item of due) {
      const status = statuses.get(item.id);
      if (!status || status === "completed" || status === "cancelled") {
        forgetOwnedBloodRequest(item.id);
        continue;
      }
      if (status === "pending" || status === "approved") {
        setRequest(item);
        break;
      }
    }
  }, [request, supabase]);

  useEffect(() => {
    check();
    const timer = window.setInterval(check, 60_000);
    const onVisible = () => { if (!document.hidden) check(); };
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [check]);

  const respond = async (received: boolean) => {
    if (!request) return;
    setBusy(true);
    const { error } = await supabase.rpc("respond_to_blood_request", {
      p_request_id: request.id,
      p_token: request.token,
      p_received: received,
    });
    setBusy(false);

    if (error) {
      toast("error", en ? "Could not update the request. Please try again." : "অনুরোধ আপডেট করা যায়নি। আবার চেষ্টা করুন।");
      return;
    }

    if (received) {
      forgetOwnedBloodRequest(request.id);
      toast("success", en ? "Thank you. The request is now marked fulfilled." : "ধন্যবাদ। অনুরোধটি ‘রক্ত পাওয়া গেছে’ হিসেবে সম্পন্ন হয়েছে।");
    } else {
      postponeOwnedBloodRequest(request.id, 24);
      toast("info", en ? "The request will stay live. We will ask again tomorrow." : "অনুরোধটি লাইভ থাকবে। আগামীকাল আবার জানতে চাইব।");
    }
    setRequest(null);
  };

  if (!request) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-zinc-950/45 p-4 backdrop-blur-[2px] sm:items-center" role="presentation">
      <div className="animate-fade-up w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl dark:bg-slate-800" role="dialog" aria-modal="true" aria-labelledby="request-follow-up-title">
        <div className="relative bg-gradient-to-br from-blood-600 to-brand-700 px-6 pb-7 pt-6 text-white">
          <button
            type="button"
            onClick={() => {
              postponeOwnedBloodRequest(request.id, 6);
              setRequest(null);
            }}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label={en ? "Remind me later" : "পরে মনে করিয়ে দিন"}
          >
            <X className="h-5 w-5" />
          </button>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <Droplets className="h-7 w-7" />
          </span>
          <h2 id="request-follow-up-title" className="mt-4 font-display text-2xl font-extrabold">
            {en ? "Did you receive blood?" : "আপনি কি রক্ত পেয়েছেন?"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            {en
              ? `${request.patientName}'s ${request.bloodGroup} blood request was posted from this device.`
              : `এই ফোন থেকে ${request.patientName}-এর জন্য ${request.bloodGroup} রক্তের অনুরোধ করা হয়েছিল।`}
          </p>
        </div>

        <div className="space-y-3 p-5 sm:p-6">
          <button type="button" disabled={busy} onClick={() => respond(true)} className="btn-primary w-full !justify-start !bg-success-600 !py-3.5">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-left">
              <span className="block font-bold">{en ? "Yes, we received blood" : "হ্যাঁ, রক্ত পেয়েছি"}</span>
              <span className="block text-xs font-normal text-white/75">{en ? "Mark this request as fulfilled" : "অনুরোধটি সম্পন্ন হিসেবে দেখাবে"}</span>
            </span>
          </button>
          <button type="button" disabled={busy} onClick={() => respond(false)} className="btn-outline w-full !justify-start !py-3.5">
            <Clock3 className="h-5 w-5 text-blood-600" />
            <span className="text-left">
              <span className="block font-bold">{en ? "No, still looking" : "না, এখনো পাইনি"}</span>
              <span className="block text-xs font-normal text-ink/50">{en ? "Keep the request live and ask tomorrow" : "অনুরোধ লাইভ থাকবে, আগামীকাল আবার জানাবে"}</span>
            </span>
          </button>
          <p className="px-2 pt-1 text-center text-[11px] leading-relaxed text-ink/40">
            {en ? "This notice is visible only on the browser used to post the request." : "এই নোটিশটি শুধু যে ব্রাউজার থেকে অনুরোধ করা হয়েছিল সেখানেই দেখা যায়।"}
          </p>
        </div>
      </div>
    </div>
  );
}
