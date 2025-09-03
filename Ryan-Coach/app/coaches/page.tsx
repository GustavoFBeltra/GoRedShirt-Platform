'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar as CalendarIcon, 
  Clock, 
  DollarSign,
  Users,
  Award,
  MessageCircle,
  Video,
  Phone,
  BookOpen,
  Trophy,
  Target,
  CheckCircle2,
  Filter,
  SortAsc
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface CoachProfile {
  id: string
  firstName: string
  lastName: string
  title: string
  specializations: string[]
  sports: string[]
  location: string
  rating: number
  reviewCount: number
  experience: string
  bio: string
  profileImage?: string
  hourlyRate: number
  availability: 'available' | 'busy' | 'unavailable'
  responseTime: string
  sessionTypes: {
    id: string
    name: string
    duration: number
    price: number
    description: string
  }[]
  achievements: string[]
  clientCount: number
  successRate: number
}

interface TimeSlot {
  id: string
  date: Date
  time: string
  available: boolean
  sessionType: string
  price: number
}

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<CoachProfile[]>([])
  const [filteredCoaches, setFilteredCoaches] = useState<CoachProfile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSport, setSelectedSport] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('rating')
  const [selectedCoach, setSelectedCoach] = useState<CoachProfile | null>(null)
  const [bookingStep, setBookingStep] = useState<'select-session' | 'select-time' | 'confirm' | 'success'>('select-session')
  const [selectedSessionType, setSelectedSessionType] = useState<string>('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [bookingMessage, setBookingMessage] = useState('')
  
  // Mock data - replace with real API calls
  const mockCoaches: CoachProfile[] = [
    {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      title: 'Elite Football Coach',
      specializations: ['Quarterback Training', 'Mental Conditioning', 'College Prep'],
      sports: ['Football'],
      location: 'Stanford, CA',
      rating: 4.9,
      reviewCount: 127,
      experience: '12+ years',
      bio: 'Former Division I quarterback turned elite coach. Specializing in developing next-level quarterbacks for college and professional football. My training methodology focuses on mental toughness, precision passing, and leadership development.',
      profileImage: '',
      hourlyRate: 150,
      availability: 'available',
      responseTime: '< 2 hours',
      sessionTypes: [
        {
          id: 'qb-training',
          name: 'QB Skills Training',
          duration: 90,
          price: 175,
          description: 'Comprehensive quarterback training focusing on accuracy, decision-making, and pocket presence.'
        },
        {
          id: 'mental-coaching',
          name: 'Mental Performance',
          duration: 60,
          price: 125,
          description: 'Mental conditioning and game psychology for peak performance under pressure.'
        },
        {
          id: 'college-prep',
          name: 'College Preparation',
          duration: 120,
          price: 200,
          description: 'Complete college recruitment preparation including film analysis and recruiting strategy.'
        }
      ],
      achievements: ['Former D1 Player', '50+ College Commitments', 'Regional Coach of the Year'],
      clientCount: 89,
      successRate: 94
    },
    {
      id: '2',
      firstName: 'Marcus',
      lastName: 'Thompson',
      title: 'Strength & Conditioning Specialist',
      specializations: ['Athletic Performance', 'Injury Prevention', 'Sport-Specific Training'],
      sports: ['Football', 'Basketball', 'Soccer'],
      location: 'Los Angeles, CA',
      rating: 4.8,
      reviewCount: 93,
      experience: '8+ years',
      bio: 'Certified strength and conditioning specialist with expertise in developing explosive power, speed, and agility. Worked with high school and college athletes across multiple sports.',
      profileImage: '',
      hourlyRate: 120,
      availability: 'available',
      responseTime: '< 4 hours',
      sessionTypes: [
        {
          id: 'strength-training',
          name: 'Strength Training',
          duration: 75,
          price: 140,
          description: 'Personalized strength training program designed for athletic performance enhancement.'
        },
        {
          id: 'speed-agility',
          name: 'Speed & Agility',
          duration: 60,
          price: 110,
          description: 'High-intensity speed and agility training to improve athletic performance.'
        }
      ],
      achievements: ['CSCS Certified', '200+ Athletes Trained', 'Performance Enhancement Specialist'],
      clientCount: 156,
      successRate: 91
    },
    {
      id: '3',
      firstName: 'Coach',
      lastName: 'Rodriguez',
      title: 'Basketball Skills Trainer',
      specializations: ['Shooting Mechanics', 'Ball Handling', 'Game IQ'],
      sports: ['Basketball'],
      location: 'Miami, FL',
      rating: 4.7,
      reviewCount: 68,
      experience: '6+ years',
      bio: 'Professional basketball trainer specializing in shooting mechanics and skill development. Trained numerous high school players who earned college scholarships.',
      profileImage: '',
      hourlyRate: 100,
      availability: 'busy',
      responseTime: '< 6 hours',
      sessionTypes: [
        {
          id: 'shooting-clinic',
          name: 'Shooting Mechanics',
          duration: 90,
          price: 130,
          description: 'Complete shooting form analysis and correction with advanced drills.'
        },
        {
          id: 'skills-training',
          name: 'Skills Development',
          duration: 75,
          price: 115,
          description: 'Comprehensive ball handling, footwork, and basketball IQ development.'
        }
      ],
      achievements: ['Former Pro Player', '25+ Scholarship Recipients', 'Skills Development Expert'],
      clientCount: 67,
      successRate: 88
    }
  ]

  const mockTimeSlots: TimeSlot[] = [
    { id: '1', date: new Date(), time: '9:00 AM', available: true, sessionType: 'qb-training', price: 175 },
    { id: '2', date: new Date(), time: '11:00 AM', available: true, sessionType: 'qb-training', price: 175 },
    { id: '3', date: new Date(), time: '2:00 PM', available: false, sessionType: 'qb-training', price: 175 },
    { id: '4', date: new Date(), time: '4:00 PM', available: true, sessionType: 'mental-coaching', price: 125 },
  ]

  useEffect(() => {
    setCoaches(mockCoaches)
    setFilteredCoaches(mockCoaches)
    setAvailableSlots(mockTimeSlots)
  }, [])

  useEffect(() => {
    let filtered = coaches

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(coach =>
        `${coach.firstName} ${coach.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coach.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
        coach.sports.some(sport => sport.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sport filter
    if (selectedSport !== 'all') {
      filtered = filtered.filter(coach => coach.sports.includes(selectedSport))
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(coach => coach.location.includes(selectedLocation))
    }

    // Price filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      filtered = filtered.filter(coach => 
        coach.hourlyRate >= min && (max ? coach.hourlyRate <= max : true)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'price-low':
          return a.hourlyRate - b.hourlyRate
        case 'price-high':
          return b.hourlyRate - a.hourlyRate
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience)
        case 'reviews':
          return b.reviewCount - a.reviewCount
        default:
          return 0
      }
    })

    setFilteredCoaches(filtered)
  }, [coaches, searchQuery, selectedSport, selectedLocation, priceRange, sortBy])

  const handleBookSession = (coach: CoachProfile) => {
    setSelectedCoach(coach)
    setBookingStep('select-session')
  }

  const handleSessionSelection = (sessionTypeId: string) => {
    setSelectedSessionType(sessionTypeId)
    setBookingStep('select-time')
  }

  const handleTimeSlotSelection = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot)
    setBookingStep('confirm')
  }

  const handleConfirmBooking = async () => {
    // Simulate API call
    setTimeout(() => {
      setBookingStep('success')
    }, 1000)
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'busy':
        return 'bg-yellow-100 text-yellow-800'
      case 'unavailable':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderBookingDialog = () => {
    if (!selectedCoach) return null

    switch (bookingStep) {
      case 'select-session':
        return (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Select Session Type</DialogTitle>
              <DialogDescription>
                Choose the type of session you&apos;d like to book with {selectedCoach.firstName} {selectedCoach.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedCoach.sessionTypes.map((sessionType) => (
                <Card
                  key={sessionType.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSessionSelection(sessionType.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{sessionType.name}</h3>
                        <p className="text-sm text-muted-foreground">{sessionType.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {sessionType.duration} minutes
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${sessionType.price}
                          </span>
                        </div>
                      </div>
                      <Button size="sm">Select</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        )

      case 'select-time':
        const selectedSession = selectedCoach.sessionTypes.find(s => s.id === selectedSessionType)
        return (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Select Date & Time</DialogTitle>
              <DialogDescription>
                Book your {selectedSession?.name} session with {selectedCoach.firstName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              <div>
                <h3 className="font-semibold mb-3">Available Times</h3>
                <div className="space-y-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={slot.available ? "outline" : "secondary"}
                      className="w-full justify-between"
                      disabled={!slot.available}
                      onClick={() => slot.available && handleTimeSlotSelection(slot)}
                    >
                      <span>{slot.time}</span>
                      {slot.available ? (
                        <span className="text-green-600">Available</span>
                      ) : (
                        <span className="text-gray-400">Booked</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setBookingStep('select-session')}>
                Back
              </Button>
            </div>
          </DialogContent>
        )

      case 'confirm':
        const sessionType = selectedCoach.sessionTypes.find(s => s.id === selectedSessionType)
        return (
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription>
                Review your session details before confirming
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Session Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Coach:</span>
                    <span>{selectedCoach.firstName} {selectedCoach.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Session:</span>
                    <span>{sessionType?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{selectedDate && format(selectedDate, 'PPP')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{selectedTimeSlot?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{sessionType?.duration} minutes</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${sessionType?.price}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Additional Notes (Optional)
                </label>
                <Textarea
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                  placeholder="Any specific goals or requirements for this session?"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setBookingStep('select-time')}>
                Back
              </Button>
              <Button onClick={handleConfirmBooking} className="flex-1">
                Confirm & Pay ${sessionType?.price}
              </Button>
            </div>
          </DialogContent>
        )

      case 'success':
        return (
          <DialogContent className="max-w-lg">
            <div className="text-center py-6">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <DialogTitle className="text-2xl mb-2">Booking Confirmed!</DialogTitle>
              <DialogDescription className="text-base mb-6">
                Your session with {selectedCoach.firstName} {selectedCoach.lastName} has been booked successfully.
                You&apos;ll receive a confirmation email shortly.
              </DialogDescription>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSelectedCoach(null)
                    setBookingStep('select-session')
                  }}
                >
                  Close
                </Button>
                <Button>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Coach
                </Button>
              </div>
            </div>
          </DialogContent>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Your Coach</h1>
        <p className="text-muted-foreground">
          Connect with elite coaches and trainers to take your game to the next level
        </p>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coaches, sports, specializations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedSport} onValueChange={setSelectedSport}>
          <SelectTrigger>
            <SelectValue placeholder="All Sports" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            <SelectItem value="Football">Football</SelectItem>
            <SelectItem value="Basketball">Basketball</SelectItem>
            <SelectItem value="Soccer">Soccer</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="CA">California</SelectItem>
            <SelectItem value="FL">Florida</SelectItem>
            <SelectItem value="TX">Texas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-100">$0 - $100</SelectItem>
            <SelectItem value="100-150">$100 - $150</SelectItem>
            <SelectItem value="150-200">$150 - $200</SelectItem>
            <SelectItem value="200">$200+</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="experience">Most Experience</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCoaches.map((coach) => (
          <Card key={coach.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={coach.profileImage} />
                  <AvatarFallback>
                    {coach.firstName[0]}{coach.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {coach.firstName} {coach.lastName}
                      </CardTitle>
                      <CardDescription className="font-medium">
                        {coach.title}
                      </CardDescription>
                    </div>
                    <Badge className={getAvailabilityColor(coach.availability)}>
                      {coach.availability}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold ml-1">{coach.rating}</span>
                      <span className="text-sm text-muted-foreground ml-1">
                        ({coach.reviewCount})
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{coach.experience}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {coach.location}
                </div>

                <div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {coach.sports.map((sport) => (
                      <Badge key={sport} variant="outline" className="text-xs">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {coach.specializations.slice(0, 3).map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {coach.bio}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-lg font-bold text-green-600">
                    ${coach.hourlyRate}/hr
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => handleBookSession(coach)}>
                          Book Session
                        </Button>
                      </DialogTrigger>
                      {renderBookingDialog()}
                    </Dialog>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="font-semibold text-sm">{coach.clientCount}</div>
                    <div className="text-xs text-muted-foreground">Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-sm">{coach.successRate}%</div>
                    <div className="text-xs text-muted-foreground">Success</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-sm">{coach.responseTime}</div>
                    <div className="text-xs text-muted-foreground">Response</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCoaches.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No coaches found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}