import { supabase } from '@/integrations/supabase/client'

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string            // signed url (short-lived)
  path: string           // storage key: test-results/{userId}/{...}
  uploadedAt: string
}

const BUCKET = 'medical-documents'            // make sure this bucket exists and is PRIVATE
const ROOT   = 'test-results'                  // folder prefix inside the bucket
const MAX_SIZE = 10 * 1024 * 1024              // 10 MB
const ALLOWED = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
])

export class FileUploadService {
  static async uploadMedicalDocument(
    file: File,
    userId: string
  ): Promise<{ data: UploadedFile | null; error: string | null }> {
    try {
      // --- Guards ---
      if (!ALLOWED.has(file.type)) {
        return { data: null, error: `Unsupported file type: ${file.type}` }
      }
      if (file.size > MAX_SIZE) {
        return { data: null, error: `File too large (> ${Math.round(MAX_SIZE / 1024 / 1024)}MB)` }
      }

      // Object key is user-scoped for Storage RLS
      const ext = file.name.split('.').pop() ?? 'bin'
      const safeBase = file.name.replace(/\s+/g, '_').replace(/[^\w.\-]/g, '')
      const key = `${ROOT}/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${safeBase}.${ext}`

      // Upload with explicit contentType
      const { error: uploadError } = await supabase
        .storage
        .from(BUCKET)
        .upload(key, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return { data: null, error: uploadError.message }
      }

      // Generate a short-lived signed URL (private bucket)
      const { data: signed, error: signErr } = await supabase
        .storage
        .from(BUCKET)
        .createSignedUrl(key, 60 * 30) // 30 min

      if (signErr || !signed?.signedUrl) {
        return { data: null, error: signErr?.message ?? 'Failed to sign URL' }
      }

      const uploaded: UploadedFile = {
        id: key,                                 // stable unique id for UI
        name: file.name,
        size: file.size,
        type: file.type,
        url: signed.signedUrl,
        path: key,
        uploadedAt: new Date().toISOString(),
      }

      return { data: uploaded, error: null }
    } catch (e: any) {
      console.error('File upload service error:', e)
      return { data: null, error: e?.message ?? 'Unknown upload error' }
    }
  }

  static async deleteFile(filePath: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.storage.from(BUCKET).remove([filePath])
      return { error: error?.message ?? null }
    } catch (e: any) {
      return { error: e?.message ?? 'Unknown delete error' }
    }
  }

  static async getUserFiles(userId: string): Promise<{ data: UploadedFile[] | null; error: string | null }> {
    try {
      const prefix = `${ROOT}/${userId}`
      const { data: files, error } = await supabase.storage.from(BUCKET).list(prefix, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      })
      if (error) return { data: null, error: error.message }

      // Build signed URL per file (short-lived, GDPR-safe)
      const out: UploadedFile[] = []
      for (const f of files ?? []) {
        const fullPath = `${prefix}/${f.name}`
        const { data: signed, error: signErr } = await supabase
          .storage
          .from(BUCKET)
          .createSignedUrl(fullPath, 60 * 30) // 30 min
        if (signErr) {
          console.warn('Signed URL error for', fullPath, signErr)
          continue
        }
        out.push({
          id: fullPath,
          name: f.name,
          size: (f as any)?.metadata?.size ?? 0,
          type: (f as any)?.metadata?.mimetype ?? 'application/octet-stream',
          url: signed!.signedUrl!,
          path: fullPath,
          uploadedAt: (f as any)?.created_at ?? new Date().toISOString(),
        })
      }

      return { data: out, error: null }
    } catch (e: any) {
      return { data: null, error: e?.message ?? 'Unknown error retrieving files' }
    }
  }
}

export default FileUploadService
