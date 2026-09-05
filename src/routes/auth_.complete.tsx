import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { FullPageLoader } from "@/components/NeonLoader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({ token_hash: z.string().optional() });

export const Route = createFileRoute("/auth_/complete")({
  validateSearch: searchSchema,
  ssr: false,
  head: () => ({
    meta: [
      { title: "Conectando — Moon Club" },
      { name: "description", content: "Completando tu inicio de sesión en Moon Club." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Conectando — Moon Club" },
      { property: "og:description", content: "Completando tu inicio de sesión." },
    ],
  }),
  component: AuthComplete,
});

function AuthComplete() {
  const { token_hash: tokenHash } = useSearch({ from: "/auth_/complete" });
  const ran = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        if (!tokenHash) throw new Error("missing_session_token");

        const { data, error } = await supabase.auth.verifyOtp({
          type: "magiclink",
          token_hash: tokenHash,
        });
        if (error || !data.session) throw error ?? new Error("session_not_created");

        // Do not leave the completion screen until the persisted browser
        // session can be read back by the protected panel.
        const { data: persisted, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !persisted.session) {
          throw sessionError ?? new Error("session_not_persisted");
        }

        window.location.replace("/dashboard");
      } catch (error) {
        console.error("Moon Club session completion failed", error);
        setFailed(true);
      }
    })();
  }, [tokenHash]);

  if (failed) {
    return (
      <main className="club-bg flex min-h-screen items-center justify-center bg-background px-5">
        <section className="glass w-full max-w-md rounded-3xl p-6 text-center">
          <h1 className="font-display text-xl font-bold uppercase">No se pudo abrir tu sesión</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            El acceso caducó o no pudo guardarse. Vuelve a iniciar sesión con Discord.
          </p>
          <Button className="mt-5 w-full" variant="neon" onClick={() => window.location.replace("/auth")}> 
            Volver a intentarlo
          </Button>
        </section>
      </main>
    );
  }

  return <FullPageLoader label="Entrando al club" />;
}
