-- Drop the previous policy and create a more explicit one for anonymous access
DROP POLICY "Allow public access to active specialist profiles" ON public.profiles;

-- Create a new policy that explicitly allows anonymous access to active specialist profiles  
CREATE POLICY "Public access to active specialists" 
ON public.profiles 
FOR SELECT 
TO anon
USING (
  user_id IN (
    SELECT s.user_id 
    FROM public.specialists s 
    WHERE s.is_active = true
  )
);