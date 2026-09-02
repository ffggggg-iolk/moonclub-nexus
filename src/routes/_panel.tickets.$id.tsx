import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Lock, Paperclip, RotateCcw, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { NeonLoader } from "@/components/NeonLoader";
import { StatusPill, formatDate } from "@/components/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMe } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_panel/tickets/$id")({
  head: () => ({
    meta: [
      { title: "Ticket — Moon Club" },
      { name: "description", content: "Chat privado del ticket con el equipo de Moon Club." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Ticket — Moon Club" },
      { property: "og:description", content: "Conversación privada de soporte en Moon Club." },
    ],
  }),
  component: TicketDetail,
});

interface Message {
  id: string;
  user_id: string;
  content: string | null;
  attachment_url: string | null;
  attachment_type: string | null;
  created_at: string;
}

function Attachment({ path, type }: { path: string; type: string | null }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    supabase.storage
      .from("ticket-evidence")
      .createSignedUrl(path, 3600)
      .then(({ data }) => {
        if (active) setUrl(data?.signedUrl ?? null);
      });
    return () => {
      active = false;
    };
  }, [path]);

  if (!url) return <p className="text-xs text-muted-foreground">Cargando adjunto…</p>;
  return type === "video" ? (
    <video src={url} controls className="max-h-72 rounded-xl border border-border" />
  ) : (
    <img src={url} alt="Evidencia del ticket" className="max-h-72 rounded-xl border border-border" />
  );
}

function TicketDetail() {
  const { id } = useParams({ from: "/_panel/tickets/$id" });
  const { session, isStaff } = useMe();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const ticketQuery = useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("tickets").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  const messagesQuery = useQuery({
    queryKey: ["messages", id],
    refetchInterval: 5000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("ticket_id", id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Message[];
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messagesQuery.data?.length]);

  const ticket = ticketQuery.data;
  const closed = ticket?.status === "closed";

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session || (!text.trim() && !file) || closed) return;
    setBusy(true);
    try {
      let attachmentUrl: string | null = null;
      let attachmentType: string | null = null;
      if (file) {
        const path = `${id}/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
        const { error } = await supabase.storage
          .from("ticket-evidence")
          .upload(path, file, { contentType: file.type });
        if (error) throw error;
        attachmentUrl = path;
        attachmentType = file.type.startsWith("video") ? "video" : "image";
      }
      const { error } = await supabase.from("messages").insert({
        ticket_id: id,
        user_id: session.user.id,
        content: text.trim() || null,
        attachment_url: attachmentUrl,
        attachment_type: attachmentType,
      });
      if (error) throw error;
      setText("");
      setFile(null);
      await queryClient.invalidateQueries({ queryKey: ["messages", id] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo enviar");
    } finally {
      setBusy(false);
    }
  };

  const closeTicket = async () => {
    const reason = window.prompt("Motivo del cierre:");
    if (reason === null) return;
    const { error } = await supabase
      .from("tickets")
      .update({
        status: "closed",
        closed_at: new Date().toISOString(),
        closed_by: session?.user.id ?? null,
        close_reason: reason || "Sin motivo",
      })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Ticket cerrado");
    queryClient.invalidateQueries({ queryKey: ["ticket", id] });
  };

  const reopenTicket = async () => {
    const { error } = await supabase
      .from("tickets")
      .update({
        status: "open",
        reopened_at: new Date().toISOString(),
        reopened_by: session?.user.id ?? null,
      })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Ticket reabierto");
    queryClient.invalidateQueries({ queryKey: ["ticket", id] });
  };

  if (ticketQuery.isLoading) return <NeonLoader label="Cargando" />;
  if (!ticket)
    return (
      <div className="glass rounded-3xl p-8 text-center">
        <p className="text-sm text-muted-foreground">Ticket no disponible.</p>
      </div>
    );

  return (
    <div className="space-y-5">
      <Link
        to="/tickets"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver
      </Link>

      <header className="glass flex flex-wrap items-start justify-between gap-4 rounded-3xl p-5">
        <div className="min-w-0">
          <p className="font-display text-sm tracking-[0.2em] text-neon-blue">
            {ticket.ticket_number}
          </p>
          <h1 className="mt-1 text-lg font-semibold">{ticket.reason}</h1>
          <p className="text-xs text-muted-foreground">
            {ticket.category} · {ticket.username} · {formatDate(ticket.created_at)}
          </p>
          {closed ? (
            <p className="mt-2 text-xs text-neon-pink">
              Cerrado {formatDate(ticket.closed_at)} · Motivo: {ticket.close_reason ?? "—"}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <StatusPill status={ticket.status} />
          {isStaff ? (
            closed ? (
              <Button size="sm" variant="ghostNeon" onClick={reopenTicket}>
                <RotateCcw className="size-4" /> Reabrir
              </Button>
            ) : (
              <Button size="sm" variant="ghostPink" onClick={closeTicket}>
                <Lock className="size-4" /> Cerrar
              </Button>
            )
          ) : null}
        </div>
      </header>

      <section className="glass max-h-[60vh] space-y-3 overflow-y-auto rounded-3xl p-4">
        {messagesQuery.data?.length ? (
          messagesQuery.data.map((m) => {
            const mine = m.user_id === session?.user.id;
            return (
              <div key={m.id} className={mine ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    mine
                      ? "max-w-[85%] space-y-2 rounded-2xl rounded-br-sm border border-neon-blue/40 bg-surface-2 p-3"
                      : "max-w-[85%] space-y-2 rounded-2xl rounded-bl-sm border border-border bg-surface/70 p-3"
                  }
                >
                  {m.content ? <p className="whitespace-pre-wrap text-sm">{m.content}</p> : null}
                  {m.attachment_url ? (
                    <Attachment path={m.attachment_url} type={m.attachment_type} />
                  ) : null}
                  <p className="text-[10px] text-muted-foreground">{formatDate(m.created_at)}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Sin mensajes todavía. Escribe el primero.
          </p>
        )}
        <div ref={bottomRef} />
      </section>

      {closed ? (
        <p className="text-center text-xs text-muted-foreground">
          Este ticket está cerrado. Un administrador puede reabrirlo.
        </p>
      ) : (
        <form onSubmit={send} className="glass flex flex-wrap items-center gap-2 rounded-2xl p-3">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe un mensaje…"
            className="min-w-40 flex-1"
          />
          <label className="flex cursor-pointer items-center gap-1 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground hover:border-neon-blue/60">
            <Paperclip className="size-4" />
            {file ? file.name.slice(0, 12) : "Adjuntar"}
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <Button type="submit" variant="neon" disabled={busy}>
            <Send className="size-4" /> Enviar
          </Button>
        </form>
      )}
    </div>
  );
}
