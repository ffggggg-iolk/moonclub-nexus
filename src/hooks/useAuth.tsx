import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export type Role = "user" | "admin" | "owner";

export interface Profile {
  id: string;
  discord_id: string | null;
  discord_username: string | null;
  discord_avatar: string | null;
  roblox_id: string | null;
  roblox_username: string | null;
  status: string;
  created_at: string;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [queryClient]);

  return { session, loading };
}

export function useMe() {
  const { session, loading } = useSession();
  const userId = session?.user.id ?? null;

  const query = useQuery({
    queryKey: ["me", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId!).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId!),
      ]);
      const roleList = (roles ?? []).map((r) => r.role as Role);
      const role: Role = roleList.includes("owner")
        ? "owner"
        : roleList.includes("admin")
          ? "admin"
          : "user";
      return { profile: (profile as Profile | null) ?? null, role };
    },
  });

  return {
    session,
    loading: loading || (Boolean(userId) && query.isLoading),
    profile: query.data?.profile ?? null,
    role: query.data?.role ?? ("user" as Role),
    isStaff: query.data?.role === "admin" || query.data?.role === "owner",
    isOwner: query.data?.role === "owner",
  };
}

export function displayName(profile: Profile | null, fallback = "Invitado") {
  return profile?.discord_username || profile?.roblox_username || fallback;
}
