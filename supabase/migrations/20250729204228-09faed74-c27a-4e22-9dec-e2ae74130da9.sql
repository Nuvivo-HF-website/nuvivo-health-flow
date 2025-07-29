-- Fix RLS security warning
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;

-- Create policy for document categories (publicly readable)
CREATE POLICY "Everyone can view document categories" ON public.document_categories
  FOR SELECT USING (true);