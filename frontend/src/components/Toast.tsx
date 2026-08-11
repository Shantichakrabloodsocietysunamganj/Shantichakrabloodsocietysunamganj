"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AlertTriangle, Check } from "@/components/icons";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; type: ToastType; msg: string };

const ToastCtx = createContext<(type: ToastType, msg: string) => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((type: ToastType, msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const icons: Record<ToastType, ReactNode> = { success: <Check className="h-4 w-4" />, error: <AlertTriangle className="h-4 w-4" />, info: <AlertTriangle className="h-4 w-4" /> };
  const colors: Record<ToastType, string> = {
    success: "bg-success-500",
    error: "bg-blood-600",
    info: "bg-brand-600",
  };

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-fade-up flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-glow ${colors[t.type]}`}
          >
            <span>{icons[t.type]}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
