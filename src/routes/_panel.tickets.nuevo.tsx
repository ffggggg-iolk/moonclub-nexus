import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { displayName, useMe } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = ["Soporte", "Reporte", "Problema", "Consulta", "Otro"];

export const Route = createFileRoute("/_panel/tickets/nuevo")({
  head: () => ({
    meta: [
      { title: "Crear Ticket — Moon Club" },
      { name: "description", content: "Abre un ticket de soporte privado con el equipo de Moon Club." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Crear Ticket — Moon Club" },
      { property: "og:description", content: "Abre un ticket de soporte en Moon Club." },
    ],
  }),
  component: NuevoTicket;
});

function NuevoTicket() {
  return null;
}
