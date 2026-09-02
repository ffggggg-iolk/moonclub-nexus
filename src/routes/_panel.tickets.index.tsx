import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { EmptyState, PageHeader, StatusPill, formatDate } from "@/components/panel";
import { NeonLoader } from "@/components/NeonLoader";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_panel/tickets/")({
  head: () => ({
    meta: [
      { title: "Mis Tickets — Moon Club" },
      { name: "description", content: "Historial de tus tickets de soporte en Moon Club." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Mis Tickets — Moon Club" },
      { property: "og:description", content: "Sigue el estado de tus tickets en Moon Club." },
    ],
  }),
  component: MisTickets,
});

function MisTickets() {
  const { session } = useMe();
  const userId = session?.user.id;

  const { data, isLoading } = useQuery({
    queryKey: ["my-tickets", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Tickets"
        subtitle="Todos tus tickets, abiertos y cerrados."
        action={
          <Button asChild variant="neonPink">
            <Link to="/tickets/nuevo">
              <Plus className="size-4" /> Crear Ticket
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <NeonLoader label="Cargando" />
      ) : !data?.length ? (
        <EmptyState title="Aún no tienes tickets" hint="Crea uno y el equipo te atenderá." />
      ) : (
        <div className="grid gap-3">
          {data.map((t) => (
            <Link
              key={t.id}
              to="/tickets/$id"
              params={{ id: t.id }}
              className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 transition-colors hover:border-neon-blue/60"
            >
              <div className="min-w-0">
                <p className="font-display text-sm tracking-wide text-neon-blue">
                  {t.ticket_number}
                </p>
                <p className="truncate text-sm font-medium">{t.reason}</p>
                <p className="text-xs text-muted-foreground">
                  {t.category} · {formatDate(t.created_at)}
                </p>
              </div>
              <StatusPill status={t.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
