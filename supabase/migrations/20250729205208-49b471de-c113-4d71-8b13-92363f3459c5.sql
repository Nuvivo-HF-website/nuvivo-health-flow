-- Fix function search path security warnings

-- Update existing functions to have proper search path
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
 RETURNS TABLE(role app_role)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT user_roles.role
  FROM public.user_roles
  WHERE user_id = _user_id
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Insert default patient role for new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'patient');
  
  RETURN NEW;
END;
$function$;