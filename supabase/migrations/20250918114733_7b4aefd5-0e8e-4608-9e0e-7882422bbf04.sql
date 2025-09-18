-- Fix RLS policy for user_roles table to allow users to insert their own roles during registration
DROP POLICY IF EXISTS "Users can insert their own roles during registration" ON public.user_roles;

CREATE POLICY "Users can insert their own roles during registration" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  role IN ('patient', 'doctor', 'clinic_staff')
);