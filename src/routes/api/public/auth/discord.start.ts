import { createFileRoute } from "@tanstack/react-router";

import {
  authError,
  cookie,
  providerConfig,
  randomToken,
  redirectTo,
  requestOrigin,
} from "@/lib/oauth.server";

export const Route = createFileRoute("/api/public/auth/discord/start")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = requestOrigin(request);
        const secure = origin.startsWith("https://");
        const { clientId, configured } = providerConfig("discord");
        if (!configured || !clientId) return authError(origin, "discord_not_configured");

        const state = randomToken();
        const redirectUri =
          process.env["DISCORD_REDIRECT_URI"] || `${origin}/api/public/auth/discord/callback`;

        const url = new URL("https://discord.com/oauth2/authorize");
        url.searchParams.set("client_id", clientId);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("scope", "identify");
        url.searchParams.set("redirect_uri", redirectUri);
        url.searchParams.set("state", state);
        url.searchParams.set("prompt", "consent");

        return redirectTo(url.toString(), [cookie("mc_discord_state", state, 600, secure)]);
      },
    },
  },
});
