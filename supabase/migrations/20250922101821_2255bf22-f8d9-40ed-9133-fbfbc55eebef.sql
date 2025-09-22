-- Create a new policy with a different name to avoid deadlocks
CREATE POLICY "allow_specialist_availability_view" ON public.doctor_profiles
FOR SELECT USING (
  -- Allow access to users who have entries in specialists table (marketplace providers)
  user_id IN (SELECT user_id FROM public.specialists WHERE is_active = true)
);