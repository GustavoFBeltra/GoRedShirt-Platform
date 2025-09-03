'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
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
  Edit, 
  Eye, 
  MapPin, 
  Calendar, 
  School, 
  Trophy,
  Star,
  Share,
  Settings,
  Camera,
  Upload,
  Globe,
  Lock,
  Users,
  GraduationCap,
  Target,
  Activity
} from 'lucide-react'
import SportsPerformanceTracker from '@/components/performance/sports-performance-tracker'
import MediaUpload from '@/components/media/media-upload'
import MediaGallery from '@/components/media/media-gallery'

interface AthleteProfile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  bio?: string
  location?: string
  high_school?: string
  graduation_year?: number
  gpa?: number
  position?: string
  height_inches?: number
  weight_lbs?: number
  jersey_number?: number
  profile_image?: string
  highlight_video?: string
  visibility: 'public' | 'recruiters_only' | 'private'
  verified: boolean
  created_at: string
  updated_at: string
}

interface AthleteSport {
  id: string
  athlete_id: string
  sport_id: number
  sport_name: string
  position: string
  years_experience: number
  primary_sport: boolean
}

export default function AthleteProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<AthleteProfile | null>(null)
  const [sports, setSports] = useState<AthleteSport[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user) {
      fetchAthleteProfile()
      fetchAthleteSports()
    }
  }, [user])

  const fetchAthleteProfile = async () => {
    // In production, this would fetch from Supabase
    // Mock data for now
    setTimeout(() => {
      setProfile({
        id: '1',
        user_id: user?.id || '',
        first_name: 'Alex',
        last_name: 'Rodriguez',
        bio: 'Passionate football player with strong leadership skills and dedication to excellence both on and off the field. Currently seeking opportunities to play at the collegiate level.',
        location: 'Dallas, TX',
        high_school: 'Westfield High School',
        graduation_year: 2025,
        gpa: 3.8,
        position: 'Quarterback',
        height_inches: 73,
        weight_lbs: 195,
        jersey_number: 12,
        profile_image: undefined,
        highlight_video: undefined,
        visibility: 'recruiters_only',
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      setLoading(false)
    }, 1000)
  }

  const fetchAthleteSports = async () => {
    // Mock data
    setTimeout(() => {
      setSports([
        {
          id: '1',
          athlete_id: '1',
          sport_id: 1,
          sport_name: 'Football',
          position: 'Quarterback',
          years_experience: 8,
          primary_sport: true
        },
        {
          id: '2',
          athlete_id: '1',
          sport_id: 2,
          sport_name: 'Baseball',
          position: 'Pitcher',
          years_experience: 4,
          primary_sport: false
        }
      ])
    }, 1200)
  }

  const handleSaveProfile = async () => {
    // In production, this would save to Supabase
    setIsEditing(false)
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return <Globe className="h-4 w-4" />
      case 'recruiters_only': return <Users className="h-4 w-4" />
      case 'private': return <Lock className="h-4 w-4" />
      default: return <Globe className="h-4 w-4" />
    }
  }

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'public': return 'text-green-600 bg-green-100'
      case 'recruiters_only': return 'text-blue-600 bg-blue-100'
      case 'private': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <ThemeCard variant="glass" className={cn(shadows.default, "border-0")}>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-600 to-red-700 animate-pulse"></div>
              <div className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading profile...</div>
            </div>
          </CardContent>
        </ThemeCard>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Profile Header */}
      <ThemeCard variant="glass" className={cn(shadows.strong, "border-0", "animate-scale-in animation-delay-200")}>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profile.profile_image || ''} alt={`${profile.first_name} ${profile.last_name}`} />
                  <AvatarFallback className="text-2xl">
                    {profile.first_name[0]}{profile.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <ThemeButton size="sm" variant="ghost" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 hover:scale-110">
                    <Camera className="h-4 w-4" />
                  </ThemeButton>
                )}
              </div>
              
              <div className="text-center md:text-left mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className={cn("text-2xl font-bold", textGradient('foundation'))}>{profile.first_name} {profile.last_name}</h1>
                  {profile.verified && (
                    <Badge variant="secondary" className="text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      <Star className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-2">
                  {sports.find(s => s.primary_sport)?.sport_name} • {profile.position}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  )}
                  {profile.graduation_year && (
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      Class of {profile.graduation_year}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getVisibilityIcon(profile.visibility)}
                  <Badge className={getVisibilityColor(profile.visibility)}>
                    {profile.visibility.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <ThemeButton variant="ghost" size="sm" className="group">
                    <Share className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                    Share
                  </ThemeButton>
                  <ThemeButton 
                    variant={isEditing ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className="group"
                  >
                    {isEditing ? (
                      "Save Profile"
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                        Edit
                      </>
                    )}
                  </ThemeButton>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: `${profile.height_inches}"`, label: 'Height' },
                  { value: profile.weight_lbs, label: 'Weight' },
                  { value: profile.gpa, label: 'GPA' },
                  { value: `#${profile.jersey_number}`, label: 'Jersey' }
                ].map((stat, index) => (
                  <div 
                    key={stat.label}
                    className={cn(
                      "text-center p-3 rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer group",
                      "animate-fade-in-up",
                      glassmorphism.card,
                      shadows.default,
                      "bg-white/50 dark:bg-gray-900/50 border-white/30 dark:border-white/10"
                    )}
                    style={animations.staggerDelay(index + 2)}
                  >
                    <div className={cn("text-2xl font-bold", textGradient('foundation'))}>{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio"
                      value={profile.bio || ''}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      placeholder="Tell recruiters about yourself..."
                      rows={3}
                    />
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </ThemeCard>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="academics">Academics</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sports & Positions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Sports & Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sports.map((sport) => (
                    <div key={sport.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {sport.sport_name}
                          {sport.primary_sport && (
                            <Badge variant="secondary" className="text-xs">Primary</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{sport.position}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">{sport.years_experience} years</div>
                        <div className="text-muted-foreground">experience</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Academic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                  Academic Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">High School</span>
                    <span>{profile.high_school}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Graduation Year</span>
                    <span>{profile.graduation_year}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">GPA</span>
                    <span className="font-bold text-lg">{profile.gpa}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recruitment Status */}
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Status</CardTitle>
              <CardDescription>Track your recruiting progress and communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">12</div>
                  <div className="text-sm font-medium">College Interests</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">3</div>
                  <div className="text-sm font-medium">Official Visits</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">2</div>
                  <div className="text-sm font-medium">Offers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <SportsPerformanceTracker />
        </TabsContent>

        {/* Academics Tab */}
        <TabsContent value="academics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>Track your academic achievements and test scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">High School Transcript</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span>Overall GPA</span>
                      <span className="font-bold">{profile.gpa}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span>Core GPA</span>
                      <span className="font-bold">3.9</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span>Class Rank</span>
                      <span className="font-bold">15/342</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Standardized Tests</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span>SAT Total</span>
                      <span className="font-bold">1420</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span>SAT Math</span>
                      <span className="font-bold">720</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span>SAT Reading</span>
                      <span className="font-bold">700</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6">
          <MediaGallery 
            athleteId={profile.id}
            editable={true}
            showStats={true}
          />
          
          <MediaUpload 
            maxFiles={10}
            maxFileSize={100}
            onUploadComplete={(files) => {
              console.log('Media uploaded:', files)
              // In production, refresh media gallery here
            }}
          />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your profile visibility and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">
                      Control who can view your profile and contact you
                    </p>
                  </div>
                  <Select 
                    value={profile.visibility}
                    onValueChange={(value) => setProfile({...profile, visibility: value as any})}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">🌍 Public</SelectItem>
                      <SelectItem value="recruiters_only">👥 Recruiters Only</SelectItem>
                      <SelectItem value="private">🔒 Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Allow Contact from Recruiters</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive messages from college recruiters
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Performance Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Display combine metrics and performance stats
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about profile views and messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}