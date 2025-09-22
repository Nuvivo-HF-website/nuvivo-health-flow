-- Update RLS policy to allow guests to view availability data for marketplace doctors
DROP POLICY IF EXISTS "public_marketplace_read" ON public.doctor_profiles;

-- Create comprehensive policy for marketplace access to doctor availability
CREATE POLICY "marketplace_availability_access" ON public.doctor_profiles
FOR SELECT USING (
  -- Allow access to active specialists (for marketplace display)
  user_id IN (SELECT user_id FROM public.specialists WHERE is_active = true)
  -- OR allow access to approved marketplace-ready doctors
  OR (is_marketplace_ready = true AND verification_status = 'approved'::verification_status AND is_active = true)
  -- OR allow users to see their own profile
  OR user_id = auth.uid()
  -- OR allow admins to see all
  OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role)
);