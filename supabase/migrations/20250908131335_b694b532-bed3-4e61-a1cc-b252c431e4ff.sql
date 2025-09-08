-- Update the handle_new_user_role function to handle clinic_staff user type
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Insert role based on user_type from profile
  IF NEW.user_type = 'doctor' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'doctor');
  ELSIF NEW.user_type = 'clinic_staff' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'clinic_staff');
  ELSE
    -- Default to patient role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'patient');
  END IF;
  
  RETURN NEW;
END;
$function$;