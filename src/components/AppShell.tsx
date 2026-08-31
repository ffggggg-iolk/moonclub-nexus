import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Crown,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Plus,
  Settings,
  Shield,
  Ticket,
  User,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { MoonLogo } from "@/components/MoonLogo";
import { Button } from "@/components/ui/button";
import { displayName, useMe } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const baseNav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/perfil", label: "Mi Perfil", icon: User },
  { to: "/tickets", label: "Mis Tickets", icon: Ticket },
  { to: "/tickets/nuevo", label: "Crear Ticket", icon: Plus },
];

const tailNav: NavItem[] = [
  { to: "/notificaciones", label: "Notificaciones", icon: Bell },
  { to: "/configuracion", label: "Configuración", icon: Settings },
];

const adminNav: NavItem[] = [
  { to: "/admin/abiertos", label: "Tickets Abiertos", icon: LifeBuoy },
  { to: "/admin/cerrados", label: "Tickets Cerrados", icon: Shield },
];

const ownerNav: NavItem[] = [
  { to: "/owner", label: "Overview", icon: Crown },
  { to: "/owner/administradores", label: "Administradores", icon: Shield },
  { to: "/owner/usuarios", label: "Usuarios", icon: User },
  { to: "/owner/tickets", label: "Tickets", icon: Ticket },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { isStaff, isOwner } = useMe();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const renderGroup = (title: string | null, items: NavItem[]) => (
    <div key={title ?? "main"} className="space-y-1">
      {title ? (
        <p className="px-3 pb-1 pt-4 font-display text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {title}
        </p>
      ) : null}
      {items.map((item) => {
        const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-surface-2 text-foreground glow-blue"
                : "text-muted-foreground hover:bg-surface hover:text-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav className="flex flex-col gap-1">
      {renderGroup(null, baseNav)}
      {isStaff ? renderGroup("Admin Panel", adminNav) : null}
      {isOwner ? renderGroup("Owner Panel", ownerNav) : null}
      {renderGroup("Cuenta", tailNav)}
    </nav>
  );
}

function SignOutButton({ onDone }: { onDone?: () => void }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <Button
      variant="ghostPink"
      className="w-full justify-start"
      onClick={async () => {
        onDone?.();
        await queryClient.cancelQueries();
        queryClient.clear();
        await supabase.auth.signOut();
        navigate({ to: "/auth", replace: true });
      }}
    >
      <LogOut className="size-4" /> Cerrar sesión
    </Button>
  );
}

function UserBadge() {
  const { profile, role } = useMe();
  const roleLabel = role === "owner" ? "OWNER" : role === "admin" ? "ADMIN" : "USER";
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface/70 p-3">
      {profile?.discord_avatar ? (
        <img
          src={profile.discord_avatar}
          alt=""
          className="size-9 rounded-full border border-neon-blue/50"
        />
      ) : (
        <div className="grid size-9 place-items-center rounded-full bg-surface-2 text-xs font-bold">
          {displayName(profile).slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{displayName(profile)}</p>
        <p
          className={cn(
            "font-display text-[10px] tracking-[0.2em]",
            role === "owner"
              ? "text-neon-yellow"
              : role === "admin"
                ? "text-neon-pink"
                : "text-neon-blue",
          )}
        >
          {roleLabel}
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="club-bg min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border/60 bg-sidebar/90 p-4 backdrop-blur lg:flex">
        <Link to="/dashboard" className="mb-5 flex items-center gap-3 px-1">
          <MoonLogo className="h-10 w-10" />
          <span className="font-display text-sm font-bold tracking-[0.2em] neon-text">
            MOON CLUB
          </span>
        </Link>
        <UserBadge />
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <NavLinks />
        </div>
        <SignOutButton />
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/dashboard" className="flex items-center gap-2">
          <MoonLogo className="h-8 w-8" />
          <span className="font-display text-xs font-bold tracking-[0.2em] neon-text">
            MOON CLUB
          </span>
        </Link>
        <Button
          variant="ghostNeon"
          size="icon"
          aria-label="Abrir menú"
          onClick={() => setOpen(true)}
          className="h-10 w-10"
        >
          <Menu className="size-5" />
        </Button>
      </header>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-xs flex-col border-r border-border bg-sidebar p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-sm font-bold tracking-[0.2em] neon-text">
                MOON CLUB
              </span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            <UserBadge />
            <div className="mt-4 flex-1 overflow-y-auto">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <SignOutButton onDone={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </main>
    </div>
  );
}
