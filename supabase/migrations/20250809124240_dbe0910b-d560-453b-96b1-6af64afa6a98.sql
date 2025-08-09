-- Add AI consent to profiles table
ALTER TABLE public.profiles 
ADD COLUMN ai_consent boolean DEFAULT false;

-- Create results table for blood test data
CREATE TABLE public.results (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  uploaded_by uuid,
  parsed_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_summary text,
  ai_generated_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create AI logs table for audit trail
CREATE TABLE public.ai_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  result_id uuid NOT NULL,
  model text NOT NULL,
  response_snippet text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for results table
CREATE POLICY "Users can view their own results" 
ON public.results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own results" 
ON public.results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own results" 
ON public.results 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins and doctors can manage all results" 
ON public.results 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('admin', 'doctor')
  )
);

-- RLS policies for ai_logs table
CREATE POLICY "Users can view logs for their results" 
ON public.ai_logs 
FOR SELECT 
USING (
  result_id IN (
    SELECT id FROM public.results WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins and doctors can view all AI logs" 
ON public.ai_logs 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('admin', 'doctor')
  )
);

-- Add foreign key constraints
ALTER TABLE public.results 
ADD CONSTRAINT fk_results_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.results 
ADD CONSTRAINT fk_results_uploaded_by 
FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.ai_logs 
ADD CONSTRAINT fk_ai_logs_result_id 
FOREIGN KEY (result_id) REFERENCES public.results(id) ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX idx_results_user_id ON public.results(user_id);
CREATE INDEX idx_results_ai_generated_at ON public.results(ai_generated_at);
CREATE INDEX idx_ai_logs_result_id ON public.ai_logs(result_id);
CREATE INDEX idx_ai_logs_created_at ON public.ai_logs(created_at);

-- Add trigger for updated_at on results
CREATE TRIGGER update_results_updated_at
BEFORE UPDATE ON public.results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();