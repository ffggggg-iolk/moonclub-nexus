import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-black uppercase tracking-tight sm:text-3xl">
          {title}
        </h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function StatusPill({ status }: { status: string }) {
  const open = status === "open";
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 font-display text-[10px] uppercase tracking-[0.2em]",
        open
          ? "border-neon-blue/50 text-neon-blue"
          : "border-neon-pink/50 text-neon-pink",
      )}
    >
      {open ? "Abierto" : "Cerrado"}
    </span>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="glass rounded-3xl p-10 text-center">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </p>
      {hint ? <p className="mt-2 text-sm text-muted-foreground/80">{hint}</p> : null}
    </div>
  );
}

export function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
