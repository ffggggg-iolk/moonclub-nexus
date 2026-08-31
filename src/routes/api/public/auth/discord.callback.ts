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

export const Route = createFileRoute("/api/public/auth/discord/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = requestOrigin(request);
        const secure = origin.startsWith("https://");
        const clear = [clearCookie("mc_discord_state", secure)];
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const expectedState = readCookie(request, "mc_discord_state");

        if (!code || !state || !expectedState || state !== expectedState) {
          return authError(origin, "invalid_state", clear);
        }

        const { clientId, clientSecret, configured } = providerConfig("discord");
        if (!configured || !clientId || !clientSecret) {
          return authError(origin, "discord_not_configured", clear);
        }

        const redirectUri =
          process.env["DISCORD_REDIRECT_URI"] || `${origin}/api/public/auth/discord/callback`;

        try {
          const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: clientId,
              client_secret: clientSecret,
              grant_type: "authorization_code",
              code,
              redirect_uri: redirectUri,
            }),
          });
          if (!tokenRes.ok) return authError(origin, "discord_token_failed", clear);
          const token = (await tokenRes.json()) as { access_token?: string };
          if (!token.access_token) return authError(origin, "discord_token_failed", clear);

          const userRes = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${token.access_token}` },
          });
          if (!userRes.ok) return authError(origin, "discord_profile_failed", clear);
          const me = (await userRes.json()) as {
            id: string;
            username: string;
            global_name?: string | null;
            avatar?: string | null;
          };

          const destination = await establishSession(
            {
              provider: "discord",
              providerUserId: me.id,
              username: me.global_name || me.username,
              avatarUrl: me.avatar
                ? `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=256`
                : null,
            },
            origin,
          );
          return redirectTo(destination, clear);
        } catch (error) {
          console.error("discord callback failed", error);
          return authError(origin, "discord_failed", clear);
        }
      },
    },
  },
});
