-- Fix the handle_new_user_role function to handle duplicate role insertions
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Insert role based on user_type from profile with conflict handling
  IF NEW.user_type = 'doctor' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'doctor')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSIF NEW.user_type = 'clinic_staff' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'clinic_staff')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    -- Default to patient role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'patient')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;