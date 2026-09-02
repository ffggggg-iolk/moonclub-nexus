import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { NeonLoader } from "@/components/NeonLoader";
import { PageHeader } from "@/components/panel";
import { TicketList, type TicketRow } from "@/components/TicketTable";
import { useMe } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_panel/admin/cerrados")({
  head: () => ({
    meta: [
      { title: "Tickets Cerrados — Moon Club" },
      { name: "description", content: "Historial de tickets cerrados con motivo y responsable." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Tickets Cerrados — Moon Club" },
      { property: "og:description", content: "Historial de tickets cerrados en Moon Club." },
    ],
  }),
  component: Cerrados,
});

function Cerrados() {
  const { isStaff, loading } = useMe();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tickets", "closed"],
    enabled: isStaff,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("status", "closed")
        .order("closed_at", { ascending: false });
      if (error) throw error;
      return data as TicketRow[];
    },
  });

  if (loading || isLoading) return <NeonLoader label="Cargando" />;
  if (!isStaff)
    return <p className="text-sm text-muted-foreground">No tienes acceso a esta sección.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tickets Cerrados"
        subtitle="Historial completo. Puedes reabrir cualquier ticket desde su chat."
      />
      <TicketList tickets={data ?? []} empty="No hay tickets cerrados" />
    </div>
  );
}
