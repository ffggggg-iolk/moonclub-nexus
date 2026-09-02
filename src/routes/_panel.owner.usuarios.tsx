import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { NeonLoader } from "@/components/NeonLoader";
import { EmptyState, PageHeader, formatDate } from "@/components/panel";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/useAuth";
import { listAllUsers, setUserStatus } from "@/lib/admin.functions";

export const Route = createFileRoute("/_panel/owner/usuarios")({
  head: () => ({
    meta: [
      { title: "Usuarios — Moon Club" },
      { name: "description", content: "Listado de usuarios registrados y estado de sus cuentas." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Usuarios — Moon Club" },
      { property: "og:description", content: "Administración de usuarios de Moon Club." },
    ],
  }),
  component: Usuarios,
});

function Usuarios() {
  const { isOwner, loading } = useMe();
  const fetchUsers = useServerFn(listAllUsers);
  const changeStatus = useServerFn(setUserStatus);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["owner-users"],
    enabled: isOwner,
    queryFn: () => fetchUsers(),
  });

  const mutation = useMutation({
    mutationFn: (vars: { userId: string; status: "active" | "suspended" }) =>
      changeStatus({ data: vars }),
    onSuccess: () => {
      toast.success("Estado actualizado");
      queryClient.invalidateQueries({ queryKey: ["owner-users"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Error"),
  });

  if (loading || isLoading) return <NeonLoader label="Cargando" />;
  if (!isOwner)
    return <p className="text-sm text-muted-foreground">Solo el propietario puede ver esto.</p>;

  return (
    <div className="space-y-6">
      <PageHeader title="Usuarios" subtitle="Todas las cuentas registradas en el club." />
      {data?.length ? (
        <div className="grid gap-3">
          {data.map((u) => (
            <article
              key={u.id}
              className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                {u.discord_avatar ? (
                  <img src={u.discord_avatar} alt="" className="size-9 rounded-full border border-border" />
                ) : (
                  <div className="grid size-9 place-items-center rounded-full bg-surface-2 text-xs">
                    {(u.discord_username ?? u.roblox_username ?? "MC").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {u.discord_username ?? u.roblox_username ?? u.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {u.role.toUpperCase()} · {formatDate(u.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    u.status === "active"
                      ? "text-xs font-semibold text-neon-blue"
                      : "text-xs font-semibold text-neon-pink"
                  }
                >
                  {u.status === "active" ? "Activa" : "Suspendida"}
                </span>
                <Button
                  size="sm"
                  variant={u.status === "active" ? "ghostPink" : "ghostNeon"}
                  disabled={mutation.isPending || u.role === "owner"}
                  onClick={() =>
                    mutation.mutate({
                      userId: u.id,
                      status: u.status === "active" ? "suspended" : "active",
                    })
                  }
                >
                  {u.status === "active" ? "Suspender" : "Reactivar"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Sin usuarios" />
      )}
    </div>
  );
}
