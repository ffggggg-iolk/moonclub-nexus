import { createFileRoute, Link } from "@tanstack/react-router";
import { LogIn, ShieldCheck, MessagesSquare, Sparkles } from "lucide-react";

import { MoonLogo } from "@/components/MoonLogo";
import { DiscordIcon, RobloxIcon } from "@/components/ProviderIcons";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Moon Club — Comunidad y soporte con Discord y Roblox" },
      {
        name: "description",
        content:
          "Moon Club es la plataforma de la comunidad: inicia sesión con Discord o Roblox, abre tickets de soporte y chatea en privado con el equipo.",
      },
      { property: "og:title", content: "Moon Club — Comunidad y soporte" },
      {
        property: "og:description",
        content:
          "Entra con Discord o Roblox, abre tu ticket y habla directamente con el staff de Moon Club.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: MessagesSquare,
    title: "Tickets con chat privado",
    text: "Abre un ticket, adjunta capturas o vídeos y habla en directo con el staff.",
  },
  {
    icon: ShieldCheck,
    title: "Privacidad real",
    text: "Cada ticket es privado. Solo tú y el equipo de Moon Club podéis verlo.",
  },
  {
    icon: Sparkles,
    title: "Discord + Roblox",
    text: "Vincula tus cuentas y entra sin contraseñas: autenticación oficial de cada plataforma.",
  },
];

function Landing() {
  return (
    <main className="club-bg relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-neon-pink/20 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-neon-blue/20 blur-[110px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-3">
          <MoonLogo className="h-11 w-11" />
          <span className="font-display text-lg font-bold tracking-widest neon-text">MOON CLUB</span>
        </div>
        <Button asChild variant="outline" size="sm" className="border-neon-blue/50 text-foreground">
          <Link to="/auth">
            <LogIn className="size-4" /> Iniciar sesión
          </Link>
        </Button>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-20 pt-6 text-center sm:pt-12">
        <div className="relative animate-float">
          <div className="absolute inset-0 rounded-full bg-neon-pink/30 blur-3xl" />
          <MoonLogo className="relative h-52 w-52 drop-shadow-[0_0_45px_oklch(0.71_0.24_350_/_0.45)] sm:h-72 sm:w-72" />
        </div>

        <h1 className="mt-6 font-display text-4xl font-black uppercase tracking-tight sm:text-6xl">
          <span className="neon-text">Moon Club</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          La central de la comunidad. Entra con tu cuenta, abre tu ticket y recibe soporte del
          equipo en un chat privado, rápido y sin vueltas.
        </p>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3">
          <Button asChild size="lg" variant="neon" className="h-12 w-full text-base">
            <a href="/api/public/auth/discord/start">
              <DiscordIcon className="size-5" /> Continuar con Discord
            </a>
          </Button>
          <Button asChild size="lg" variant="neonYellow" className="h-12 w-full text-base">
            <a href="/api/public/auth/roblox/start">
              <RobloxIcon className="size-5" /> Continuar con Roblox
            </a>
          </Button>
          <Button asChild size="lg" variant="ghostNeon" className="h-12 w-full text-base">
            <Link to="/auth">
              <LogIn className="size-5" /> Iniciar sesión con correo
            </Link>
          </Button>
        </div>

        <div className="neon-divider mt-14 w-full max-w-3xl" />

        <div className="mt-10 grid w-full gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="glass rounded-2xl p-5 text-left">
              <f.icon className="size-6 text-neon-blue" />
              <h2 className="mt-3 font-display text-sm font-bold uppercase tracking-wider">
                {f.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Moon Club
      </footer>
    </main>
  );
}
