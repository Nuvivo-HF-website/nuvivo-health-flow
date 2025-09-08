-- Drop the incorrect trigger from auth.users that's causing the error
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;

-- Make sure we only have the correct triggers:
-- 1. on_auth_user_created on auth.users calls handle_new_user() (creates profile)
-- 2. handle_new_user_role_trigger on profiles calls handle_new_user_role() (assigns role)

-- Check that the profiles trigger exists
DROP TRIGGER IF EXISTS handle_new_user_role_trigger ON public.profiles;
CREATE TRIGGER handle_new_user_role_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();