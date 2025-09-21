-- Add missing document URL columns to doctor_profiles table
ALTER TABLE public.doctor_profiles 
ADD COLUMN IF NOT EXISTS indemnity_document_url text,
ADD COLUMN IF NOT EXISTS dbs_pvg_document_url text;