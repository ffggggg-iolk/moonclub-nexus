import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Link2, Plus, Ticket } from "lucide-react";

import { DiscordIcon, RobloxIcon } from "@/components/ProviderIcons";
import { Button } from "@/components/ui/button";
import { displayName, useMe } from "@/hooks/useAuth";

export const Route = createFileRoute("/_panel/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Moon Club" },
      { name: "description", content: "Tu panel personal en Moon Club: cuenta, tickets y avisos." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Dashboard — Moon Club" },
      { property: "og:description", content: "Tu panel personal en Moon Club." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { session, profile, role } = useMe();
  const roleLabel = role === "owner" ? "OWNER / CREADOR" : role === "admin" ? "ADMIN" : "USER";
  const platform = profile?.discord_id ? "Discord" : profile?.roblox_id ? "Roblox" : "Correo";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black uppercase tracking-tight sm:text-3xl">
            Hola, <span className="neon-text">{displayName(profile)}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Bienvenido de nuevo al club.</p>
        </div>
        <Button asChild variant="neonPink">
          <Link to="/tickets/nuevo">
            <Plus className="size-4" /> Crear Ticket
          </Link>
        </Button>
      </header>

      <section className="glass rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {profile?.discord_avatar ? (
            <img
              src={profile.discord_avatar}
              alt={`Avatar de ${displayName(profile)}`}
              className="size-20 rounded-2xl border border-neon-pink/50 object-cover glow-pink"
            />
          ) : (
            <div className="grid size-20 place-items-center rounded-2xl bg-surface-2 font-display text-xl glow-blue">
              {displayName(profile).slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="grid flex-1 gap-3 text-sm sm:grid-cols-2">
            <Field label="Nombre" value={displayName(profile)} />
            <Field label="Rol" value={roleLabel} accent />
            <Field label="ID interno" value={session?.user.id.slice(0, 8) ?? "—"} />
            <Field label="Plataforma" value={platform} />
            <Field label="Estado" value={profile?.status === "active" ? "Activa" : "Suspendida"} />
            <Field
              label="Registro"
              value={
                profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString("es-ES")
                  : "—"
              }
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <ConnectionCard
          icon={<DiscordIcon className="size-5" />}
          name="Discord"
          value={profile?.discord_username}
          href="/api/public/auth/discord/start"
        />
        <ConnectionCard
          icon={<RobloxIcon className="size-5" />}
          name="Roblox"
          value={profile?.roblox_username}
          href="/api/public/auth/roblox/start"
        />
      </section>

      <section className="glass flex flex-col items-start gap-3 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Ticket className="size-5 text-neon-yellow" />
          <p className="text-sm text-muted-foreground">
            ¿Necesitas ayuda? Abre un ticket y el equipo te responderá en un chat privado.
          </p>
        </div>
        <Button asChild variant="ghostNeon">
          <Link to="/tickets">Ver mis tickets</Link>
        </Button>
      </section>
    </div>
  );
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className={accent ? "font-semibold text-neon-yellow" : "font-medium"}>{value}</p>
    </div>
  );
}

function ConnectionCard({
  icon,
  name,
  value,
  href,
}: {
  icon: React.ReactNode;
  name: string;
  value: string | null | undefined;
  href: string;
}) {
  return (
    <article className="glass flex items-center justify-between gap-3 rounded-2xl p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-neon-blue">{icon}</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{value ?? "Sin vincular"}</p>
        </div>
      </div>
      {value ? (
        <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-neon-blue">
          <CheckCircle2 className="size-4" /> Conectado
        </span>
      ) : (
        <Button asChild size="sm" variant="ghostNeon" className="shrink-0">
          <a href={href}>
            <Link2 className="size-4" /> Vincular
          </a>
        </Button>
      )}
    </article>
  );
}
