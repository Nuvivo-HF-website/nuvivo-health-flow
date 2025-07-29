-- Create comprehensive patient portal tables

-- 1. Test Results table
CREATE TABLE public.test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_type VARCHAR(100) NOT NULL,
  test_name VARCHAR(200) NOT NULL,
  test_date DATE NOT NULL,
  result_values JSONB NOT NULL DEFAULT '{}',
  reference_ranges JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'in_progress', 'cancelled')),
  result_status VARCHAR(50) DEFAULT 'normal' CHECK (result_status IN ('normal', 'abnormal', 'critical', 'pending')),
  clinic_name VARCHAR(200),
  doctor_name VARCHAR(200),
  doctor_notes TEXT,
  ai_summary TEXT,
  file_url TEXT,
  order_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Doctor Consultations table
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES auth.users(id),
  consultation_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  notes TEXT,
  doctor_notes TEXT,
  prescription TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  meeting_link TEXT,
  symptoms TEXT,
  diagnosis TEXT,
  treatment_plan TEXT,
  fee DECIMAL(10,2),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Medical Documents table
CREATE TABLE public.medical_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL,
  document_name VARCHAR(200) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(50),
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  is_test_result BOOLEAN DEFAULT false,
  test_result_id UUID REFERENCES public.test_results(id),
  consultation_id UUID REFERENCES public.consultations(id),
  uploaded_by_doctor BOOLEAN DEFAULT false,
  doctor_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Medications table
CREATE TABLE public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_name VARCHAR(200) NOT NULL,
  dosage VARCHAR(100),
  frequency VARCHAR(100),
  prescribed_by VARCHAR(200),
  prescription_date DATE,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'discontinued')),
  notes TEXT,
  side_effects TEXT,
  consultation_id UUID REFERENCES public.consultations(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Appointments table (for scheduling)
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES auth.users(id),
  appointment_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  location VARCHAR(200),
  meeting_link TEXT,
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  fee DECIMAL(10,2),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for test_results
CREATE POLICY "Users can view their own test results"
ON public.test_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own test results"
ON public.test_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test results"
ON public.test_results FOR UPDATE
USING (auth.uid() = user_id);

-- Create RLS policies for consultations
CREATE POLICY "Users can view their own consultations"
ON public.consultations FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = doctor_id);

CREATE POLICY "Users can create their own consultations"
ON public.consultations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consultations"
ON public.consultations FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() = doctor_id);

-- Create RLS policies for medical_documents
CREATE POLICY "Users can view their own documents"
ON public.medical_documents FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = doctor_id);

CREATE POLICY "Users can create their own documents"
ON public.medical_documents FOR INSERT
WITH CHECK (auth.uid() = user_id OR auth.uid() = doctor_id);

CREATE POLICY "Users can update their own documents"
ON public.medical_documents FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() = doctor_id);

-- Create RLS policies for medications
CREATE POLICY "Users can view their own medications"
ON public.medications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medications"
ON public.medications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medications"
ON public.medications FOR UPDATE
USING (auth.uid() = user_id);

-- Create RLS policies for appointments
CREATE POLICY "Users can view their own appointments"
ON public.appointments FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = doctor_id);

CREATE POLICY "Users can create their own appointments"
ON public.appointments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
ON public.appointments FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() = doctor_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_test_results_updated_at
BEFORE UPDATE ON public.test_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at
BEFORE UPDATE ON public.consultations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_documents_updated_at
BEFORE UPDATE ON public.medical_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medications_updated_at
BEFORE UPDATE ON public.medications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_test_results_user_id ON public.test_results(user_id);
CREATE INDEX idx_test_results_test_date ON public.test_results(test_date DESC);
CREATE INDEX idx_consultations_user_id ON public.consultations(user_id);
CREATE INDEX idx_consultations_doctor_id ON public.consultations(doctor_id);
CREATE INDEX idx_consultations_appointment_date ON public.consultations(appointment_date);
CREATE INDEX idx_medical_documents_user_id ON public.medical_documents(user_id);
CREATE INDEX idx_medications_user_id ON public.medications(user_id);
CREATE INDEX idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);