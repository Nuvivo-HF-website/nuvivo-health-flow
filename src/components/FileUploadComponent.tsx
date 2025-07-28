import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/contexts/AuthContext'
import { fileStorageService, FileUpload } from '@/services/fileStorageService'
import { toast } from '@/hooks/use-toast'
import { Upload, File, X, CheckCircle, AlertCircle, FileText, Image } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface FileUploadComponentProps {
  onUploadComplete?: (file: FileUpload) => void
  acceptedCategories?: FileUpload['file_category'][]
  maxFiles?: number
}

interface UploadingFile {
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
  category: FileUpload['file_category']
  description: string
}

export function FileUploadComponent({ 
  onUploadComplete, 
  acceptedCategories = ['medical_report', 'test_result', 'prescription', 'referral', 'insurance', 'other'],
  maxFiles = 5
}: FileUploadComponentProps) {
  const { user } = useAuth()
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [selectedCategory, setSelectedCategory] = useState<FileUpload['file_category']>('medical_report')
  const [description, setDescription] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload files",
        variant: "destructive",
      })
      return
    }

    if (acceptedFiles.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `You can only upload ${maxFiles} files at once`,
        variant: "destructive",
      })
      return
    }

    // Validate each file
    for (const file of acceptedFiles) {
      const validation = fileStorageService.validateFile(file, selectedCategory)
      if (!validation.isValid) {
        toast({
          title: "Invalid File",
          description: `${file.name}: ${validation.error}`,
          variant: "destructive",
        })
        return
      }
    }

    // Add files to uploading list
    const newUploadingFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
      category: selectedCategory,
      description: description || `${selectedCategory.replace('_', ' ')} - ${file.name}`
    }))

    setUploadingFiles(prev => [...prev, ...newUploadingFiles])

    // Start uploads
    newUploadingFiles.forEach((uploadingFile, index) => {
      uploadFile(uploadingFile, index + uploadingFiles.length)
    })
  }, [user, selectedCategory, description, maxFiles, uploadingFiles.length])

  const uploadFile = async (uploadingFile: UploadingFile, index: number) => {
    try {
      const result = await fileStorageService.uploadFile(
        uploadingFile.file,
        user!.id,
        uploadingFile.category,
        uploadingFile.description,
        (progress) => {
          setUploadingFiles(prev => prev.map((f, i) => 
            i === index ? { ...f, progress } : f
          ))
        }
      )

      if (result.error) {
        setUploadingFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, status: 'error', error: result.error } : f
        ))
        toast({
          title: "Upload Failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setUploadingFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, status: 'completed', progress: 100 } : f
        ))
        toast({
          title: "Upload Successful",
          description: `${uploadingFile.file.name} uploaded successfully`,
        })
        
        if (onUploadComplete && result.data) {
          onUploadComplete(result.data)
        }
      }
    } catch (error) {
      setUploadingFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'error', error: 'Upload failed' } : f
      ))
    }
  }

  const removeUploadingFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index))
  }

  const clearCompleted = () => {
    setUploadingFiles(prev => prev.filter(f => f.status !== 'completed'))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: true,
    maxFiles,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls', '.xlsx'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc', '.docx']
    }
  })

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
      return <Image className="h-5 w-5" />
    }
    return <FileText className="h-5 w-5" />
  }

  const getCategoryLabel = (category: FileUpload['file_category']) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Medical Files
          </CardTitle>
          <CardDescription>
            Upload your medical reports, test results, and other health documents securely
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>File Category</Label>
              <Select value={selectedCategory} onValueChange={(value: FileUpload['file_category']) => setSelectedCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {acceptedCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {getCategoryLabel(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the document"
              />
            </div>
          </div>

          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                <p className="text-sm text-muted-foreground">
                  Supports: PDF, Images (JPG, PNG), CSV, Excel, Word documents (max 10MB each)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Upload Progress</CardTitle>
              <Button 
                onClick={clearCompleted} 
                variant="outline" 
                size="sm"
                disabled={!uploadingFiles.some(f => f.status === 'completed')}
              >
                Clear Completed
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadingFiles.map((uploadingFile, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getFileIcon(uploadingFile.file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{uploadingFile.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getCategoryLabel(uploadingFile.category)} • {(uploadingFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {uploadingFile.status === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {uploadingFile.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    {uploadingFile.status !== 'completed' && (
                      <Button
                        onClick={() => removeUploadingFile(index)}
                        variant="ghost"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {uploadingFile.status === 'uploading' && (
                  <Progress value={uploadingFile.progress} className="h-2" />
                )}
                
                {uploadingFile.status === 'error' && uploadingFile.error && (
                  <p className="text-xs text-red-500">{uploadingFile.error}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}