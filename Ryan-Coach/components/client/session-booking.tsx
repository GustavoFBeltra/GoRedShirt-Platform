'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, Clock, DollarSign, MapPin, Video, AlertCircle, CheckCircle } from 'lucide-react'
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns'

interface Package {
  id: string
  name: string
  price: number
  duration_minutes: number
  package_type: string
}

interface AvailableSlot {
  id: string
  start_time: string
  end_time: string
  is_available: boolean
}

interface SessionBookingProps {
  coachId: string
  coachName: string
  selectedPackage: Package
  onBookingComplete: (sessionId: string) => void
  onBack: () => void
}

export default function SessionBooking({ 
  coachId, 
  coachName, 
  selectedPackage, 
  onBookingComplete, 
  onBack 
}: SessionBookingProps) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()))
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAvailableSlots()
  }, [currentWeek, coachId])

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true)
      setError(null)

      const startDate = format(currentWeek, 'yyyy-MM-dd')
      const endDate = format(addDays(currentWeek, 6), 'yyyy-MM-dd')

      const response = await fetch(
        `/api/coaches/${coachId}/available-slots?start_date=${startDate}&end_date=${endDate}&duration=${selectedPackage.duration_minutes}`
      )
      const data = await response.json()

      if (response.ok) {
        setAvailableSlots(data.slots)
      } else {
        setError(data.error || 'Failed to fetch available slots')
      }
    } catch (err) {
      setError('Network error while fetching available slots')
    } finally {
      setLoading(false)
    }
  }

  const bookSession = async () => {
    if (!selectedSlot) return

    try {
      setBooking(true)
      setError(null)

      const response = await fetch('/api/sessions/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coach_id: coachId,
          package_id: selectedPackage.id,
          start_time: selectedSlot.start_time,
          end_time: selectedSlot.end_time,
          duration_minutes: selectedPackage.duration_minutes,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onBookingComplete(data.session.id)
      } else {
        setError(data.error || 'Failed to book session')
      }
    } catch (err) {
      setError('Network error while booking session')
    } finally {
      setBooking(false)
    }
  }

  const goToPreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
    setSelectedSlot(null)
  }

  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
    setSelectedSlot(null)
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i))

  const getSlotsByDay = (date: Date) => {
    return availableSlots.filter(slot => 
      isSameDay(parseISO(slot.start_time), date) && slot.is_available
    )
  }

  const formatTime = (dateTime: string) => {
    return format(parseISO(dateTime), 'h:mm a')
  }

  const formatDate = (date: Date) => {
    return format(date, 'EEE, MMM d')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Book Your Session</h2>
          <p className="text-muted-foreground">
            Choose an available time slot with {coachName}
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Packages
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Selected Package Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {selectedPackage.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{selectedPackage.duration_minutes} minutes</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Virtual Session</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-lg font-semibold">${(selectedPackage.price / 100).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Time Slots</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                Previous Week
              </Button>
              <span className="text-sm font-medium px-3">
                {format(currentWeek, 'MMM d')} - {format(addDays(currentWeek, 6), 'MMM d, yyyy')}
              </span>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                Next Week
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weekDays.map((day, index) => {
                const daySlots = getSlotsByDay(day)
                const isToday = isSameDay(day, new Date())
                const isPast = day < new Date() && !isToday

                return (
                  <div key={index} className="space-y-2">
                    <div className={`text-center p-2 rounded-lg ${isToday ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <div className="text-sm font-medium">{formatDate(day)}</div>
                    </div>
                    
                    <div className="space-y-1">
                      {isPast ? (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          Past
                        </p>
                      ) : daySlots.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          No slots
                        </p>
                      ) : (
                        daySlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {formatTime(slot.start_time)}
                          </Button>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Confirmation */}
      {selectedSlot && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Confirm Your Booking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Session Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Coach:</span>
                    <span>{coachName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Package:</span>
                    <span>{selectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span>
                      {format(parseISO(selectedSlot.start_time), 'EEE, MMM d, yyyy')} at{' '}
                      {formatTime(selectedSlot.start_time)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{selectedPackage.duration_minutes} minutes</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${(selectedPackage.price / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSlot(null)}
                  className="flex-1"
                >
                  Change Time
                </Button>
                <Button
                  onClick={bookSession}
                  disabled={booking}
                  className="flex-1"
                >
                  {booking ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}