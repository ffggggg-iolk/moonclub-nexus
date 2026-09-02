import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Shield, Ticket, User } from "lucide-react";

import { NeonLoader } from "@/components/NeonLoader";
import { PageHeader } from "@/components/panel";
import { useMe } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_panel/owner/")({
  head: () => ({
    meta: [
      { title: "Owner Overview — Moon Club" },
      { name: "description", content: "Resumen global del club: usuarios, staff y tickets." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Owner Overview — Moon Club" },
      { property: "og:description", content: "Panel de control del propietario de Moon Club." },
    ],
  }),
  component: OwnerOverview,
});

function OwnerOverview() {
  const { isOwner, loading } = useMe();

  const { data, isLoading } = useQuery({
    queryKey: ["owner-overview"],
    enabled: isOwner,
    queryFn: async () => {
      const [users, staff, open, closed] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("id", { count: "exact", head: true }),
        supabase.from("tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("tickets").select("id", { count: "exact", head: true }).eq("status", "closed"),
      ]);
      return {
        users: users.count ?? 0,
        staff: staff.count ?? 0,
        open: open.count ?? 0,
        closed: closed.count ?? 0,
      };
    },
  });

  if (loading || isLoading) return <NeonLoader label="Cargando" />;
  if (!isOwner)
    return <p className="text-sm text-muted-foreground">Solo el propietario puede ver esto.</p>;

  return (
    <div className="space-y-6">
      <PageHeader title="Owner Overview" subtitle="Estado general de Moon Club." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<User className="size-4" />} label="Usuarios" value={data?.users ?? 0} />
        <Stat icon={<Shield className="size-4" />} label="Roles asignados" value={data?.staff ?? 0} />
        <Stat icon={<Ticket className="size-4" />} label="Tickets abiertos" value={data?.open ?? 0} />
        <Stat icon={<Ticket className="size-4" />} label="Tickets cerrados" value={data?.closed ?? 0} />
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <article className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 text-neon-blue">{icon}</div>
      <p className="mt-2 font-display text-3xl font-black neon-text">{value}</p>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    </article>
  );
}
