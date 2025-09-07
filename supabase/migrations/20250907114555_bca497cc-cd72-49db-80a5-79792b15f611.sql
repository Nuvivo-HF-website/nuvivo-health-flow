-- Fix function search_path issues
CREATE OR REPLACE FUNCTION public.assign_admin_role(user_email TEXT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_uuid uuid;
  result jsonb;
BEGIN
  -- Get user ID from profiles table
  SELECT user_id INTO user_uuid
  FROM public.profiles
  WHERE email = user_email
  LIMIT 1;
  
  IF user_uuid IS NULL THEN
    RETURN jsonb_build_object(
      'status', 'error',
      'message', 'User not found with email: ' || user_email
    );
  END IF;
  
  -- Update user type to admin
  UPDATE public.profiles
  SET user_type = 'admin'
  WHERE user_id = user_uuid;
  
  -- Insert or update admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_uuid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Log the admin creation
  PERFORM public.log_gdpr_action(
    user_uuid,
    'ADMIN_ROLE_ASSIGNED',
    'user_roles',
    user_uuid,
    NULL,
    NULL,
    'ADMIN_MANAGEMENT'
  );
  
  RETURN jsonb_build_object(
    'status', 'success',
    'message', 'Admin role assigned to user: ' || user_email,
    'user_id', user_uuid
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_admin_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Create notification when admin role is assigned
  IF NEW.role = 'admin' THEN
    PERFORM public.create_notification(
      NEW.user_id,
      'Admin Access Granted',
      'You now have administrator privileges on the platform.',
      'success',
      'admin'
    );
  END IF;
  
  RETURN NEW;
END;
$$;