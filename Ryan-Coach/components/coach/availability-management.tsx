'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Clock, Calendar, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'

interface AvailabilitySlot {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  timezone: string
  is_active: boolean
  effective_date: string | null
  end_date: string | null
}

interface AvailabilityFormData {
  day_of_week: number
  start_time: string
  end_time: string
  timezone: string
  effective_date: string
  end_date: string
}

const daysOfWeek = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
]

export default function AvailabilityManagement() {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<AvailabilityFormData>({
    defaultValues: {
      day_of_week: 1, // Monday
      start_time: '09:00',
      end_time: '17:00',
      timezone: 'UTC',
      effective_date: new Date().toISOString().split('T')[0],
      end_date: '',
    }
  })

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/coach/availability')
      const data = await response.json()

      if (response.ok) {
        setAvailability(data.availability)
      } else {
        setError(data.error || 'Failed to fetch availability')
      }
    } catch (err) {
      setError('Network error while fetching availability')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (formData: AvailabilityFormData) => {
    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch('/api/coach/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          end_date: formData.end_date || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAvailability([data.availability, ...availability])
        setShowForm(false)
        reset()
      } else {
        setError(data.error || 'Failed to create availability')
      }
    } catch (err) {
      setError('Network error while creating availability')
    } finally {
      setSubmitting(false)
    }
  }

  const deleteAvailability = async (id: string) => {
    try {
      const response = await fetch(`/api/coach/availability/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setAvailability(availability.filter(slot => slot.id !== id))
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete availability')
      }
    } catch (err) {
      setError('Network error while deleting availability')
    }
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const getDayName = (dayOfWeek: number) => {
    return daysOfWeek.find(day => day.value === dayOfWeek)?.label || 'Unknown'
  }

  const getTimezone = (timezone: string) => {
    return timezones.find(tz => tz.value === timezone)?.label || timezone
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Availability Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Availability Management</h2>
          <p className="text-muted-foreground">
            Set your weekly availability for clients to book sessions
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Availability'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Availability</CardTitle>
            <CardDescription>
              Define when you&apos;re available for coaching sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day_of_week">Day of Week</Label>
                  <Select onValueChange={(value) => setValue('day_of_week', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select onValueChange={(value) => setValue('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    {...register('start_time', { required: 'Start time is required' })}
                  />
                  {errors.start_time && (
                    <p className="text-sm text-destructive">{errors.start_time.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    {...register('end_time', { required: 'End time is required' })}
                  />
                  {errors.end_time && (
                    <p className="text-sm text-destructive">{errors.end_time.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="effective_date">Start Date</Label>
                  <Input
                    id="effective_date"
                    type="date"
                    {...register('effective_date', { required: 'Start date is required' })}
                  />
                  {errors.effective_date && (
                    <p className="text-sm text-destructive">{errors.effective_date.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date (Optional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    {...register('end_date')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank for ongoing availability
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Availability'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availability.map((slot) => (
          <Card key={slot.id} className={`relative ${!slot.is_active ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <CardTitle className="text-lg">{getDayName(slot.day_of_week)}</CardTitle>
                </div>
                <Badge variant={slot.is_active ? 'default' : 'secondary'}>
                  {slot.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {getTimezone(slot.timezone)}
                </p>

                {slot.effective_date && (
                  <p className="text-sm text-muted-foreground">
                    From: {new Date(slot.effective_date).toLocaleDateString()}
                    {slot.end_date && ` Until: ${new Date(slot.end_date).toLocaleDateString()}`}
                  </p>
                )}

                <div className="pt-2 border-t flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteAvailability(slot.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {availability.length === 0 && !loading && (
        <Card>
          <CardContent className="py-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No availability set</h3>
            <p className="text-muted-foreground mb-4">
              Set your availability so clients can book sessions with you.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Set Your Availability
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}