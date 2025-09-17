-- Create clinics table for registered clinic partners
CREATE TABLE public.clinics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  clinic_name TEXT NOT NULL,
  clinic_type TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  region TEXT NOT NULL,
  phone TEXT NOT NULL,
  nhs_number TEXT,
  operating_hours TEXT,
  services_offered TEXT[] DEFAULT '{}',
  facilities TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  staff_count INTEGER,
  description TEXT,
  rating DECIMAL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  latitude DECIMAL,
  longitude DECIMAL,
  registration_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on clinics table
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clinics
CREATE POLICY "Everyone can view active verified clinics" 
ON public.clinics 
FOR SELECT 
USING (is_active = true AND is_verified = true);

CREATE POLICY "Clinic staff can manage their own clinic" 
ON public.clinics 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all clinics" 
ON public.clinics 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update updated_at timestamp
CREATE TRIGGER update_clinics_updated_at
BEFORE UPDATE ON public.clinics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update specialists table to include more marketplace fields if needed
ALTER TABLE public.specialists 
ADD COLUMN IF NOT EXISTS clinic_name TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS rating DECIMAL DEFAULT 0,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS registration_number TEXT;