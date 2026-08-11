import { AlertTriangle, Check } from "@/components/icons";
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-canvas px-4 py-12">
      {/* artistic background */}
      <div className="pointer-events-none absolute inset-0 bg-mesh-light" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blood-300/40 blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-blood-700 text-white shadow-glow">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
              <path d="M12 2s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
            </svg>
          </span>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">{title}</h1>
          <p className="mt-1 text-sm text-ink/60">{subtitle}</p>
        </div>
        <div className="glass rounded-3xl p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}

export function AuthError({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl bg-blood-50 p-3 text-sm font-medium text-blood-700"><AlertTriangle className="h-4 w-4 shrink-0" />{text}</div>
  );
}

export function AuthSuccess({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl bg-success-50 p-3 text-sm font-medium text-success-700"><Check className="h-4 w-4 shrink-0" />{text}</div>
  );
}
