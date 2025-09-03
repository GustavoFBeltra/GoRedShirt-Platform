'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, X, Camera, TrendingUp, AlertCircle } from 'lucide-react'

const progressSchema = z.object({
  weight: z.number().min(30).max(300).optional(),
  mood_score: z.number().min(1).max(10),
  energy_level: z.number().min(1).max(10),
  sleep_quality: z.number().min(1).max(10).optional(),
  stress_level: z.number().min(1).max(10).optional(),
  notes: z.string().max(1000).optional(),
  measurements: z.record(z.string(), z.number()).optional(),
  workout_intensity: z.number().min(1).max(10).optional(),
  nutrition_adherence: z.number().min(1).max(10).optional(),
})

type ProgressFormData = z.infer<typeof progressSchema>

interface ProgressEntryFormProps {
  onEntrySubmitted?: (entryId: string) => void
  onCancel?: () => void
}

export default function ProgressEntryForm({ onEntrySubmitted, onCancel }: ProgressEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [customMeasurements, setCustomMeasurements] = useState<{ name: string; value: number }[]>([])
  const [newMeasurementName, setNewMeasurementName] = useState('')
  const [newMeasurementValue, setNewMeasurementValue] = useState('')
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProgressFormData>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      mood_score: 5,
      energy_level: 5,
      sleep_quality: 5,
      stress_level: 5,
      workout_intensity: 5,
      nutrition_adherence: 5,
    }
  })

  const watchedValues = watch()

  const addCustomMeasurement = () => {
    if (newMeasurementName && newMeasurementValue) {
      const value = parseFloat(newMeasurementValue)
      if (!isNaN(value)) {
        setCustomMeasurements(prev => [...prev, { name: newMeasurementName, value }])
        setNewMeasurementName('')
        setNewMeasurementValue('')
      }
    }
  }

  const removeCustomMeasurement = (index: number) => {
    setCustomMeasurements(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProgressFormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      // Build measurements object
      const measurements: Record<string, number> = {}
      customMeasurements.forEach(measurement => {
        measurements[measurement.name] = measurement.value
      })

      const progressData = {
        ...data,
        measurements: Object.keys(measurements).length > 0 ? measurements : undefined,
      }

      const response = await fetch('/api/client/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData),
      })

      const result = await response.json()

      if (response.ok) {
        onEntrySubmitted?.(result.entry.id)
      } else {
        setSubmitError(result.error || 'Failed to save progress entry')
      }
    } catch (error) {
      setSubmitError('Network error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-red-600'
    if (score <= 6) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <CardTitle>Progress Entry</CardTitle>
          </div>
          <CardDescription>
            Track your fitness journey with detailed progress metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Weight Section */}
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="e.g., 70.5"
                {...register('weight', { valueAsNumber: true })}
              />
              {errors.weight && (
                <p className="text-sm text-red-600">{errors.weight.message}</p>
              )}
            </div>

            {/* Mood & Energy */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label>Mood Score</Label>
                <div className="space-y-2">
                  <Slider
                    value={[watchedValues.mood_score]}
                    onValueChange={(value) => setValue('mood_score', value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Poor</span>
                    <span className={`font-medium ${getScoreColor(watchedValues.mood_score)}`}>
                      {watchedValues.mood_score}/10
                    </span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Energy Level</Label>
                <div className="space-y-2">
                  <Slider
                    value={[watchedValues.energy_level]}
                    onValueChange={(value) => setValue('energy_level', value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Low</span>
                    <span className={`font-medium ${getScoreColor(watchedValues.energy_level)}`}>
                      {watchedValues.energy_level}/10
                    </span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wellness Metrics */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label>Sleep Quality</Label>
                <div className="space-y-2">
                  <Slider
                    value={[watchedValues.sleep_quality || 5]}
                    onValueChange={(value) => setValue('sleep_quality', value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Poor</span>
                    <span className={`font-medium ${getScoreColor(watchedValues.sleep_quality || 5)}`}>
                      {watchedValues.sleep_quality || 5}/10
                    </span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Stress Level</Label>
                <div className="space-y-2">
                  <Slider
                    value={[watchedValues.stress_level || 5]}
                    onValueChange={(value) => setValue('stress_level', value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Low</span>
                    <span className={`font-medium ${getScoreColor(11 - (watchedValues.stress_level || 5))}`}>
                      {watchedValues.stress_level || 5}/10
                    </span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fitness Metrics */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label>Workout Intensity</Label>
                <div className="space-y-2">
                  <Slider
                    value={[watchedValues.workout_intensity || 5]}
                    onValueChange={(value) => setValue('workout_intensity', value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Light</span>
                    <span className={`font-medium ${getScoreColor(watchedValues.workout_intensity || 5)}`}>
                      {watchedValues.workout_intensity || 5}/10
                    </span>
                    <span>Intense</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Nutrition Adherence</Label>
                <div className="space-y-2">
                  <Slider
                    value={[watchedValues.nutrition_adherence || 5]}
                    onValueChange={(value) => setValue('nutrition_adherence', value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Poor</span>
                    <span className={`font-medium ${getScoreColor(watchedValues.nutrition_adherence || 5)}`}>
                      {watchedValues.nutrition_adherence || 5}/10
                    </span>
                    <span>Perfect</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Measurements */}
            <div className="space-y-4">
              <Label>Custom Measurements</Label>
              
              {customMeasurements.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {customMeasurements.map((measurement, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-2">
                      {measurement.name}: {measurement.value}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeCustomMeasurement(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="Measurement name (e.g., chest, waist)"
                  value={newMeasurementName}
                  onChange={(e) => setNewMeasurementName(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Value"
                  value={newMeasurementValue}
                  onChange={(e) => setNewMeasurementValue(e.target.value)}
                  className="w-24"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addCustomMeasurement}
                  disabled={!newMeasurementName || !newMeasurementValue}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Progress Notes</Label>
              <Textarea
                id="notes"
                placeholder="How are you feeling? Any observations about your progress?"
                {...register('notes')}
                rows={3}
              />
              {errors.notes && (
                <p className="text-sm text-red-600">{errors.notes.message}</p>
              )}
            </div>

            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 justify-end">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Progress'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}