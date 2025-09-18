-- Create provider_documents bucket for doctor profiles
INSERT INTO storage.buckets (id, name, public) 
VALUES ('provider_documents', 'provider_documents', true);

-- Create RLS policies for provider_documents bucket
CREATE POLICY "Users can view their own provider documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'provider_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own provider documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'provider_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own provider documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'provider_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own provider documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'provider_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public access to avatars specifically (since bucket is public)
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'provider_documents' AND (storage.foldername(name))[2] LIKE 'avatar%');