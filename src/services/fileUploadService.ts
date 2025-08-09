import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/EnhancedAuthContext';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
  uploadedAt: string;
}

export class FileUploadService {
  static async uploadMedicalDocument(
    file: File, 
    userId: string, 
    folder = 'test-results'
  ): Promise<{ data: UploadedFile | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${userId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return { data: null, error: uploadError.message };
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('medical-documents')
        .getPublicUrl(fileName);

      const uploadedFile: UploadedFile = {
        id: uploadData.path,
        name: file.name,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
        path: uploadData.path,
        uploadedAt: new Date().toISOString()
      };

      return { data: uploadedFile, error: null };
    } catch (error: any) {
      console.error('File upload service error:', error);
      return { data: null, error: error.message || 'Unknown upload error' };
    }
  }

  static async deleteFile(filePath: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.storage
        .from('medical-documents')
        .remove([filePath]);

      return { error: error?.message || null };
    } catch (error: any) {
      return { error: error.message || 'Unknown delete error' };
    }
  }

  static async getUserFiles(userId: string): Promise<{ data: UploadedFile[] | null; error: string | null }> {
    try {
      const { data: files, error } = await supabase.storage
        .from('medical-documents')
        .list(`test-results/${userId}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        return { data: null, error: error.message };
      }

      const uploadedFiles: UploadedFile[] = files.map(file => ({
        id: file.name,
        name: file.name,
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || 'application/octet-stream',
        url: supabase.storage.from('medical-documents').getPublicUrl(`test-results/${userId}/${file.name}`).data.publicUrl,
        path: `test-results/${userId}/${file.name}`,
        uploadedAt: file.created_at || new Date().toISOString()
      }));

      return { data: uploadedFiles, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error retrieving files' };
    }
  }
}

export default FileUploadService;