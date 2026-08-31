import { createFileRoute } from "@tanstack/react-router";

import {
  authError,
  cookie,
  pkceChallenge,
  providerConfig,
  randomToken,
  redirectTo,
  requestOrigin,
} from "@/lib/oauth.server";

export const Route = createFileRoute("/api/public/auth/roblox/start")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = requestOrigin(request);
        const secure = origin.startsWith("https://");
        const { clientId, configured } = providerConfig("roblox");
        if (!configured || !clientId) return authError(origin, "roblox_not_configured");

        const state = randomToken();
        const verifier = randomToken(48);
        const challenge = await pkceChallenge(verifier);
        const redirectUri =
          process.env["ROBLOX_REDIRECT_URI"] || `${origin}/api/public/auth/roblox/callback`;

        const url = new URL("https://apis.roblox.com/oauth/v1/authorize");
        url.searchParams.set("client_id", clientId);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("scope", "openid profile");
        url.searchParams.set("redirect_uri", redirectUri);
        url.searchParams.set("state", state);
        url.searchParams.set("code_challenge", challenge);
        url.searchParams.set("code_challenge_method", "S256");

        return redirectTo(url.toString(), [
          cookie("mc_roblox_state", state, 600, secure),
          cookie("mc_roblox_verifier", verifier, 600, secure),
        ]);
      },
    },
  },
});
