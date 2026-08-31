import { cn } from "@/lib/utils";

export function NeonLoader({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-16", className)}>
      <div className="relative h-14 w-14">
        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-blue border-r-neon-pink animate-spin" />
        <span
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-neon-yellow border-l-neon-pink animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.4s" }}
        />
        <span className="absolute inset-[38%] rounded-full bg-neon-blue glow-blue animate-pulse-glow" />
      </div>
      {label ? (
        <p className="font-display text-xs uppercase tracking-[0.35em] text-muted-foreground">
          {label}
        </p>
      ) : null}
    </div>
  );
}

export function FullPageLoader({ label = "Cargando" }: { label?: string }) {
  return (
    <div className="club-bg flex min-h-screen items-center justify-center bg-background">
      <NeonLoader label={label} />
    </div>
  );
}
