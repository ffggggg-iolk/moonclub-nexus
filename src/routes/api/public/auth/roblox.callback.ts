import { createFileRoute } from "@tanstack/react-router";

import { establishSession } from "@/lib/oauth-session.server";
import {
  authError,
  clearCookie,
  providerConfig,
  readCookie,
  redirectTo,
  requestOrigin,
} from "@/lib/oauth.server";

export const Route = createFileRoute("/api/public/auth/roblox/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = requestOrigin(request);
        const secure = origin.startsWith("https://");
        const clear = [
          clearCookie("mc_roblox_state", secure),
          clearCookie("mc_roblox_verifier", secure),
        ];
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const expectedState = readCookie(request, "mc_roblox_state");
        const verifier = readCookie(request, "mc_roblox_verifier");

        if (!code || !state || !expectedState || state !== expectedState || !verifier) {
          return authError(origin, "invalid_state", clear);
        }

        const { clientId, clientSecret, configured } = providerConfig("roblox");
        if (!configured || !clientId || !clientSecret) {
          return authError(origin, "roblox_not_configured", clear);
        }

        const redirectUri =
          process.env["ROBLOX_REDIRECT_URI"] || `${origin}/api/public/auth/roblox/callback`;

        try {
          const tokenRes = await fetch("https://apis.roblox.com/oauth/v1/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: clientId,
              client_secret: clientSecret,
              grant_type: "authorization_code",
              code,
              code_verifier: verifier,
              redirect_uri: redirectUri,
            }),
          });
          if (!tokenRes.ok) return authError(origin, "roblox_token_failed", clear);
          const token = (await tokenRes.json()) as { access_token?: string };
          if (!token.access_token) return authError(origin, "roblox_token_failed", clear);

          const userRes = await fetch("https://apis.roblox.com/oauth/v1/userinfo", {
            headers: { Authorization: `Bearer ${token.access_token}` },
          });
          if (!userRes.ok) return authError(origin, "roblox_profile_failed", clear);
          const me = (await userRes.json()) as {
            sub: string;
            preferred_username?: string;
            name?: string;
            picture?: string | null;
          };

          const destination = await establishSession(
            {
              provider: "roblox",
              providerUserId: me.sub,
              username: me.preferred_username || me.name || `roblox_${me.sub}`,
              avatarUrl: me.picture ?? null,
            },
            origin,
          );
          return redirectTo(destination, clear);
        } catch (error) {
          console.error("roblox callback failed", error);
          return authError(origin, "roblox_failed", clear);
        }
      },
    },
  },
});
