import { Link } from "@tanstack/react-router";

import { EmptyState, StatusPill, formatDate } from "@/components/panel";

export interface TicketRow {
  id: string;
  ticket_number: string;
  username: string;
  category: string;
  reason: string;
  status: string;
  created_at: string;
  closed_at?: string | null;
  close_reason?: string | null;
}

export function TicketList({ tickets, empty }: { tickets: TicketRow[]; empty: string }) {
  if (!tickets.length) return <EmptyState title={empty} />;
  return (
    <div className="grid gap-3">
      {tickets.map((t) => (
        <Link
          key={t.id}
          to="/tickets/$id"
          params={{ id: t.id }}
          className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 transition-colors hover:border-neon-blue/60"
        >
          <div className="min-w-0">
            <p className="font-display text-sm tracking-wide text-neon-blue">{t.ticket_number}</p>
            <p className="truncate text-sm font-medium">{t.reason}</p>
            <p className="text-xs text-muted-foreground">
              {t.username} · {t.category} · {formatDate(t.created_at)}
            </p>
            {t.status === "closed" ? (
              <p className="text-xs text-neon-pink">
                Cerrado {formatDate(t.closed_at)} · {t.close_reason ?? "Sin motivo"}
              </p>
            ) : null}
          </div>
          <StatusPill status={t.status} />
        </Link>
      ))}
    </div>
  );
}
