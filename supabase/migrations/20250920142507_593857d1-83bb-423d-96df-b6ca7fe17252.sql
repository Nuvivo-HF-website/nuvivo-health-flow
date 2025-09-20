-- Allow public access to basic profile information for approved marketplace doctors
CREATE POLICY "Allow public access to approved doctor profiles" 
ON public.profiles 
FOR SELECT 
USING (
  user_id IN (
    SELECT dp.user_id 
    FROM public.doctor_profiles dp 
    WHERE dp.is_marketplace_ready = true 
      AND dp.verification_status = 'approved'::verification_status 
      AND dp.is_active = true
  )
);