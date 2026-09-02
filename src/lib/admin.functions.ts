import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertOwner(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "owner" });
  if (!data) throw new Error("Forbidden");
}

export interface AdminUserRow {
  id: string;
  discord_username: string | null;
  roblox_username: string | null;
  discord_avatar: string | null;
  status: string;
  created_at: string;
  role: "user" | "admin" | "owner";
}

export const listAllUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUserRow[]> => {
    await assertOwner(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id, discord_username, roblox_username, discord_avatar, status, created_at")
        .order("created_at", { ascending: false }),
      supabaseAdmin.from("user_roles").select("user_id, role"),
    ]);
    const roleMap = new Map<string, AdminUserRow["role"]>();
    for (const r of roles ?? []) {
      const current = roleMap.get(r.user_id);
      const rank = { user: 0, admin: 1, owner: 2 } as const;
      if (!current || rank[r.role] > rank[current]) roleMap.set(r.user_id, r.role);
    }
    return (profiles ?? []).map((p) => ({
      ...p,
      role: roleMap.get(p.id) ?? "user",
    })) as AdminUserRow[];
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string; role: "user" | "admin" }) => data)
  .handler(async ({ data, context }) => {
    await assertOwner(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("No puedes cambiar tu propio rol");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .in("role", ["admin"]);
    if (data.role === "admin") {
      await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: data.userId, role: "admin", granted_by: context.userId });
    }
    await supabaseAdmin.from("admin_actions").insert({
      admin_id: context.userId,
      target_user_id: data.userId,
      action: data.role === "admin" ? "grant_admin" : "revoke_admin",
      details: `Rol cambiado a ${data.role}`,
    });
    return { ok: true };
  });

export const setUserStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string; status: "active" | "suspended" }) => data)
  .handler(async ({ data, context }) => {
    await assertOwner(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("profiles").update({ status: data.status }).eq("id", data.userId);
    await supabaseAdmin.from("admin_actions").insert({
      admin_id: context.userId,
      target_user_id: data.userId,
      action: "set_status",
      details: data.status,
    });
    return { ok: true };
  });

export const notifyUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string; title: string; body?: string; link?: string }) => data)
  .handler(async ({ data, context }) => {
    const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!staff) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("notifications").insert({
      user_id: data.userId,
      title: data.title,
      body: data.body ?? null,
      link: data.link ?? null,
    });
    return { ok: true };
  });
