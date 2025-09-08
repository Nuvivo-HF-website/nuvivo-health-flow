-- Fix the handle_new_user function to not reference user_type from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Insert profile first with user_type from raw_user_meta_data
  INSERT INTO public.profiles (user_id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'patient')
  );
  
  RETURN NEW;
END;
$function$;

-- Also make sure we have the correct trigger setup
DROP TRIGGER IF EXISTS handle_new_user_role_trigger ON public.profiles;

-- Create the trigger on profiles table to assign roles when a profile is created
CREATE TRIGGER handle_new_user_role_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();