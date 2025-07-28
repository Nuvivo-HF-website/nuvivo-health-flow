import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/contexts/AuthContext'
import { fileStorageService, FileUpload } from '@/services/fileStorageService'
import { toast } from '@/hooks/use-toast'
import { 
  Loader2, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Share, 
  MoreVertical,
  File,
  FileText,
  Image,
  Calendar,
  Eye
} from 'lucide-react'
import { format } from 'date-fns'

interface FileListProps {
  category?: FileUpload['file_category']
  onFileSelect?: (file: FileUpload) => void
  showActions?: boolean
}

export function FileList({ category, onFileSelect, showActions = true }: FileListProps) {
  const { user } = useAuth()
  const [files, setFiles] = useState<FileUpload[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>(category || 'all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadFiles()
    }
  }, [user, categoryFilter])

  const loadFiles = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await fileStorageService.getUserFiles(
        user.id,
        categoryFilter === 'all' ? undefined : categoryFilter as FileUpload['file_category']
      )

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load files",
          variant: "destructive",
        })
      } else {
        setFiles(data || [])
      }
    } catch (error) {
      console.error('Error loading files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (file: FileUpload) => {
    setActionLoading(file.id)
    try {
      const { data, error } = await fileStorageService.downloadFile(file.file_path)
      
      if (error) {
        toast({
          title: "Download Failed",
          description: error.message || "Failed to download file",
          variant: "destructive",
        })
      } else if (data) {
        // Create download link
        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = file.file_name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast({
          title: "Download Complete",
          description: `${file.file_name} downloaded successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (file: FileUpload) => {
    if (!confirm(`Are you sure you want to delete ${file.file_name}?`)) return

    setActionLoading(file.id)
    try {
      const { error } = await fileStorageService.deleteFile(file.id)
      
      if (error) {
        toast({
          title: "Delete Failed",
          description: error.message || "Failed to delete file",
          variant: "destructive",
        })
      } else {
        toast({
          title: "File Deleted",
          description: `${file.file_name} has been deleted`,
        })
        loadFiles() // Refresh the list
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleView = async (file: FileUpload) => {
    try {
      const url = await fileStorageService.getFileUrl(file.file_path)
      window.open(url, '_blank')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open file",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (file: FileUpload) => {
    if (file.file_type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />
    }
    return <FileText className="h-5 w-5 text-gray-500" />
  }

  const getCategoryBadge = (category: FileUpload['file_category']) => {
    const colors = {
      medical_report: 'bg-blue-100 text-blue-800',
      test_result: 'bg-green-100 text-green-800',
      prescription: 'bg-purple-100 text-purple-800',
      referral: 'bg-orange-100 text-orange-800',
      insurance: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    }

    return (
      <Badge variant="secondary" className={colors[category]}>
        {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    )
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = !searchTerm || 
      file.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {!category && (
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="medical_report">Medical Reports</SelectItem>
              <SelectItem value="test_result">Test Results</SelectItem>
              <SelectItem value="prescription">Prescriptions</SelectItem>
              <SelectItem value="referral">Referrals</SelectItem>
              <SelectItem value="insurance">Insurance</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Files List */}
      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No files found</h3>
            <p className="text-muted-foreground">
              {files.length === 0 
                ? "Upload your first medical document to get started." 
                : "No files match your search criteria."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{file.file_name}</h3>
                      {file.description && (
                        <p className="text-sm text-muted-foreground mt-1">{file.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(file.upload_date), 'MMM dd, yyyy')}
                        </div>
                        <span>•</span>
                        <span>{(file.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        {file.is_shared && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">Shared</Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {getCategoryBadge(file.file_category)}
                    
                    {showActions && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={actionLoading === file.id}>
                            {actionLoading === file.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreVertical className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(file)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(file)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(file)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    {onFileSelect && (
                      <Button onClick={() => onFileSelect(file)} size="sm">
                        Select
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}