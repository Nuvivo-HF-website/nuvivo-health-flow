import { supabase } from '@/lib/supabase'

export interface FileUpload {
  id: string
  user_id: string
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  file_category: 'medical_report' | 'test_result' | 'prescription' | 'referral' | 'insurance' | 'other'
  upload_date: string
  description?: string
  is_shared: boolean
  shared_with?: string[]
  metadata?: any
}

export interface UploadProgress {
  fileName: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

export const fileStorageService = {
  // File Upload
  async uploadFile(
    file: File, 
    userId: string, 
    category: FileUpload['file_category'],
    description?: string,
    onProgress?: (progress: number) => void
  ) {
    try {
      // Generate unique file path
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${category}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('medical-files')
        .getPublicUrl(fileName)

      // Save file metadata to database
      const { data: fileRecord, error: dbError } = await supabase
        .from('file_uploads')
        .insert({
          user_id: userId,
          file_name: file.name,
          file_path: fileName,
          file_size: file.size,
          file_type: file.type,
          file_category: category,
          upload_date: new Date().toISOString(),
          description: description,
          is_shared: false,
          metadata: {
            original_name: file.name,
            public_url: urlData.publicUrl
          }
        })
        .select()
        .single()

      if (dbError) throw dbError

      return { data: fileRecord, error: null, publicUrl: urlData.publicUrl }
    } catch (error: any) {
      return { data: null, error: error.message, publicUrl: null }
    }
  },

  // Get User Files
  async getUserFiles(userId: string, category?: FileUpload['file_category']) {
    let query = supabase
      .from('file_uploads')
      .select('*')
      .eq('user_id', userId)

    if (category) {
      query = query.eq('file_category', category)
    }

    const { data, error } = await query.order('upload_date', { ascending: false })
    return { data, error }
  },

  // Get File by ID
  async getFileById(fileId: string) {
    const { data, error } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('id', fileId)
      .single()

    return { data, error }
  },

  // Get File URL
  async getFileUrl(filePath: string) {
    const { data } = supabase.storage
      .from('medical-files')
      .getPublicUrl(filePath)

    return data.publicUrl
  },

  // Download File
  async downloadFile(filePath: string) {
    const { data, error } = await supabase.storage
      .from('medical-files')
      .download(filePath)

    return { data, error }
  },

  // Delete File
  async deleteFile(fileId: string) {
    try {
      // Get file record first
      const { data: fileRecord, error: fetchError } = await this.getFileById(fileId)
      if (fetchError || !fileRecord) throw new Error('File not found')

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('medical-files')
        .remove([fileRecord.file_path])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('file_uploads')
        .delete()
        .eq('id', fileId)

      if (dbError) throw dbError

      return { data: true, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Share File
  async shareFile(fileId: string, shareWithEmails: string[]) {
    const { data, error } = await supabase
      .from('file_uploads')
      .update({
        is_shared: true,
        shared_with: shareWithEmails
      })
      .eq('id', fileId)
      .select()
      .single()

    return { data, error }
  },

  // Update File Description
  async updateFileDescription(fileId: string, description: string) {
    const { data, error } = await supabase
      .from('file_uploads')
      .update({ description })
      .eq('id', fileId)
      .select()
      .single()

    return { data, error }
  },

  // Search Files
  async searchFiles(userId: string, searchTerm: string) {
    const { data, error } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('user_id', userId)
      .or(`file_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('upload_date', { ascending: false })

    return { data, error }
  },

  // Get Files by Category Stats
  async getFileStats(userId: string) {
    const { data: files, error } = await this.getUserFiles(userId)
    
    if (error) return { data: null, error }

    const stats = {
      total: files?.length || 0,
      by_category: {
        medical_report: files?.filter(f => f.file_category === 'medical_report').length || 0,
        test_result: files?.filter(f => f.file_category === 'test_result').length || 0,
        prescription: files?.filter(f => f.file_category === 'prescription').length || 0,
        referral: files?.filter(f => f.file_category === 'referral').length || 0,
        insurance: files?.filter(f => f.file_category === 'insurance').length || 0,
        other: files?.filter(f => f.file_category === 'other').length || 0,
      },
      total_size: files?.reduce((sum, f) => sum + f.file_size, 0) || 0,
      recent_uploads: files?.slice(0, 5) || []
    }

    return { data: stats, error: null }
  },

  // Validate File Type
  validateFile(file: File, category: FileUpload['file_category']) {
    const allowedTypes = {
      medical_report: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
      test_result: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'text/csv', 'application/vnd.ms-excel'],
      prescription: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
      referral: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
      insurance: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
      other: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'text/plain', 'application/msword']
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    
    if (!allowedTypes[category].includes(file.type)) {
      return { isValid: false, error: 'File type not allowed for this category' }
    }

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size exceeds 10MB limit' }
    }

    return { isValid: true, error: null }
  }
}