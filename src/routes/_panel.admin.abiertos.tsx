import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { NeonLoader } from "@/components/NeonLoader";
import { PageHeader } from "@/components/panel";
import { TicketList, type TicketRow } from "@/components/TicketTable";
import { useMe } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_panel/admin/abiertos")({
  head: () => ({
    meta: [
      { title: "Tickets Abiertos — Moon Club" },
      { name: "description", content: "Panel de administración: tickets abiertos de Moon Club." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Tickets Abiertos — Moon Club" },
      { property: "og:description", content: "Gestión de tickets abiertos en Moon Club." },
    ],
  }),
  component: Abiertos,
});

function Abiertos() {
  const { isStaff, loading } = useMe();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tickets", "open"],
    enabled: isStaff,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as TicketRow[];
    },
  });

  if (loading || isLoading) return <NeonLoader label="Cargando" />;
  if (!isStaff)
    return <p className="text-sm text-muted-foreground">No tienes acceso a esta sección.</p>;

  return (
    <div className="space-y-6">
      <PageHeader title="Tickets Abiertos" subtitle="Casos pendientes de atender." />
      <TicketList tickets={data ?? []} empty="No hay tickets abiertos" />
    </div>
  );
}
