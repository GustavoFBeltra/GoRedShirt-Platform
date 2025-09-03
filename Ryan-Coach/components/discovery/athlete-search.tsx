'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Search, 
  Filter, 
  MapPin, 
  GraduationCap, 
  Trophy, 
  Star,
  Eye,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  TrendingUp,
  Activity,
  Target,
  Users,
  Calendar,
  BarChart3,
  Award,
  SchoolIcon
} from 'lucide-react'
import { getMetricsByCategory, getPerformanceRating } from '@/lib/metrics/metrics-catalog'

interface AthleteSearchResult {
  id: string
  firstName: string
  lastName: string
  profileImage?: string
  location: string
  highSchool: string
  graduationYear: number
  gpa: number
  primarySport: string
  position: string
  height: number // inches
  weight: number // lbs
  performanceScore: number
  recruitingStatus: 'available' | 'committed' | 'interested'
  verified: boolean
  keyMetrics: {
    [key: string]: number
  }
  highlights: number
  profileViews: number
  lastActive: string
  tags: string[]
}

interface SearchFilters {
  sports: string[]
  positions: string[]
  graduationYears: number[]
  location: string
  radius: number // miles
  gpaRange: [number, number]
  heightRange: [number, number]
  weightRange: [number, number]
  performanceScoreRange: [number, number]
  recruitingStatus: string[]
  verifiedOnly: boolean
}

// Mock data - in production this would come from Supabase
const MOCK_ATHLETES: AthleteSearchResult[] = [
  {
    id: '1',
    firstName: 'Alex',
    lastName: 'Rodriguez',
    profileImage: undefined,
    location: 'Dallas, TX',
    highSchool: 'Westfield High School',
    graduationYear: 2025,
    gpa: 3.8,
    primarySport: 'Football',
    position: 'Quarterback',
    height: 73,
    weight: 195,
    performanceScore: 92,
    recruitingStatus: 'available',
    verified: true,
    keyMetrics: {
      forty_yard_dash: 4.52,
      vertical_jump: 35.5,
      bench_press_reps: 22
    },
    highlights: 8,
    profileViews: 1247,
    lastActive: '2024-01-15',
    tags: ['Quarterback', 'Leader', 'Strong Arm', 'Mobile']
  },
  {
    id: '2',
    firstName: 'Maya',
    lastName: 'Johnson',
    profileImage: undefined,
    location: 'Austin, TX',
    highSchool: 'Lake Travis High School',
    graduationYear: 2025,
    gpa: 3.9,
    primarySport: 'Soccer',
    position: 'Midfielder',
    height: 65,
    weight: 125,
    performanceScore: 88,
    recruitingStatus: 'available',
    verified: true,
    keyMetrics: {
      cooper_test: 2850,
      soccer_goals: 24,
      soccer_assists: 18
    },
    highlights: 12,
    profileViews: 892,
    lastActive: '2024-01-14',
    tags: ['Playmaker', 'Technical', 'Endurance', 'Vision']
  },
  {
    id: '3',
    firstName: 'Marcus',
    lastName: 'Williams',
    profileImage: undefined,
    location: 'Houston, TX',
    highSchool: 'Cy-Fair High School',
    graduationYear: 2024,
    gpa: 3.6,
    primarySport: 'Basketball',
    position: 'Point Guard',
    height: 70,
    weight: 165,
    performanceScore: 85,
    recruitingStatus: 'interested',
    verified: false,
    keyMetrics: {
      vertical_jump: 32,
      basketball_assists: 8.5,
      basketball_points: 18.2
    },
    highlights: 6,
    profileViews: 456,
    lastActive: '2024-01-13',
    tags: ['Court Vision', 'Speed', 'Leadership', 'Clutch']
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Davis',
    profileImage: undefined,
    location: 'San Antonio, TX',
    highSchool: 'Reagan High School',
    graduationYear: 2026,
    gpa: 4.0,
    primarySport: 'Soccer',
    position: 'Forward',
    height: 67,
    weight: 140,
    performanceScore: 94,
    recruitingStatus: 'available',
    verified: true,
    keyMetrics: {
      cooper_test: 2950,
      soccer_goals: 32,
      forty_yard_dash: 4.8
    },
    highlights: 15,
    profileViews: 1586,
    lastActive: '2024-01-15',
    tags: ['Goal Scorer', 'Pace', 'Finishing', 'Work Rate']
  }
]

const SPORTS_OPTIONS = [
  'Football', 'Soccer', 'Basketball', 'Baseball', 'Softball', 'Track & Field',
  'Swimming', 'Tennis', 'Golf', 'Volleyball', 'Wrestling', 'Cross Country'
]

const POSITION_MAP: { [sport: string]: string[] } = {
  'Football': ['Quarterback', 'Running Back', 'Wide Receiver', 'Tight End', 'Offensive Line', 'Defensive Line', 'Linebacker', 'Cornerback', 'Safety', 'Kicker'],
  'Soccer': ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Winger'],
  'Basketball': ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center']
}

export default function AthleteSearch() {
  const [athletes, setAthletes] = useState<AthleteSearchResult[]>(MOCK_ATHLETES)
  const [filteredAthletes, setFilteredAthletes] = useState<AthleteSearchResult[]>(MOCK_ATHLETES)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteSearchResult | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [savedAthletes, setSavedAthletes] = useState<string[]>([])
  
  const [filters, setFilters] = useState<SearchFilters>({
    sports: [],
    positions: [],
    graduationYears: [],
    location: '',
    radius: 50,
    gpaRange: [0, 4.0],
    heightRange: [60, 84], // 5'0" to 7'0"
    weightRange: [100, 300],
    performanceScoreRange: [0, 100],
    recruitingStatus: ['available', 'interested'],
    verifiedOnly: false
  })

  useEffect(() => {
    applyFilters()
  }, [athletes, searchQuery, filters])

  const applyFilters = () => {
    let filtered = athletes

    // Text search
    if (searchQuery) {
      filtered = filtered.filter(athlete =>
        `${athlete.firstName} ${athlete.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.highSchool.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.primarySport.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sport filter
    if (filters.sports.length > 0) {
      filtered = filtered.filter(athlete => filters.sports.includes(athlete.primarySport))
    }

    // Position filter
    if (filters.positions.length > 0) {
      filtered = filtered.filter(athlete => filters.positions.includes(athlete.position))
    }

    // Graduation year filter
    if (filters.graduationYears.length > 0) {
      filtered = filtered.filter(athlete => filters.graduationYears.includes(athlete.graduationYear))
    }

    // GPA range
    filtered = filtered.filter(athlete => 
      athlete.gpa >= filters.gpaRange[0] && athlete.gpa <= filters.gpaRange[1]
    )

    // Height range
    filtered = filtered.filter(athlete => 
      athlete.height >= filters.heightRange[0] && athlete.height <= filters.heightRange[1]
    )

    // Weight range
    filtered = filtered.filter(athlete => 
      athlete.weight >= filters.weightRange[0] && athlete.weight <= filters.weightRange[1]
    )

    // Performance score range
    filtered = filtered.filter(athlete => 
      athlete.performanceScore >= filters.performanceScoreRange[0] && 
      athlete.performanceScore <= filters.performanceScoreRange[1]
    )

    // Recruiting status
    if (filters.recruitingStatus.length > 0) {
      filtered = filtered.filter(athlete => filters.recruitingStatus.includes(athlete.recruitingStatus))
    }

    // Verified only
    if (filters.verifiedOnly) {
      filtered = filtered.filter(athlete => athlete.verified)
    }

    // Sort by performance score (highest first)
    filtered.sort((a, b) => b.performanceScore - a.performanceScore)

    setFilteredAthletes(filtered)
  }

  const toggleSaveAthlete = (athleteId: string) => {
    setSavedAthletes(prev => 
      prev.includes(athleteId) 
        ? prev.filter(id => id !== athleteId)
        : [...prev, athleteId]
    )
  }

  const getRecruitingStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-300'
      case 'interested': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'committed': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const formatHeight = (inches: number) => {
    const feet = Math.floor(inches / 12)
    const remainingInches = inches % 12
    return `${feet}'${remainingInches}"`
  }

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent dark:from-white dark:to-red-400">
            Discover Athletes
          </h1>
          <p className="text-muted-foreground mt-2">
            Find and connect with talented student-athletes across all sports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {filteredAthletes.length} athletes found
          </Badge>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-red-50 text-red-700 border-red-200' : ''}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, school, sport, position, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters
            </CardTitle>
            <CardDescription>
              Refine your search to find the perfect athletes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="athletic">Athletic</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Sports</Label>
                    <div className="flex flex-wrap gap-2">
                      {SPORTS_OPTIONS.map((sport) => (
                        <div key={sport} className="flex items-center space-x-2">
                          <Checkbox
                            id={`sport-${sport}`}
                            checked={filters.sports.includes(sport)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters(prev => ({ ...prev, sports: [...prev.sports, sport] }))
                              } else {
                                setFilters(prev => ({ ...prev, sports: prev.sports.filter(s => s !== sport) }))
                              }
                            }}
                          />
                          <Label htmlFor={`sport-${sport}`} className="text-sm">{sport}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Graduation Years</Label>
                    <div className="flex flex-wrap gap-2">
                      {[2024, 2025, 2026, 2027].map((year) => (
                        <div key={year} className="flex items-center space-x-2">
                          <Checkbox
                            id={`year-${year}`}
                            checked={filters.graduationYears.includes(year)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters(prev => ({ ...prev, graduationYears: [...prev.graduationYears, year] }))
                              } else {
                                setFilters(prev => ({ ...prev, graduationYears: prev.graduationYears.filter(y => y !== year) }))
                              }
                            }}
                          />
                          <Label htmlFor={`year-${year}`} className="text-sm">{year}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Recruiting Status</Label>
                  <div className="flex gap-4">
                    {[
                      { value: 'available', label: 'Available' },
                      { value: 'interested', label: 'Interested' },
                      { value: 'committed', label: 'Committed' }
                    ].map((status) => (
                      <div key={status.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status.value}`}
                          checked={filters.recruitingStatus.includes(status.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters(prev => ({ ...prev, recruitingStatus: [...prev.recruitingStatus, status.value] }))
                            } else {
                              setFilters(prev => ({ ...prev, recruitingStatus: prev.recruitingStatus.filter(s => s !== status.value) }))
                            }
                          }}
                        />
                        <Label htmlFor={`status-${status.value}`} className="text-sm">{status.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified-only"
                    checked={filters.verifiedOnly}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, verifiedOnly: checked === true }))}
                  />
                  <Label htmlFor="verified-only">Verified athletes only</Label>
                </div>
              </TabsContent>

              <TabsContent value="athletic" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label>Height Range</Label>
                      <div className="px-3 py-2">
                        <Slider
                          value={filters.heightRange}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, heightRange: value as [number, number] }))}
                          min={60}
                          max={84}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>{formatHeight(filters.heightRange[0])}</span>
                          <span>{formatHeight(filters.heightRange[1])}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Weight Range</Label>
                      <div className="px-3 py-2">
                        <Slider
                          value={filters.weightRange}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, weightRange: value as [number, number] }))}
                          min={100}
                          max={300}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>{filters.weightRange[0]} lbs</span>
                          <span>{filters.weightRange[1]} lbs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Performance Score</Label>
                      <div className="px-3 py-2">
                        <Slider
                          value={filters.performanceScoreRange}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, performanceScoreRange: value as [number, number] }))}
                          min={0}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>{filters.performanceScoreRange[0]}</span>
                          <span>{filters.performanceScoreRange[1]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="academic" className="space-y-6">
                <div>
                  <Label>GPA Range</Label>
                  <div className="px-3 py-2">
                    <Slider
                      value={filters.gpaRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, gpaRange: value as [number, number] }))}
                      min={0}
                      max={4.0}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>{filters.gpaRange[0].toFixed(1)}</span>
                      <span>{filters.gpaRange[1].toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    sports: [],
                    positions: [],
                    graduationYears: [],
                    location: '',
                    radius: 50,
                    gpaRange: [0, 4.0],
                    heightRange: [60, 84],
                    weightRange: [100, 300],
                    performanceScoreRange: [0, 100],
                    recruitingStatus: ['available', 'interested'],
                    verifiedOnly: false
                  })
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Grid */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredAthletes.map((athlete) => (
          <Card key={athlete.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={athlete.profileImage} alt={`${athlete.firstName} ${athlete.lastName}`} />
                    <AvatarFallback className="text-lg">
                      {athlete.firstName[0]}{athlete.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg truncate">
                        {athlete.firstName} {athlete.lastName}
                      </h3>
                      {athlete.verified && (
                        <Badge variant="secondary" className="text-blue-600 bg-blue-100 border-blue-300">
                          <Star className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-2">
                      {athlete.primarySport} • {athlete.position}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {athlete.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        Class of {athlete.graduationYear}
                      </div>
                    </div>

                    <Badge className={getRecruitingStatusColor(athlete.recruitingStatus)}>
                      {athlete.recruitingStatus.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSaveAthlete(athlete.id)}
                    className={savedAthletes.includes(athlete.id) ? 'text-red-600' : ''}
                  >
                    <Bookmark className={`h-4 w-4 ${savedAthletes.includes(athlete.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                {/* Performance Score */}
                <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Performance Score</span>
                    <span className="text-2xl font-bold text-red-600">{athlete.performanceScore}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Based on athletic testing and game performance
                  </div>
                </div>

                {/* Key Stats */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold">{formatHeight(athlete.height)}</div>
                    <div className="text-xs text-muted-foreground">Height</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{athlete.weight}</div>
                    <div className="text-xs text-muted-foreground">Weight</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{athlete.gpa.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">GPA</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1">
                  {athlete.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {athlete.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{athlete.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {athlete.firstName} {athlete.lastName}
                        </DialogTitle>
                        <DialogDescription>
                          {athlete.primarySport} • {athlete.position} • {athlete.highSchool}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-3">
                            <h4 className="font-semibold">Physical</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Height: {formatHeight(athlete.height)}</div>
                              <div>Weight: {athlete.weight} lbs</div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-semibold">Academic</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>GPA: {athlete.gpa.toFixed(2)}</div>
                              <div>Grad Year: {athlete.graduationYear}</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold">Key Metrics</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(athlete.keyMetrics).map(([metric, value]) => (
                              <div key={metric}>
                                {metric.replace(/_/g, ' ')}: {value}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4 border-t">
                          <Button className="flex-1">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Send Message
                          </Button>
                          <Button variant="outline">
                            <Bookmark className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>

                {/* Activity Footer */}
                <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {athlete.profileViews} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      {athlete.highlights} highlights
                    </div>
                  </div>
                  <div>Active {formatLastActive(athlete.lastActive)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredAthletes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-muted">
                <Search className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-lg font-medium">No athletes found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search query or filters to find more results
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('')
                setFilters(prev => ({ ...prev, sports: [], positions: [], graduationYears: [] }))
              }}
            >
              Clear Search & Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}