-- Add clinic_staff role to the app_role enum
ALTER TYPE app_role ADD VALUE 'clinic_staff';

-- Update RLS policies to include clinic_staff wherever doctor privileges are granted

-- Update specialists table policies
DROP POLICY IF EXISTS "Admins can manage all specialists" ON specialists;
CREATE POLICY "Admins can manage all specialists" 
ON specialists 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Specialists can manage their own profile" ON specialists;
CREATE POLICY "Specialists can manage their own profile" 
ON specialists 
FOR ALL 
USING (user_id = auth.uid());

-- Update results table policies to include clinic_staff
DROP POLICY IF EXISTS "Admins and doctors can manage all results" ON results;
CREATE POLICY "Admins, doctors and clinic staff can manage all results" 
ON results 
FOR ALL 
USING (auth.uid() IN (
  SELECT user_roles.user_id
  FROM user_roles
  WHERE user_roles.role = ANY (ARRAY['admin'::app_role, 'doctor'::app_role, 'clinic_staff'::app_role])
));

DROP POLICY IF EXISTS "Staff can view all results with AI flags" ON results;
CREATE POLICY "Staff can view all results with AI flags" 
ON results 
FOR SELECT 
USING (auth.uid() IN (
  SELECT user_roles.user_id
  FROM user_roles
  WHERE user_roles.role = ANY (ARRAY['admin'::app_role, 'doctor'::app_role, 'clinic_staff'::app_role])
));

-- Update ai_review_logs policies
DROP POLICY IF EXISTS "Staff can create review logs" ON ai_review_logs;
CREATE POLICY "Staff can create review logs" 
ON ai_review_logs 
FOR INSERT 
WITH CHECK (auth.uid() IN (
  SELECT user_roles.user_id
  FROM user_roles
  WHERE user_roles.role = ANY (ARRAY['admin'::app_role, 'doctor'::app_role, 'clinic_staff'::app_role])
));

DROP POLICY IF EXISTS "Staff can view review logs" ON ai_review_logs;
CREATE POLICY "Staff can view review logs" 
ON ai_review_logs 
FOR SELECT 
USING (auth.uid() IN (
  SELECT user_roles.user_id
  FROM user_roles
  WHERE user_roles.role = ANY (ARRAY['admin'::app_role, 'doctor'::app_role, 'clinic_staff'::app_role])
));

-- Update ai_logs policies
DROP POLICY IF EXISTS "Admins and doctors can view all AI logs" ON ai_logs;
CREATE POLICY "Admins, doctors and clinic staff can view all AI logs" 
ON ai_logs 
FOR SELECT 
USING (auth.uid() IN (
  SELECT user_roles.user_id
  FROM user_roles
  WHERE user_roles.role = ANY (ARRAY['admin'::app_role, 'doctor'::app_role, 'clinic_staff'::app_role])
));

-- Update prescriptions policies
DROP POLICY IF EXISTS "Doctors can create prescriptions" ON prescriptions;
CREATE POLICY "Doctors and clinic staff can create prescriptions" 
ON prescriptions 
FOR INSERT 
WITH CHECK (auth.uid() = doctor_id AND auth.uid() IN (
  SELECT user_roles.user_id 
  FROM user_roles 
  WHERE user_roles.role = ANY (ARRAY['doctor'::app_role, 'clinic_staff'::app_role])
));

DROP POLICY IF EXISTS "Doctors can update prescriptions" ON prescriptions;
CREATE POLICY "Doctors and clinic staff can update prescriptions" 
ON prescriptions 
FOR UPDATE 
USING (auth.uid() = doctor_id AND auth.uid() IN (
  SELECT user_roles.user_id 
  FROM user_roles 
  WHERE user_roles.role = ANY (ARRAY['doctor'::app_role, 'clinic_staff'::app_role])
));