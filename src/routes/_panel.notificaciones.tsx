import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BellRing } from "lucide-react";

import { NeonLoader } from "@/components/NeonLoader";
import { EmptyState, PageHeader, formatDate } from "@/components/panel";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_panel/notificaciones")({
  head: () => ({
    meta: [
      { title: "Notificaciones — Moon Club" },
      { name: "description", content: "Avisos y novedades de tus tickets en Moon Club." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Notificaciones — Moon Club" },
      { property: "og:description", content: "Tus avisos dentro de Moon Club." },
    ],
  }),
  component: Notificaciones,
});

function Notificaciones() {
  const { session } = useMe();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markAll = async () => {
    await supabase.from("notifications").update({ read: true }).eq("user_id", userId!).eq("read", false);
    queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificaciones"
        subtitle="Avisos sobre tus tickets y tu cuenta."
        action={
          data?.some((n) => !n.read) ? (
            <Button variant="ghostNeon" onClick={markAll}>
              Marcar todo como leído
            </Button>
          ) : null
        }
      />

      {isLoading ? (
        <NeonLoader label="Cargando" />
      ) : !data?.length ? (
        <EmptyState title="Sin notificaciones" hint="Aquí verás los avisos del equipo." />
      ) : (
        <div className="grid gap-3">
          {data.map((n) => (
            <article
              key={n.id}
              className={
                n.read
                  ? "glass flex gap-3 rounded-2xl p-4 opacity-70"
                  : "glass flex gap-3 rounded-2xl border-neon-blue/50 p-4"
              }
            >
              <BellRing className="mt-0.5 size-4 shrink-0 text-neon-yellow" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{n.title}</p>
                {n.body ? <p className="text-sm text-muted-foreground">{n.body}</p> : null}
                <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(n.created_at)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
