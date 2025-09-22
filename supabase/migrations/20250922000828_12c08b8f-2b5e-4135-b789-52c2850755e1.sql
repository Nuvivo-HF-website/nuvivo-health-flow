-- Allow public access to profiles of active specialists for marketplace
CREATE POLICY "Allow public access to active specialist profiles" 
ON public.profiles 
FOR SELECT 
USING (
  user_id IN (
    SELECT s.user_id 
    FROM specialists s 
    WHERE s.is_active = true
  )
);