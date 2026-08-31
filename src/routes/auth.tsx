import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { MoonLogo } from "@/components/MoonLogo";
import { DiscordIcon, RobloxIcon } from "@/components/ProviderIcons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({ error: z.string().optional() });

const credentials = z.object({
  email: z.string().trim().email("Introduce un correo válido").max(255),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(72),
});

const errorMessages: Record<string, string> = {
  discord_not_configured: "El inicio de sesión con Discord aún no está configurado.",
  roblox_not_configured: "El inicio de sesión con Roblox aún no está configurado.",
  invalid_state: "La sesión de autenticación caducó. Inténtalo de nuevo.",
  discord_token_failed: "Discord rechazó la autenticación. Inténtalo de nuevo.",
  roblox_token_failed: "Roblox rechazó la autenticación. Inténtalo de nuevo.",
  discord_profile_failed: "No se pudo leer tu perfil de Discord.",
  roblox_profile_failed: "No se pudo leer tu perfil de Roblox.",
  discord_failed: "No se pudo completar el inicio de sesión con Discord.",
  roblox_failed: "No se pudo completar el inicio de sesión con Roblox.",
  session_failed: "No se pudo iniciar tu sesión. Inténtalo de nuevo.",
};

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Iniciar sesión — Moon Club" },
      {
        name: "description",
        content: "Accede a Moon Club con Discord, Roblox o tu correo para gestionar tus tickets.",
      },
      { property: "og:title", content: "Iniciar sesión — Moon Club" },
      { property: "og:description", content: "Accede a tu cuenta de Moon Club." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { error } = useSearch({ from: "/auth" });
  const { session } = useSession();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (error) toast.error(errorMessages[error] ?? "No se pudo iniciar sesión.");
  }, [error]);

  useEffect(() => {
    if (session) navigate({ to: "/dashboard", replace: true });
  }, [session, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = credentials.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          ...parsed.data,
          options: { emailRedirectTo: window.location.origin },
        });
        if (signUpError) throw signUpError;
        toast.success("Cuenta creada. Revisa tu correo para confirmarla.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword(parsed.data);
        if (signInError) throw signInError;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo completar la operación");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="club-bg flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mx-auto mb-6 flex w-fit flex-col items-center gap-2">
          <MoonLogo className="h-20 w-20" />
          <span className="font-display text-sm font-bold tracking-[0.3em] neon-text">
            MOON CLUB
          </span>
        </Link>

        <div className="glass rounded-3xl p-6 shadow-2xl">
          <h1 className="font-display text-xl font-bold uppercase tracking-wide">
            {mode === "signin" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Usa Discord o Roblox para entrar al instante.
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <Button asChild variant="neon" className="h-11 w-full">
              <a href="/api/public/auth/discord/start">
                <DiscordIcon className="size-5" /> Continuar con Discord
              </a>
            </Button>
            <Button asChild variant="neonYellow" className="h-11 w-full">
              <a href="/api/public/auth/roblox/start">
                <RobloxIcon className="size-5" /> Continuar con Roblox
              </a>
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="neon-divider flex-1" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">o</span>
            <div className="neon-divider flex-1" />
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" variant="ghostNeon" className="h-11 w-full" disabled={busy}>
              {busy ? "Un momento…" : mode === "signin" ? "Entrar" : "Crear cuenta"}
            </Button>
          </form>

          <button
            type="button"
            className="mt-4 w-full text-center text-xs text-muted-foreground transition-colors hover:text-neon-blue"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin"
              ? "¿No tienes cuenta? Crear una"
              : "¿Ya tienes cuenta? Iniciar sesión"}
          </button>
        </div>
      </div>
    </main>
  );
}
