import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { AppShell } from "@/components/AppShell";
import { FullPageLoader } from "@/components/NeonLoader";
import { useMe } from "@/hooks/useAuth";

export const Route = createFileRoute("/_panel")({
  ssr: false,
  component: PanelLayout,
});

function PanelLayout() {
  const { session, loading } = useMe();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth", replace: true });
  }, [loading, session, navigate]);

  if (loading || !session) return <FullPageLoader label="Cargando" />;

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
