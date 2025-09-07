-- Create trigger to assign roles based on user_type in profile
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert role based on user_type from profile
  IF NEW.user_type = 'doctor' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'doctor');
  ELSE
    -- Default to patient role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'patient');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table to assign roles when profile is created
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Also ensure existing handle_new_user function on auth.users properly assigns default patient role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile first
  INSERT INTO public.profiles (user_id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'patient')
  );
  
  RETURN NEW;
END;
$$;