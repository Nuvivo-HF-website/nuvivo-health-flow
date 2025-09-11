-- Create doctor_profiles table
CREATE TABLE public.doctor_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  specialty TEXT,
  qualification TEXT,
  license_number TEXT,
  years_of_experience INTEGER,
  phone TEXT,
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  postcode TEXT,
  country TEXT DEFAULT 'United Kingdom',
  clinic_name TEXT,
  clinic_address TEXT,
  consultation_fee NUMERIC,
  available_hours JSONB DEFAULT '{"start": "09:00", "end": "17:00"}'::jsonb,
  available_days TEXT[] DEFAULT '{monday,tuesday,wednesday,thursday,friday}'::text[],
  bio TEXT,
  languages TEXT[] DEFAULT '{English}'::text[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for doctor profile access
CREATE POLICY "Doctors can view their own profile" 
ON public.doctor_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Doctors can create their own profile" 
ON public.doctor_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can update their own profile" 
ON public.doctor_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all doctor profiles" 
ON public.doctor_profiles 
FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

CREATE POLICY "Admins can update all doctor profiles" 
ON public.doctor_profiles 
FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_doctor_profiles_updated_at
BEFORE UPDATE ON public.doctor_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();