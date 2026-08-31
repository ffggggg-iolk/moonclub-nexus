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
      const { error } = await supabase.auth.verifyOtp({
        type: "magiclink",
        token_hash: tokenHash,
      });
      if (error) {
        navigate({ to: "/auth", search: { error: "session_failed" }, replace: true });
        return;
      }
      navigate({ to: "/dashboard", replace: true });
    })();
  }, [tokenHash, navigate]);

  return <FullPageLoader label="Entrando al club" />;
}
