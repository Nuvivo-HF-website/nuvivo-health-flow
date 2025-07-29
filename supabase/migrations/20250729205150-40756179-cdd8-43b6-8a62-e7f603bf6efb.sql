-- Phase 3: Advanced Features & Integrations

-- Telemedicine sessions table
CREATE TABLE public.telemedicine_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  doctor_id UUID,
  appointment_id UUID,
  session_type TEXT NOT NULL DEFAULT 'video', -- video, audio, chat
  session_url TEXT,
  room_id TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, active, completed, cancelled
  scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_start TIMESTAMP WITH TIME ZONE,
  actual_end TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  recording_url TEXT,
  session_notes TEXT,
  technical_issues TEXT,
  patient_rating INTEGER CHECK (patient_rating >= 1 AND patient_rating <= 5),
  doctor_rating INTEGER CHECK (doctor_rating >= 1 AND doctor_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Health metrics tracking
CREATE TABLE public.health_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_type TEXT NOT NULL, -- blood_pressure, weight, glucose, heart_rate, temperature, etc.
  value JSONB NOT NULL, -- flexible structure for different metric types
  unit TEXT NOT NULL,
  measured_at TIMESTAMP WITH TIME ZONE NOT NULL,
  device_source TEXT, -- manual, smartphone, wearable, medical_device
  notes TEXT,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Prescription management
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  doctor_id UUID,
  consultation_id UUID,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  quantity INTEGER,
  refills_remaining INTEGER DEFAULT 0,
  prescribed_date DATE NOT NULL,
  start_date DATE,
  end_date DATE,
  instructions TEXT,
  side_effects TEXT,
  contraindications TEXT,
  pharmacy_name TEXT,
  pharmacy_phone TEXT,
  prescription_number TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, cancelled, expired
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Care team members
CREATE TABLE public.care_team (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  provider_type TEXT NOT NULL, -- doctor, nurse, therapist, pharmacist, etc.
  relationship_type TEXT NOT NULL, -- primary_care, specialist, consultant, etc.
  is_primary BOOLEAN DEFAULT false,
  access_level TEXT DEFAULT 'view', -- view, edit, full
  added_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  removed_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Health goals and tracking
CREATE TABLE public.health_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_type TEXT NOT NULL, -- weight_loss, exercise, medication_adherence, etc.
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC,
  target_unit TEXT,
  current_value NUMERIC,
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, paused, cancelled
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_by UUID, -- can be set by doctor or patient
  reminders_enabled BOOLEAN DEFAULT true,
  reminder_frequency TEXT DEFAULT 'daily', -- daily, weekly, monthly
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Billing and invoices
CREATE TABLE public.billing_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  appointment_id UUID,
  consultation_id UUID,
  service_description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'GBP',
  tax_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, overdue, cancelled
  issued_date DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  payment_method TEXT, -- card, bank_transfer, cash, insurance
  payment_reference TEXT,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.telemedicine_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for telemedicine_sessions
CREATE POLICY "Users can view their own telemedicine sessions" 
ON public.telemedicine_sessions 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = doctor_id);

CREATE POLICY "Users can create their own telemedicine sessions" 
ON public.telemedicine_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own telemedicine sessions" 
ON public.telemedicine_sessions 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = doctor_id);

-- RLS Policies for health_metrics
CREATE POLICY "Users can view their own health metrics" 
ON public.health_metrics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health metrics" 
ON public.health_metrics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health metrics" 
ON public.health_metrics 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for prescriptions
CREATE POLICY "Users can view their own prescriptions" 
ON public.prescriptions 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = doctor_id);

CREATE POLICY "Doctors can create prescriptions" 
ON public.prescriptions 
FOR INSERT 
WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update prescriptions" 
ON public.prescriptions 
FOR UPDATE 
USING (auth.uid() = doctor_id);

-- RLS Policies for care_team
CREATE POLICY "Users can view their own care team" 
ON public.care_team 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = provider_id);

CREATE POLICY "Users can manage their own care team" 
ON public.care_team 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for health_goals
CREATE POLICY "Users can view their own health goals" 
ON public.health_goals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health goals" 
ON public.health_goals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health goals" 
ON public.health_goals 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for billing_invoices
CREATE POLICY "Users can view their own billing invoices" 
ON public.billing_invoices 
FOR SELECT 
USING (auth.uid() = user_id);

-- Triggers for updated_at columns
CREATE TRIGGER update_telemedicine_sessions_updated_at
BEFORE UPDATE ON public.telemedicine_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at
BEFORE UPDATE ON public.prescriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_goals_updated_at
BEFORE UPDATE ON public.health_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_billing_invoices_updated_at
BEFORE UPDATE ON public.billing_invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate health goal progress
CREATE OR REPLACE FUNCTION public.update_health_goal_progress(_goal_id UUID, _current_value NUMERIC)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  goal_record RECORD;
  new_progress INTEGER;
BEGIN
  SELECT target_value, target_unit INTO goal_record 
  FROM public.health_goals 
  WHERE id = _goal_id AND user_id = auth.uid();
  
  IF FOUND AND goal_record.target_value > 0 THEN
    new_progress := LEAST(100, GREATEST(0, ROUND((_current_value / goal_record.target_value) * 100)));
    
    UPDATE public.health_goals 
    SET current_value = _current_value, 
        progress_percentage = new_progress,
        updated_at = now()
    WHERE id = _goal_id AND user_id = auth.uid();
  END IF;
END;
$function$;