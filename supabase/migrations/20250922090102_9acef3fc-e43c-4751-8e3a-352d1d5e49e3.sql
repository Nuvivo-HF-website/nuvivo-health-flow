-- Drop the current policy and create one that covers both anonymous and authenticated users
DROP POLICY "Public access to active specialists" ON public.profiles;

-- Create a comprehensive policy for marketplace access
CREATE POLICY "Marketplace access to active specialists" 
ON public.profiles 
FOR SELECT 
USING (
  user_id IN (
    SELECT s.user_id 
    FROM public.specialists s 
    WHERE s.is_active = true
  )
  OR 
  -- Allow admins, doctors, and clinic staff to see all active specialist profiles
  (auth.uid() IN (
    SELECT user_roles.user_id
    FROM user_roles
    WHERE user_roles.role = ANY (ARRAY['admin'::app_role, 'doctor'::app_role, 'clinic_staff'::app_role])
  ))
);