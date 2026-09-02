import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Link2 } from "lucide-react";

import { PageHeader, formatDate } from "@/components/panel";
import { DiscordIcon, RobloxIcon } from "@/components/ProviderIcons";
import { Button } from "@/components/ui/button";
import { displayName, useMe } from "@/hooks/useAuth";

export const Route = createFileRoute("/_panel/perfil")({
  head: () => ({
    meta: [
      { title: "Mi Perfil — Moon Club" },
      { name: "description", content: "Consulta y vincula tus cuentas de Discord y Roblox." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Mi Perfil — Moon Club" },
      { property: "og:description", content: "Gestiona tu identidad dentro de Moon Club." },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { session, profile, role } = useMe();

  return (
    <div className="space-y-6">
      <PageHeader title="Mi Perfil" subtitle="Tus datos de cuenta dentro del club." />

      <section className="glass rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {profile?.discord_avatar ? (
            <img
              src={profile.discord_avatar}
              alt={`Avatar de ${displayName(profile)}`}
              className="size-24 rounded-2xl border border-neon-blue/50 object-cover glow-blue"
            />
          ) : (
            <div className="grid size-24 place-items-center rounded-2xl bg-surface-2 font-display text-2xl glow-blue">
              {displayName(profile).slice(0, 2).toUpperCase()}
            </div>
          )}
          <dl className="grid flex-1 gap-3 text-sm sm:grid-cols-2">
            <Row label="Nombre" value={displayName(profile)} />
            <Row label="Rol" value={role.toUpperCase()} />
            <Row label="Correo" value={session?.user.email ?? "—"} />
            <Row label="ID de usuario" value={session?.user.id ?? "—"} mono />
            <Row label="Discord ID" value={profile?.discord_id ?? "—"} mono />
            <Row label="Roblox ID" value={profile?.roblox_id ?? "—"} mono />
            <Row label="Estado" value={profile?.status === "active" ? "Activa" : "Suspendida"} />
            <Row label="Registro" value={formatDate(profile?.created_at)} />
          </dl>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Connection
          icon={<DiscordIcon className="size-5" />}
          name="Discord"
          value={profile?.discord_username}
          href="/api/public/auth/discord/start"
        />
        <Connection
          icon={<RobloxIcon className="size-5" />}
          name="Roblox"
          value={profile?.roblox_username}
          href="/api/public/auth/roblox/start"
        />
      </section>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </dt>
      <dd className={mono ? "truncate font-mono text-xs" : "truncate font-medium"}>{value}</dd>
    </div>
  );
}

function Connection({
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
