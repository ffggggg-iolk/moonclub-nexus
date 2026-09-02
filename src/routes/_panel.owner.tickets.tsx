import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { NeonLoader } from "@/components/NeonLoader";
import { PageHeader } from "@/components/panel";
import { TicketList, type TicketRow } from "@/components/TicketTable";
import { useMe } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_panel/owner/tickets")({
  head: () => ({
    meta: [
      { title: "Todos los Tickets — Moon Club" },
      { name: "description", content: "Vista global de todos los tickets del club." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Todos los Tickets — Moon Club" },
      { property: "og:description", content: "Supervisión total de tickets en Moon Club." },
    ],
  }),
  component: OwnerTickets,
});

const FILTERS = [
  { key: "all", label: "Todos" },
  { key: "open", label: "Abiertos" },
  { key: "closed", label: "Cerrados" },
] as const;

function OwnerTickets() {
  const { isOwner, loading } = useMe();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["owner-tickets"],
    enabled: isOwner,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as TicketRow[];
    },
  });

  if (loading || isLoading) return <NeonLoader label="Cargando" />;
  if (!isOwner)
    return <p className="text-sm text-muted-foreground">Solo el propietario puede ver esto.</p>;

  const tickets = (data ?? []).filter((t) => filter === "all" || t.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader title="Todos los Tickets" subtitle="Supervisión global del soporte." />
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={
              filter === f.key
                ? "rounded-full border border-neon-blue bg-surface-2 px-4 py-1.5 text-xs font-semibold text-neon-blue"
                : "rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground hover:border-neon-blue/60"
            }
          >
            {f.label}
          </button>
        ))}
      </div>
      <TicketList tickets={tickets} empty="No hay tickets" />
    </div>
  );
}
