-- Create function to create super admin account
CREATE OR REPLACE FUNCTION public.create_super_admin(
  admin_email TEXT,
  admin_password TEXT,
  admin_name TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
  result jsonb;
BEGIN
  -- This function needs to be called from an edge function since we can't create auth users directly
  -- For now, let's create a manual admin assignment function
  RETURN jsonb_build_object(
    'status', 'error',
    'message', 'Please use the edge function to create admin users'
  );
END;
$$;

-- Create function to assign admin role to existing user
CREATE OR REPLACE FUNCTION public.assign_admin_role(user_email TEXT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Enhanced RLS policies for admin access
-- Ensure admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure admins can update all profiles
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all patient profiles
DROP POLICY IF EXISTS "Admins can view all patient profiles" ON public.patient_profiles;
CREATE POLICY "Admins can view all patient profiles" 
ON public.patient_profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all patient profiles
DROP POLICY IF EXISTS "Admins can update all patient profiles" ON public.patient_profiles;
CREATE POLICY "Admins can update all patient profiles" 
ON public.patient_profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all appointments
DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;
CREATE POLICY "Admins can view all appointments" 
ON public.appointments 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all appointments
DROP POLICY IF EXISTS "Admins can manage all appointments" ON public.appointments;
CREATE POLICY "Admins can manage all appointments" 
ON public.appointments 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all test results
DROP POLICY IF EXISTS "Admins can view all test results" ON public.test_results;
CREATE POLICY "Admins can view all test results" 
ON public.test_results 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all test results
DROP POLICY IF EXISTS "Admins can manage all test results" ON public.test_results;
CREATE POLICY "Admins can manage all test results" 
ON public.test_results 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all medications
DROP POLICY IF EXISTS "Admins can view all medications" ON public.medications;
CREATE POLICY "Admins can view all medications" 
ON public.medications 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all medications
DROP POLICY IF EXISTS "Admins can manage all medications" ON public.medications;
CREATE POLICY "Admins can manage all medications" 
ON public.medications 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all consultations
DROP POLICY IF EXISTS "Admins can view all consultations" ON public.consultations;
CREATE POLICY "Admins can view all consultations" 
ON public.consultations 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all consultations
DROP POLICY IF EXISTS "Admins can manage all consultations" ON public.consultations;
CREATE POLICY "Admins can manage all consultations" 
ON public.consultations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all medical documents
DROP POLICY IF EXISTS "Admins can view all medical documents" ON public.medical_documents;
CREATE POLICY "Admins can view all medical documents" 
ON public.medical_documents 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage all medical documents" ON public.medical_documents;
CREATE POLICY "Admins can manage all medical documents" 
ON public.medical_documents 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage specialists
DROP POLICY IF EXISTS "Admins can manage all specialists" ON public.specialists;
CREATE POLICY "Admins can manage all specialists" 
ON public.specialists 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage services
DROP POLICY IF EXISTS "Admins can manage all services" ON public.services;
CREATE POLICY "Admins can manage all services" 
ON public.services 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create admin notification for successful admin creation
CREATE OR REPLACE FUNCTION public.notify_admin_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Create trigger for admin notifications
DROP TRIGGER IF EXISTS notify_admin_role_assigned ON public.user_roles;
CREATE TRIGGER notify_admin_role_assigned
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_created();