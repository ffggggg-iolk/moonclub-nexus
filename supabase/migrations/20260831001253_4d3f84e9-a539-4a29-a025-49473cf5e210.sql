CREATE POLICY "evidence_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'ticket-evidence' AND public.can_access_ticket((storage.foldername(name))[1]::uuid, auth.uid()));
CREATE POLICY "evidence_select" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'ticket-evidence' AND public.can_access_ticket((storage.foldername(name))[1]::uuid, auth.uid()));