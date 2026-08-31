CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'owner');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  discord_id text UNIQUE,
  discord_username text,
  discord_avatar text,
  roblox_id text UNIQUE,
  roblox_username text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  granted_by uuid,
  granted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','owner'))
$$;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_select_staff" ON public.profiles FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "user_roles_select_staff" ON public.user_roles FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE SEQUENCE public.ticket_number_seq START 1;

CREATE TABLE public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text NOT NULL UNIQUE DEFAULT ('#MC-' || lpad(nextval('public.ticket_number_seq')::text, 6, '0')),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  category text NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  closed_by uuid,
  close_reason text,
  reopened_at timestamptz,
  reopened_by uuid
);
GRANT SELECT, INSERT, UPDATE ON public.tickets TO authenticated;
GRANT ALL ON public.tickets TO service_role;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tickets_select_own" ON public.tickets FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "tickets_select_staff" ON public.tickets FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "tickets_insert_own" ON public.tickets FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "tickets_update_staff" ON public.tickets FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text,
  attachment_url text,
  attachment_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_access_ticket(_ticket_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_staff(_user_id)
      OR EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = _ticket_id AND t.user_id = _user_id)
$$;

CREATE POLICY "messages_select" ON public.messages FOR SELECT TO authenticated USING (public.can_access_ticket(ticket_id, auth.uid()));
CREATE POLICY "messages_insert" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.can_access_ticket(ticket_id, auth.uid()));

CREATE TABLE public.admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  target_user_id uuid,
  action text NOT NULL,
  details text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_actions TO authenticated;
GRANT ALL ON public.admin_actions TO service_role;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_actions_select_staff" ON public.admin_actions FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER tickets_touch BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, discord_id, discord_username, discord_avatar)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'discord_id',
    COALESCE(NEW.raw_user_meta_data->>'discord_username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'discord_avatar'
  )
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;