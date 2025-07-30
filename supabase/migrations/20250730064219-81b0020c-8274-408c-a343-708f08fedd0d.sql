-- Create services table for all available services
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- e.g., 'blood_tests', 'consultations', 'scans', 'treatments'
  duration_minutes INTEGER DEFAULT 30,
  base_price NUMERIC(10,2),
  preparation_required BOOLEAN DEFAULT false,
  preparation_instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policy for services (everyone can view active services)
CREATE POLICY "Everyone can view active services" 
ON public.services 
FOR SELECT 
USING (is_active = true);

-- Create specialist_services junction table
CREATE TABLE public.specialist_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  specialist_id UUID NOT NULL REFERENCES specialists(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  custom_price NUMERIC(10,2), -- specialists can set custom pricing
  custom_duration INTEGER, -- or custom duration
  is_available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(specialist_id, service_id)
);

-- Enable RLS
ALTER TABLE public.specialist_services ENABLE ROW LEVEL SECURITY;

-- Create policies for specialist_services
CREATE POLICY "Everyone can view available specialist services" 
ON public.specialist_services 
FOR SELECT 
USING (is_available = true);

CREATE POLICY "Specialists can manage their own services" 
ON public.specialist_services 
FOR ALL 
USING (specialist_id IN (
  SELECT id FROM specialists WHERE user_id = auth.uid()
));

-- Insert some common services
INSERT INTO public.services (name, description, category, duration_minutes, base_price, preparation_required, preparation_instructions) VALUES
-- Blood Tests
('Full Blood Count (FBC)', 'Complete blood count including red cells, white cells, and platelets', 'blood_tests', 15, 45.00, true, 'Fasting not required. Stay hydrated.'),
('Lipid Profile', 'Cholesterol and triglyceride levels', 'blood_tests', 15, 55.00, true, 'Fast for 12 hours before the test.'),
('Liver Function Test', 'Tests to check liver health and function', 'blood_tests', 15, 50.00, true, 'Avoid alcohol 24 hours before the test.'),
('Kidney Function Test', 'Tests to assess kidney health', 'blood_tests', 15, 50.00, false, 'Stay well hydrated.'),
('Thyroid Function Test', 'TSH, T3, T4 levels to assess thyroid function', 'blood_tests', 15, 65.00, false, 'Take medication after the test if prescribed.'),
('Diabetes Screen (HbA1c)', 'Long-term blood sugar control assessment', 'blood_tests', 15, 40.00, false, 'No fasting required.'),
('Vitamin D Test', 'Vitamin D levels assessment', 'blood_tests', 15, 35.00, false, 'No special preparation required.'),
('Iron Studies', 'Iron levels and iron deficiency assessment', 'blood_tests', 15, 45.00, true, 'Fasting for 12 hours recommended.'),

-- Consultations
('General Consultation', 'General health consultation with a specialist', 'consultations', 30, 120.00, false, 'Bring any relevant medical records.'),
('Mental Health Consultation', 'Consultation with mental health specialist', 'consultations', 45, 150.00, false, 'Prepare to discuss your concerns openly.'),
('Nutritional Consultation', 'Dietary and nutrition guidance', 'consultations', 45, 100.00, false, 'Keep a food diary for 3 days before consultation.'),
('Sexual Health Consultation', 'Confidential sexual health consultation', 'consultations', 30, 130.00, false, 'All consultations are completely confidential.'),
('Second Opinion', 'Get a second medical opinion', 'consultations', 45, 180.00, false, 'Bring all relevant test results and medical records.'),

-- Scans and Imaging
('ECG (Electrocardiogram)', 'Heart rhythm and electrical activity test', 'scans', 20, 80.00, false, 'Wear comfortable clothing. Avoid caffeine 2 hours before.'),
('Cancer Screening', 'Various cancer screening tests', 'scans', 60, 200.00, true, 'Follow specific preparation instructions based on screening type.'),
('Ultrasound Scan', 'Non-invasive imaging using sound waves', 'scans', 30, 150.00, true, 'Preparation varies by scan type - we will provide specific instructions.'),
('X-Ray', 'Basic X-ray imaging', 'scans', 15, 70.00, false, 'Remove jewelry and metal objects.'),

-- Treatments
('Physiotherapy Session', 'Physical therapy and rehabilitation', 'treatments', 60, 80.00, false, 'Wear comfortable, loose-fitting clothing.'),
('Vaccination', 'Various vaccinations and immunizations', 'treatments', 15, 25.00, false, 'Inform us of any allergies or previous adverse reactions.'),
('Minor Surgery', 'Minor surgical procedures', 'treatments', 90, 300.00, true, 'Fasting may be required. Detailed instructions will be provided.'),
('Health Check-up', 'Comprehensive health assessment', 'treatments', 60, 200.00, true, 'Fast for 12 hours. Bring list of current medications.');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_specialist_services_updated_at
BEFORE UPDATE ON public.specialist_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();