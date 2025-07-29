-- Phase 2: Enhanced Medical Records and Appointment System

-- Enhanced test results with AI interpretation
ALTER TABLE public.test_results 
  ADD COLUMN IF NOT EXISTS ai_interpretation JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS report_pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS comparison_notes TEXT,
  ADD COLUMN IF NOT EXISTS flagged_values JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS doctor_reviewed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS review_date TIMESTAMP WITH TIME ZONE;

-- Create specialists table
CREATE TABLE public.specialists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  specialty TEXT NOT NULL,
  qualifications TEXT[],
  experience_years INTEGER,
  bio TEXT,
  consultation_fee DECIMAL(10,2),
  available_days TEXT[] DEFAULT '{"monday","tuesday","wednesday","thursday","friday"}',
  available_hours JSONB DEFAULT '{"start": "09:00", "end": "17:00"}',
  consultation_duration INTEGER DEFAULT 30, -- minutes
  booking_advance_days INTEGER DEFAULT 14,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on specialists
ALTER TABLE public.specialists ENABLE ROW LEVEL SECURITY;

-- Create specialist availability table
CREATE TABLE public.specialist_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specialist_id UUID REFERENCES public.specialists(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  reason TEXT, -- for unavailability
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(specialist_id, date, start_time)
);

-- Enable RLS on specialist_availability
ALTER TABLE public.specialist_availability ENABLE ROW LEVEL SECURITY;

-- Enhanced appointments with specialist booking
ALTER TABLE public.appointments 
  ADD COLUMN IF NOT EXISTS specialist_id UUID REFERENCES public.specialists(id),
  ADD COLUMN IF NOT EXISTS consultation_type TEXT,
  ADD COLUMN IF NOT EXISTS booking_source TEXT DEFAULT 'patient_portal',
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
  ADD COLUMN IF NOT EXISTS reschedule_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS preparation_instructions TEXT,
  ADD COLUMN IF NOT EXISTS follow_up_required BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  ADD COLUMN IF NOT EXISTS feedback TEXT;

-- Create appointment history table for tracking changes
CREATE TABLE public.appointment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL, -- 'created', 'rescheduled', 'cancelled', 'completed'
  old_date TIMESTAMP WITH TIME ZONE,
  new_date TIMESTAMP WITH TIME ZONE,
  reason TEXT,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on appointment_history
ALTER TABLE public.appointment_history ENABLE ROW LEVEL SECURITY;

-- Create medical document categories
CREATE TABLE public.document_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  parent_category_id UUID REFERENCES public.document_categories(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default document categories
INSERT INTO public.document_categories (name, description, icon, color) VALUES
('Blood Tests', 'Laboratory blood test results', 'test-tube', '#ef4444'),
('Imaging', 'X-rays, MRI, CT scans, ultrasounds', 'scan-line', '#3b82f6'),
('Consultations', 'Doctor consultation notes and reports', 'stethoscope', '#22c55e'),
('Prescriptions', 'Medication prescriptions and pharmacy records', 'pill', '#f59e0b'),
('Vaccinations', 'Immunization records and certificates', 'shield-plus', '#8b5cf6'),
('Medical History', 'Previous medical records and referrals', 'file-medical', '#6b7280'),
('Insurance', 'Insurance documents and claims', 'file-shield', '#0891b2');

-- Enhanced medical documents with categories
ALTER TABLE public.medical_documents 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.document_categories(id),
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  ADD COLUMN IF NOT EXISTS expiry_date DATE,
  ADD COLUMN IF NOT EXISTS version_number INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS parent_document_id UUID REFERENCES public.medical_documents(id),
  ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_accessed TIMESTAMP WITH TIME ZONE;

-- Create document sharing table (for sharing between patient and doctors)
CREATE TABLE public.document_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.medical_documents(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES auth.users(id) NOT NULL,
  shared_with UUID REFERENCES auth.users(id) NOT NULL,
  permission_level TEXT DEFAULT 'view' CHECK (permission_level IN ('view', 'comment', 'edit')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(document_id, shared_with)
);

-- Enable RLS on document_shares
ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;

-- Create notifications table for patient portal
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  category TEXT DEFAULT 'general',
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  action_label TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for specialists
CREATE POLICY "Specialists can manage their own profile" ON public.specialists
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Everyone can view active specialists" ON public.specialists
  FOR SELECT USING (is_active = true);

-- RLS Policies for specialist_availability  
CREATE POLICY "Specialists can manage their availability" ON public.specialist_availability
  FOR ALL USING (
    specialist_id IN (
      SELECT id FROM public.specialists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Everyone can view specialist availability" ON public.specialist_availability
  FOR SELECT USING (is_available = true);

-- RLS Policies for appointment_history
CREATE POLICY "Users can view their appointment history" ON public.appointment_history
  FOR SELECT USING (
    appointment_id IN (
      SELECT id FROM public.appointments WHERE user_id = auth.uid() OR doctor_id = auth.uid()
    )
  );

-- RLS Policies for document_shares
CREATE POLICY "Users can manage documents shared with them" ON public.document_shares
  FOR SELECT USING (shared_with = auth.uid() OR shared_by = auth.uid());

CREATE POLICY "Users can create document shares" ON public.document_shares
  FOR INSERT WITH CHECK (shared_by = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Function to create notifications
CREATE OR REPLACE FUNCTION public.create_notification(
  _user_id UUID,
  _title TEXT,
  _message TEXT,
  _type TEXT DEFAULT 'info',
  _category TEXT DEFAULT 'general',
  _action_url TEXT DEFAULT NULL,
  _action_label TEXT DEFAULT NULL,
  _data JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id, title, message, type, category, action_url, action_label, data
  ) VALUES (
    _user_id, _title, _message, _type, _category, _action_url, _action_label, _data
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Function to get user's upcoming appointments
CREATE OR REPLACE FUNCTION public.get_upcoming_appointments(_user_id UUID)
RETURNS TABLE(
  id UUID,
  appointment_date TIMESTAMP WITH TIME ZONE,
  appointment_type TEXT,
  status TEXT,
  specialist_name TEXT,
  specialist_specialty TEXT,
  duration_minutes INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    a.id,
    a.appointment_date,
    a.appointment_type,
    a.status,
    p.full_name as specialist_name,
    s.specialty as specialist_specialty,
    a.duration_minutes
  FROM public.appointments a
  LEFT JOIN public.specialists s ON a.specialist_id = s.id
  LEFT JOIN public.profiles p ON s.user_id = p.user_id
  WHERE a.user_id = _user_id 
    AND a.appointment_date > now()
    AND a.status != 'cancelled'
  ORDER BY a.appointment_date ASC;
$$;

-- Trigger to log appointment changes
CREATE OR REPLACE FUNCTION public.log_appointment_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.appointment_history (appointment_id, action, new_date, changed_by)
    VALUES (NEW.id, 'created', NEW.appointment_date, NEW.user_id);
    
    -- Create notification for new appointment
    PERFORM public.create_notification(
      NEW.user_id,
      'Appointment Scheduled',
      'Your appointment has been scheduled for ' || to_char(NEW.appointment_date, 'DD/MM/YYYY at HH24:MI'),
      'success',
      'appointments',
      '/my-bookings',
      'View Details'
    );
    
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.appointment_date != NEW.appointment_date THEN
      INSERT INTO public.appointment_history (appointment_id, action, old_date, new_date, changed_by)
      VALUES (NEW.id, 'rescheduled', OLD.appointment_date, NEW.appointment_date, auth.uid());
      
      -- Create notification for rescheduled appointment
      PERFORM public.create_notification(
        NEW.user_id,
        'Appointment Rescheduled',
        'Your appointment has been rescheduled to ' || to_char(NEW.appointment_date, 'DD/MM/YYYY at HH24:MI'),
        'info',
        'appointments',
        '/my-bookings',
        'View Details'
      );
    END IF;
    
    IF OLD.status != NEW.status AND NEW.status = 'cancelled' THEN
      INSERT INTO public.appointment_history (appointment_id, action, reason, changed_by)
      VALUES (NEW.id, 'cancelled', NEW.cancellation_reason, auth.uid());
      
      -- Create notification for cancelled appointment
      PERFORM public.create_notification(
        NEW.user_id,
        'Appointment Cancelled',
        'Your appointment scheduled for ' || to_char(NEW.appointment_date, 'DD/MM/YYYY at HH24:MI') || ' has been cancelled',
        'warning',
        'appointments',
        '/booking',
        'Book New Appointment'
      );
    END IF;
    
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for appointment changes
CREATE TRIGGER appointment_changes_trigger
  AFTER INSERT OR UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.log_appointment_changes();