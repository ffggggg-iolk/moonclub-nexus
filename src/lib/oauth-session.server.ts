/**
 * Server-only: turns a verified OAuth identity into a Moon Club session.
 * Uses the service-role client; never import from client code.
 */
import type { OAuthIdentity } from "./oauth.server";

/** Synthetic, non-deliverable address: OAuth identities have no password. */
function syntheticEmail(identity: OAuthIdentity) {
  return `${identity.provider}_${identity.providerUserId}@users.moonclub.app`;
}

export async function establishSession(identity: OAuthIdentity, origin: string): Promise<string> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const idColumn = identity.provider === "discord" ? "discord_id" : "roblox_id";
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq(idColumn, identity.providerUserId)
    .maybeSingle();

  let userId = existing?.id ?? null;
  const email = syntheticEmail(identity);

  if (!userId) {
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata:
        identity.provider === "discord"
          ? {
              discord_id: identity.providerUserId,
              discord_username: identity.username,
              discord_avatar: identity.avatarUrl,
            }
          : {
              roblox_id: identity.providerUserId,
              roblox_username: identity.username,
            },
    });
    if (error || !created.user) throw new Error(error?.message ?? "user_create_failed");
    userId = created.user.id;
  }

  // Keep the profile in sync with the provider on every login.
  const patch =
    identity.provider === "discord"
      ? {
          discord_id: identity.providerUserId,
          discord_username: identity.username,
          discord_avatar: identity.avatarUrl,
        }
      : {
          roblox_id: identity.providerUserId,
          roblox_username: identity.username,
        };
  await supabaseAdmin.from("profiles").update(patch).eq("id", userId);

  // OWNER is decided ONLY by the server-side Discord ID, never by username.
  const ownerDiscordId = process.env["OWNER_DISCORD_ID"];
  if (
    identity.provider === "discord" &&
    ownerDiscordId &&
    ownerDiscordId === identity.providerUserId
  ) {
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "owner" }, { onConflict: "user_id,role" });
  }

  const { data: link, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkError || !link.properties?.hashed_token) {
    throw new Error(linkError?.message ?? "session_link_failed");
  }

  return `${origin}/auth/complete?token_hash=${encodeURIComponent(link.properties.hashed_token)}`;
}
