import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Crown, Shield } from "lucide-react";
import { toast } from "sonner";

import { NeonLoader } from "@/components/NeonLoader";
import { EmptyState, PageHeader } from "@/components/panel";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/useAuth";
import { listAllUsers, setUserRole } from "@/lib/admin.functions";

export const Route = createFileRoute("/_panel/owner/administradores")({
  head: () => ({
    meta: [
      { title: "Administradores — Moon Club" },
      { name: "description", content: "Otorga o revoca permisos de administrador en Moon Club." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Administradores — Moon Club" },
      { property: "og:description", content: "Gestión del equipo de Moon Club." },
    ],
  }),
  component: Administradores,
});

function Administradores() {
  const { isOwner, loading } = useMe();
  const fetchUsers = useServerFn(listAllUsers);
  const changeRole = useServerFn(setUserRole);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["owner-users"],
    enabled: isOwner,
    queryFn: () => fetchUsers(),
  });

  const mutation = useMutation({
    mutationFn: (vars: { userId: string; role: "user" | "admin" }) => changeRole({ data: vars }),
    onSuccess: () => {
      toast.success("Rol actualizado");
      queryClient.invalidateQueries({ queryKey: ["owner-users"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Error"),
  });

  if (loading || isLoading) return <NeonLoader label="Cargando" />;
  if (!isOwner)
    return <p className="text-sm text-muted-foreground">Solo el propietario puede ver esto.</p>;

  const staff = (data ?? []).filter((u) => u.role !== "user");
  const others = (data ?? []).filter((u) => u.role === "user");

  return (
    <div className="space-y-6">
      <PageHeader title="Administradores" subtitle="Controla quién forma parte del staff." />

      <section className="space-y-3">
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Staff actual
        </h2>
        {staff.length ? (
          staff.map((u) => (
            <article key={u.id} className="glass flex items-center justify-between gap-3 rounded-2xl p-4">
              <div className="flex min-w-0 items-center gap-3">
                {u.role === "owner" ? (
                  <Crown className="size-4 text-neon-yellow" />
                ) : (
                  <Shield className="size-4 text-neon-pink" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {u.discord_username ?? u.roblox_username ?? u.id.slice(0, 8)}
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {u.role}
                  </p>
                </div>
              </div>
              {u.role === "admin" ? (
                <Button
                  size="sm"
                  variant="ghostPink"
                  disabled={mutation.isPending}
                  onClick={() => mutation.mutate({ userId: u.id, role: "user" })}
                >
                  Revocar
                </Button>
              ) : null}
            </article>
          ))
        ) : (
          <EmptyState title="Sin staff todavía" />
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Usuarios
        </h2>
        {others.length ? (
          others.map((u) => (
            <article key={u.id} className="glass flex items-center justify-between gap-3 rounded-2xl p-4">
              <p className="truncate text-sm">
                {u.discord_username ?? u.roblox_username ?? u.id.slice(0, 8)}
              </p>
              <Button
                size="sm"
                variant="ghostNeon"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate({ userId: u.id, role: "admin" })}
              >
                Hacer admin
              </Button>
            </article>
          ))
        ) : (
          <EmptyState title="No hay más usuarios" />
        )}
      </section>
    </div>
  );
}
