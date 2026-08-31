/**
 * Server-only OAuth helpers for Moon Club.
 *
 * NEVER import this from a client component: it reads client secrets from
 * process.env. Only server route handlers (src/routes/api/public/auth/*) use it.
 */

export type ProviderId = "discord" | "roblox";

export interface OAuthIdentity {
  provider: ProviderId;
  providerUserId: string;
  username: string;
  avatarUrl: string | null;
}

export function randomToken(bytes = 32): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function pkceChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64UrlEncode(new Uint8Array(digest));
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function cookie(name: string, value: string, maxAgeSeconds: number, secure: boolean) {
  const attrs = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (secure) attrs.push("Secure");
  return attrs.join("; ");
}

export function clearCookie(name: string, secure: boolean) {
  return cookie(name, "", 0, secure);
}

/** Origin the browser actually used, so the redirect URI always matches. */
export function requestOrigin(request: Request): string {
  const url = new URL(request.url);
  const forwardedHost =
    url.hostname === "localhost" ? request.headers.get("x-forwarded-host") : null;
  return forwardedHost ? `https://${forwardedHost}` : url.origin;
}

export function redirectTo(location: string, cookies: string[] = []): Response {
  const headers = new Headers({ Location: location });
  for (const c of cookies) headers.append("Set-Cookie", c);
  return new Response(null, { status: 302, headers });
}

export function authError(origin: string, code: string, cookies: string[] = []): Response {
  return redirectTo(`${origin}/auth?error=${encodeURIComponent(code)}`, cookies);
}

export function providerConfig(provider: ProviderId) {
  const id = provider.toUpperCase();
  const clientId = process.env[`${id}_CLIENT_ID`];
  const clientSecret = process.env[`${id}_CLIENT_SECRET`];
  return { clientId, clientSecret, configured: Boolean(clientId && clientSecret) };
}
