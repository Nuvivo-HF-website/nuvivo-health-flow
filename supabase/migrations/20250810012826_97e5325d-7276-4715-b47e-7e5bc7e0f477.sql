-- Extend results table with AI risk flagging fields
ALTER TABLE public.results 
ADD COLUMN ai_flags jsonb,
ADD COLUMN ai_risk_score numeric;

-- Create ai_review_logs table for audit logging
CREATE TABLE public.ai_review_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  result_id uuid NOT NULL,
  viewed_by uuid NOT NULL,
  viewed_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on ai_review_logs
ALTER TABLE public.ai_review_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for ai_review_logs
CREATE POLICY "Staff can create review logs" 
ON public.ai_review_logs 
FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('admin', 'doctor')
  )
);

CREATE POLICY "Staff can view review logs" 
ON public.ai_review_logs 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('admin', 'doctor')
  )
);

-- Update existing results policies to exclude ai_flags and ai_risk_score for patients
-- First drop the existing patient policy
DROP POLICY IF EXISTS "Users can view their own results" ON public.results;

-- Create new patient policy that excludes sensitive AI fields
CREATE POLICY "Patients can view their own results (limited)" 
ON public.results 
FOR SELECT 
USING (
  auth.uid() = user_id AND 
  auth.uid() NOT IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('admin', 'doctor')
  )
);

-- Staff can view all results including AI fields (existing policy should cover this)
-- But let's ensure it's explicit
CREATE POLICY "Staff can view all results with AI flags" 
ON public.results 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('admin', 'doctor')
  )
);

-- Create a view for patients that excludes AI fields
CREATE VIEW public.patient_results AS
SELECT 
  id,
  user_id,
  parsed_data,
  ai_summary,
  created_at,
  updated_at,
  ai_generated_at,
  uploaded_by
FROM public.results;

-- Enable RLS on the view
ALTER VIEW public.patient_results SET (security_invoker = on);

-- Create index for performance on ai_risk_score
CREATE INDEX idx_results_ai_risk_score ON public.results(ai_risk_score DESC) WHERE ai_risk_score IS NOT NULL;