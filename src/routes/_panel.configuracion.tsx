import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

import { PageHeader } from "@/components/panel";
import { DiscordIcon, RobloxIcon } from "@/components/ProviderIcons";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_panel/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración — Moon Club" },
      { name: "description", content: "Ajustes de cuenta, vinculaciones y sesión en Moon Club." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Configuración — Moon Club" },
      { property: "og:description", content: "Administra tu cuenta de Moon Club." },
    ],
  }),
  component: Configuracion,
});

function Configuracion() {
  const { session, profile } = useMe();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Configuración" subtitle="Cuenta, vinculaciones y sesión." />

      <section className="glass space-y-4 rounded-3xl p-5">
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Cuenta
        </h2>
        <p className="text-sm">
          Correo: <span className="font-medium">{session?.user.email ?? "—"}</span>
        </p>
        <p className="text-sm">
          Estado:{" "}
          <span className={profile?.status === "active" ? "text-neon-blue" : "text-neon-pink"}>
            {profile?.status === "active" ? "Activa" : "Suspendida"}
          </span>
        </p>
      </section>

      <section className="glass space-y-3 rounded-3xl p-5">
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Vinculaciones
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button asChild variant="ghostNeon" className="justify-start">
            <a href="/api/public/auth/discord/start">
              <DiscordIcon className="size-4" />
              {profile?.discord_username ? "Actualizar Discord" : "Vincular Discord"}
            </a>
          </Button>
          <Button asChild variant="ghostNeon" className="justify-start">
            <a href="/api/public/auth/roblox/start">
              <RobloxIcon className="size-4" />
              {profile?.roblox_username ? "Actualizar Roblox" : "Vincular Roblox"}
            </a>
          </Button>
        </div>
      </section>

      <section className="glass space-y-3 rounded-3xl p-5">
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Sesión
        </h2>
        <Button variant="ghostPink" onClick={signOut}>
          <LogOut className="size-4" /> Cerrar sesión
        </Button>
      </section>
    </div>
  );
}
