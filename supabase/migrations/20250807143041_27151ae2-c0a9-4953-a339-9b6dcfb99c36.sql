-- Fix the missing foreign key relationship between specialists and profiles
ALTER TABLE public.specialists 
ADD CONSTRAINT specialists_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create proper relationship index for better performance
CREATE INDEX IF NOT EXISTS idx_specialists_user_id ON public.specialists(user_id);