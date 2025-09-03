'use client'

import { useState, useRef, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ThemeButton, 
  ThemeCard,
  ThemeIcon,
  glassmorphism, 
  shadows, 
  animations, 
  textGradient 
} from '@/components/ui/theme-system'
import { cn } from '@/lib/utils'
import { 
  Upload, 
  Video, 
  Image, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Camera,
  Film,
  Trophy,
  Target,
  Calendar
} from 'lucide-react'

interface MediaFile {
  id: string
  file: File
  type: 'video' | 'image' | 'document'
  preview?: string
  title: string
  description: string
  tags: string[]
  category: 'highlight' | 'training' | 'game' | 'combine' | 'academic'
  uploadProgress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

interface MediaUploadProps {
  onUploadComplete?: (files: MediaFile[]) => void
  maxFiles?: number
  maxFileSize?: number // in MB
  allowedTypes?: string[]
}

const MEDIA_CATEGORIES = [
  { value: 'highlight', label: '🏆 Highlight Reel', description: 'Best plays and performances' },
  { value: 'training', label: '🏃‍♂️ Training Session', description: 'Practice and workout footage' },
  { value: 'game', label: '🏈 Game Footage', description: 'Competition and game clips' },
  { value: 'combine', label: '⚡ Combine/Testing', description: 'Athletic testing and measurements' },
  { value: 'academic', label: '📚 Academic', description: 'Transcripts and certificates' }
]

const POPULAR_TAGS = [
  'Quarterback', 'Running Back', 'Wide Receiver', 'Defense',
  'Passing', 'Rushing', 'Receiving', 'Tackling',
  'Speed', 'Strength', 'Agility', 'Endurance',
  'Game Winner', 'Personal Best', 'Season Highlights'
]

export default function MediaUpload({ 
  onUploadComplete, 
  maxFiles = 10, 
  maxFileSize = 100,
  allowedTypes = ['video/*', 'image/*', 'application/pdf']
}: MediaUploadProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: MediaFile[] = acceptedFiles.map(file => {
      const fileType = file.type.startsWith('video/') ? 'video' : 
                      file.type.startsWith('image/') ? 'image' : 'document'
      
      return {
        id: Math.random().toString(36).substring(7),
        file,
        type: fileType,
        preview: fileType === 'image' ? URL.createObjectURL(file) : undefined,
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        description: '',
        tags: [],
        category: 'highlight',
        uploadProgress: 0,
        status: 'pending'
      }
    })

    setMediaFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.wmv'],
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf']
    },
    maxFiles: maxFiles - mediaFiles.length,
    maxSize: maxFileSize * 1024 * 1024,
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(rejection => {
        console.error('File rejected:', rejection.file.name, rejection.errors)
      })
    }
  })

  const removeFile = (id: string) => {
    setMediaFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  const updateFile = (id: string, updates: Partial<MediaFile>) => {
    setMediaFiles(prev => prev.map(file => 
      file.id === id ? { ...file, ...updates } : file
    ))
  }

  const addTag = (fileId: string, tag: string) => {
    if (!tag.trim()) return
    updateFile(fileId, {
      tags: [...(mediaFiles.find(f => f.id === fileId)?.tags || []), tag.trim()]
    })
  }

  const removeTag = (fileId: string, tagToRemove: string) => {
    updateFile(fileId, {
      tags: (mediaFiles.find(f => f.id === fileId)?.tags || []).filter(tag => tag !== tagToRemove)
    })
  }

  const simulateUpload = async (file: MediaFile) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      updateFile(file.id, { uploadProgress: progress, status: 'uploading' })
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    updateFile(file.id, { status: 'completed' })
  }

  const handleUploadAll = async () => {
    setIsUploading(true)
    
    const pendingFiles = mediaFiles.filter(f => f.status === 'pending')
    
    // Upload files in parallel (in production, you might want to limit concurrency)
    const uploadPromises = pendingFiles.map(file => simulateUpload(file))
    
    try {
      await Promise.all(uploadPromises)
      
      if (onUploadComplete) {
        onUploadComplete(mediaFiles.filter(f => f.status === 'completed'))
      }
      
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5" />
      case 'image': return <Image className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'uploading': return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return null
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Upload Dropzone */}
      <ThemeCard variant="glass" className={cn(shadows.strong, "border-0", "animate-scale-in animation-delay-200")}>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", textGradient('primary'))}>
            <ThemeIcon variant="primary" hover="scaleRotate">
              <Upload className="h-5 w-5" />
            </ThemeIcon>
            Upload Media
          </CardTitle>
          <CardDescription>
            Add highlight videos, training footage, and academic documents to showcase your abilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300",
              glassmorphism.card,
              shadows.soft,
              isDragActive 
                ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 scale-105' 
                : 'border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 hover:scale-102'
            )}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="flex justify-center">
                <ThemeIcon 
                  variant={isDragActive ? "primary" : "foundation"} 
                  hover="scaleRotateStrong"
                  className="p-4"
                >
                  {isDragActive ? (
                    <Upload className="h-8 w-8 animate-bounce" />
                  ) : (
                    <Film className="h-8 w-8" />
                  )}
                </ThemeIcon>
              </div>
              
              <div>
                <p className={cn("text-lg font-medium", isDragActive ? textGradient('primary') : '')}>
                  {isDragActive ? 'Drop files here...' : 'Upload your media'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Drag & drop videos, images, or documents, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max {maxFiles} files • {maxFileSize}MB per file • MP4, MOV, JPG, PNG, PDF
                </p>
              </div>

              <Button variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Select Files
              </Button>
            </div>
          </div>
        </CardContent>
      </ThemeCard>

      {/* File List */}
      {mediaFiles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Media Files ({mediaFiles.length})</CardTitle>
                <CardDescription>
                  Add details and organize your uploads
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setMediaFiles([])}
                  disabled={isUploading}
                >
                  Clear All
                </Button>
                <Button 
                  onClick={handleUploadAll}
                  disabled={isUploading || mediaFiles.every(f => f.status !== 'pending')}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload All ({mediaFiles.filter(f => f.status === 'pending').length})
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mediaFiles.map((file, index) => (
                <div 
                  key={file.id} 
                  className={cn(
                    "border rounded-lg p-4 space-y-4 animate-fade-in-up",
                    glassmorphism.card,
                    shadows.soft,
                    "bg-white/50 dark:bg-gray-900/50 border-white/30 dark:border-white/10"
                  )}
                  style={staggeredDelay(index)}
                >
                  <div className="flex items-start gap-4">
                    {/* File Preview */}
                    <div className="flex-shrink-0">
                      {file.type === 'image' && file.preview ? (
                        <img 
                          src={file.preview} 
                          alt={file.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          {getFileIcon(file.type)}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium truncate">{file.file.name}</h4>
                        {getStatusIcon(file.status)}
                        <Badge variant="outline" className="text-xs">
                          {file.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {formatFileSize(file.file.size)}
                      </p>

                      {file.status === 'uploading' && (
                        <Progress value={file.uploadProgress} className="h-2" />
                      )}

                      {/* File Details Form */}
                      <div className="grid gap-4 md:grid-cols-2 mt-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={file.title}
                            onChange={(e) => updateFile(file.id, { title: e.target.value })}
                            placeholder="Give your media a title..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select 
                            value={file.category} 
                            onValueChange={(value: any) => updateFile(file.id, { category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {MEDIA_CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  <div>
                                    <div className="font-medium">{cat.label}</div>
                                    <div className="text-xs text-muted-foreground">{cat.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={file.description}
                            onChange={(e) => updateFile(file.id, { description: e.target.value })}
                            placeholder="Describe what's shown in this media..."
                            rows={2}
                          />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <Label>Tags</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {file.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="cursor-pointer">
                                {tag}
                                <X 
                                  className="h-3 w-3 ml-1" 
                                  onClick={() => removeTag(file.id, tag)}
                                />
                              </Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {POPULAR_TAGS.filter(tag => !file.tags.includes(tag)).slice(0, 6).map((tag) => (
                              <Button
                                key={tag}
                                variant="outline"
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => addTag(file.id, tag)}
                              >
                                + {tag}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Guidelines */}
      <Alert>
        <Trophy className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Tips for great uploads:</p>
            <ul className="text-sm space-y-1 list-disc list-inside ml-4">
              <li>Upload your best highlights first - recruiters see these prominently</li>
              <li>Include variety: game footage, training sessions, and combine testing</li>
              <li>Add descriptive titles and tags to help recruiters find relevant content</li>
              <li>Keep videos under 5 minutes for better engagement</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}