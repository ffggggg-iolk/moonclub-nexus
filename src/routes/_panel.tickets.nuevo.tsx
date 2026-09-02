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
      {
        name: "description",
        content: "Abre un ticket de soporte privado con el equipo de Moon Club.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Crear Ticket — Moon Club" },
      { property: "og:description", content: "Abre un ticket de soporte en Moon Club." },
    ],
  }),
  component: NuevoTicket,
});

function NuevoTicket() {
  const { session, profile } = useMe();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) return;
    const name = username.trim() || displayName(profile, "");
    if (!name || !reason.trim()) {
      toast.error("Completa el username y la razón.");
      return;
    }
    setBusy(true);
    try {
      const { data: ticket, error } = await supabase
        .from("tickets")
        .insert({ user_id: session.user.id, username: name, category, reason: reason.trim() })
        .select()
        .single();
      if (error) throw error;

      for (const file of files) {
        const path = `${ticket.id}/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
        const { error: upErr } = await supabase.storage
          .from("ticket-evidence")
          .upload(path, file, { contentType: file.type });
        if (upErr) throw upErr;
        await supabase.from("messages").insert({
          ticket_id: ticket.id,
          user_id: session.user.id,
          content: null,
          attachment_url: path,
          attachment_type: file.type.startsWith("video") ? "video" : "image",
        });
      }

      toast.success(`Ticket ${ticket.ticket_number} creado`);
      navigate({ to: "/tickets/$id", params: { id: ticket.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo crear el ticket");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Crear Ticket" subtitle="Cuéntanos qué ocurre y adjunta evidencias." />

      <form onSubmit={submit} className="glass space-y-5 rounded-3xl p-5 sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={displayName(profile, "Tu nombre en el juego")}
          />
        </div>

        <div className="space-y-2">
          <Label>Categoría</Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={
                  category === c
                    ? "rounded-full border border-neon-pink bg-surface-2 px-4 py-1.5 text-xs font-semibold text-neon-pink"
                    : "rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground hover:border-neon-blue/60"
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Razón</Label>
          <Textarea
            id="reason"
            rows={5}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe tu caso con el mayor detalle posible."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="files">Evidencias (imágenes o vídeos)</Label>
          <Input
            id="files"
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
          {files.length ? (
            <p className="text-xs text-muted-foreground">{files.length} archivo(s) seleccionado(s)</p>
          ) : null}
        </div>

        <Button type="submit" variant="neon" disabled={busy} className="w-full sm:w-auto">
          {busy ? "Enviando…" : "Enviar ticket"}
        </Button>
      </form>
    </div>
  );
}
