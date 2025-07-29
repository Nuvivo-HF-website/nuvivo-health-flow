-- Add missing columns to patient_profiles table
ALTER TABLE public.patient_profiles 
ADD COLUMN address_line_1 text,
ADD COLUMN address_line_2 text,
ADD COLUMN city text,
ADD COLUMN postcode text,
ADD COLUMN country text DEFAULT 'United Kingdom';

-- Update the gender column to use the correct enum values
ALTER TABLE public.patient_profiles 
ALTER COLUMN gender TYPE text,
ADD CONSTRAINT check_gender CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));