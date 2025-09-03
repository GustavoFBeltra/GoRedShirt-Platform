'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  ThemeButton, 
  ThemeCard,
  ThemeIcon,
  glassmorphism, 
  shadows, 
  animations, 
  textGradient,
  staggeredDelay
} from '@/components/ui/theme-system'
import { cn } from '@/lib/utils'
import { 
  Play, 
  Image as ImageIcon, 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Share2,
  MoreHorizontal,
  Calendar,
  Tag,
  Trophy,
  BarChart3,
  Star
} from 'lucide-react'

interface MediaItem {
  id: string
  title: string
  description: string
  type: 'video' | 'image' | 'document'
  category: 'highlight' | 'training' | 'game' | 'combine' | 'academic'
  url: string
  thumbnail?: string
  duration?: string // for videos
  tags: string[]
  uploadDate: string
  views: number
  featured: boolean
  fileSize: string
}

interface MediaGalleryProps {
  athleteId?: string
  editable?: boolean
  maxItems?: number
  showStats?: boolean
}

// Mock data - in production this would come from Supabase
const MOCK_MEDIA: MediaItem[] = [
  {
    id: '1',
    title: 'Senior Season Highlights',
    description: 'Best plays from my senior football season including the championship game-winning touchdown.',
    type: 'video',
    category: 'highlight',
    url: '/mock-video-1.mp4',
    thumbnail: '/mock-thumb-1.jpg',
    duration: '4:32',
    tags: ['Quarterback', 'Highlights', 'Touchdown', 'Championship'],
    uploadDate: '2024-01-15',
    views: 1247,
    featured: true,
    fileSize: '45.2 MB'
  },
  {
    id: '2',
    title: 'Combine Testing Results',
    description: '40-yard dash, vertical jump, and bench press testing at the regional combine.',
    type: 'video',
    category: 'combine',
    url: '/mock-video-2.mp4',
    thumbnail: '/mock-thumb-2.jpg',
    duration: '2:18',
    tags: ['40-yard dash', 'Vertical Jump', 'Combine', 'Testing'],
    uploadDate: '2024-01-10',
    views: 892,
    featured: false,
    fileSize: '28.1 MB'
  },
  {
    id: '3',
    title: 'Spring Training Session',
    description: 'Working on footwork and passing accuracy during spring training camp.',
    type: 'video',
    category: 'training',
    url: '/mock-video-3.mp4',
    thumbnail: '/mock-thumb-3.jpg',
    duration: '6:45',
    tags: ['Training', 'Footwork', 'Passing', 'Accuracy'],
    uploadDate: '2024-01-05',
    views: 456,
    featured: false,
    fileSize: '67.8 MB'
  },
  {
    id: '4',
    title: 'Game Action vs Central High',
    description: 'Complete game highlights showing leadership and performance under pressure.',
    type: 'image',
    category: 'game',
    url: '/mock-image-1.jpg',
    tags: ['Game', 'Leadership', 'Pressure', 'Performance'],
    uploadDate: '2024-01-03',
    views: 234,
    featured: false,
    fileSize: '8.4 MB'
  },
  {
    id: '5',
    title: 'Academic Transcript',
    description: 'Official high school transcript showing 3.8 GPA and honor roll status.',
    type: 'document',
    category: 'academic',
    url: '/mock-transcript.pdf',
    tags: ['Transcript', 'GPA', 'Honor Roll', 'Academic'],
    uploadDate: '2023-12-20',
    views: 156,
    featured: false,
    fileSize: '1.2 MB'
  }
]

const CATEGORIES = [
  { value: 'all', label: 'All Media', icon: BarChart3 },
  { value: 'highlight', label: 'Highlights', icon: Trophy },
  { value: 'training', label: 'Training', icon: BarChart3 },
  { value: 'game', label: 'Games', icon: Play },
  { value: 'combine', label: 'Testing', icon: BarChart3 },
  { value: 'academic', label: 'Academic', icon: FileText }
]

export default function MediaGallery({ 
  athleteId, 
  editable = false, 
  maxItems = 20,
  showStats = true 
}: MediaGalleryProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(MOCK_MEDIA)
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>(MOCK_MEDIA)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    let filtered = mediaItems

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort by featured first, then by date
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    })

    setFilteredItems(filtered.slice(0, maxItems))
  }, [mediaItems, selectedCategory, searchQuery, maxItems])

  const getFileIcon = (type: string, className = "h-5 w-5") => {
    switch (type) {
      case 'video': return <Play className={className} />
      case 'image': return <ImageIcon className={className} />
      default: return <FileText className={className} />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'highlight': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'training': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'game': return 'bg-green-100 text-green-800 border-green-300'
      case 'combine': return 'bg-red-100 text-red-800 border-red-300'
      case 'academic': return 'bg-purple-100 text-purple-800 border-purple-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`
    }
    return views.toString()
  }

  const totalViews = mediaItems.reduce((sum, item) => sum + item.views, 0)
  const featuredCount = mediaItems.filter(item => item.featured).length

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {showStats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{mediaItems.length}</p>
                  <p className="text-sm text-muted-foreground">Total Media</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{formatViews(totalViews)}</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{featuredCount}</p>
                  <p className="text-sm text-muted-foreground">Featured</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{mediaItems.filter(i => i.category === 'highlight').length}</p>
                  <p className="text-sm text-muted-foreground">Highlights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Media Gallery</CardTitle>
              <CardDescription>
                Browse and manage your athletic media content
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <category.icon className="h-4 w-4" />
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-muted">
                  <ImageIcon className="h-8 w-8" />
                </div>
              </div>
              <p className="text-lg font-medium">No media found</p>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first media to get started'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative aspect-video bg-muted flex items-center justify-center">
                    {item.thumbnail ? (
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center">
                        {getFileIcon(item.type, "h-12 w-12 text-muted-foreground")}
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      {item.type === 'video' && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="p-2 rounded-full bg-white/90">
                            <Play className="h-6 w-6 text-black" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Featured Badge */}
                    {item.featured && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-yellow-500 text-yellow-900 border-0">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}

                    {/* Duration for videos */}
                    {item.type === 'video' && item.duration && (
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary" className="bg-black/70 text-white border-0">
                          {item.duration}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                        {item.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.uploadDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatViews(item.views)} views
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getFileIcon(selectedItem.type)}
                  {selectedItem.title}
                  {selectedItem.featured && (
                    <Badge className="bg-yellow-500 text-yellow-900 border-0">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>
                  {selectedItem.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Media Preview */}
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  {selectedItem.type === 'video' ? (
                    <div className="text-center">
                      <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Video Player Placeholder</p>
                      <p className="text-sm text-muted-foreground">Duration: {selectedItem.duration}</p>
                    </div>
                  ) : selectedItem.type === 'image' ? (
                    <div className="text-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Image Preview</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Document Preview</p>
                    </div>
                  )}
                </div>

                {/* Media Details */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Category:</span>
                          <Badge className={getCategoryColor(selectedItem.category)}>
                            {selectedItem.category}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Upload Date:</span>
                          <span>{formatDate(selectedItem.uploadDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">File Size:</span>
                          <span>{selectedItem.fileSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Views:</span>
                          <span>{formatViews(selectedItem.views)} views</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedItem.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  {editable && (
                    <Button variant="outline">
                      <MoreHorizontal className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}