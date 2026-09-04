import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { z } from "zod";

import { FullPageLoader } from "@/components/NeonLoader";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({ token_hash: z.string().optional() });

export const Route = createFileRoute("/auth/complete")({
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
  const { token_hash: tokenHash } = useSearch({ from: "/auth/complete" });
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      if (!tokenHash) {
        navigate({ to: "/auth", search: { error: "session_failed" }, replace: true });
        return;
      }
      // GoTrue may issue the admin link as magiclink, email or recovery
      // depending on the user's state; try each until one verifies.
      const types = ["magiclink", "email", "recovery"] as const;
      let ok = false;
      for (const type of types) {
        const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
        if (!error) {
          ok = true;
          break;
        }
        console.warn("verifyOtp failed", type, error.message);
      }
      if (!ok) {
        navigate({ to: "/auth", search: { error: "session_failed" }, replace: true });
        return;
      }

      navigate({ to: "/dashboard", replace: true });
    })();
  }, [tokenHash, navigate]);

  return <FullPageLoader label="Entrando al club" />;
}
