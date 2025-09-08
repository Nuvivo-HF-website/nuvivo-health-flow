-- Drop existing trigger if it exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_role_trigger ON auth.users;

-- Make sure the trigger on profiles table exists for role assignment
DROP TRIGGER IF EXISTS handle_new_user_role_trigger ON public.profiles;

-- Create the trigger on profiles table to assign roles when a profile is created
CREATE TRIGGER handle_new_user_role_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Recreate the trigger for creating profiles when auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();