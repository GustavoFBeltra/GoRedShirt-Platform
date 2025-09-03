'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Activity, 
  Target, 
  Calendar, 
  Clock, 
  MapPin,
  Info,
  CheckCircle2,
  Plus,
  X
} from 'lucide-react'
import { METRICS_CATALOG, getMetricById, getPerformanceRating, type MetricDefinition } from '@/lib/metrics/metrics-catalog'

const metricEntrySchema = z.object({
  metric_id: z.string().min(1, 'Please select a metric'),
  value: z.string().min(1, 'Value is required'),
  session_date: z.string().min(1, 'Date is required'),
  session_type: z.enum(['training', 'game', 'combine', 'test']),
  location: z.string().optional(),
  notes: z.string().optional(),
  conditions: z.string().optional()
})

type MetricEntryForm = z.infer<typeof metricEntrySchema>

interface MetricEntryFormProps {
  sport?: string
  onSubmit?: (data: MetricEntryForm & { parsed_value: number }) => void
  onCancel?: () => void
}

export default function MetricEntryForm({ sport = 'universal', onSubmit, onCancel }: MetricEntryFormProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricDefinition | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<MetricEntryForm>({
    resolver: zodResolver(metricEntrySchema),
    defaultValues: {
      session_date: new Date().toISOString().split('T')[0],
      session_type: 'training'
    }
  })

  const availableMetrics = METRICS_CATALOG.filter(
    metric => metric.sport === sport || metric.sport === 'universal'
  )

  const handleMetricSelect = (metricId: string) => {
    const metric = getMetricById(metricId)
    setSelectedMetric(metric || null)
    form.setValue('metric_id', metricId)
  }

  const parseValue = (value: string, metric: MetricDefinition): number => {
    // Handle time format (MM:SS or SS.MS)
    if (metric.data_type === 'time') {
      if (value.includes(':')) {
        const [minutes, seconds] = value.split(':')
        return parseFloat(minutes) * 60 + parseFloat(seconds)
      }
      return parseFloat(value)
    }
    
    return parseFloat(value) || 0
  }

  const handleSubmit = async (data: MetricEntryForm) => {
    if (!selectedMetric) return
    
    setIsSubmitting(true)
    
    try {
      const parsedValue = parseValue(data.value, selectedMetric)
      
      if (onSubmit) {
        await onSubmit({
          ...data,
          parsed_value: parsedValue
        })
      }
      
      // Reset form on success
      form.reset()
      setSelectedMetric(null)
      
    } catch (error) {
      console.error('Error submitting metric:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInputPlaceholder = (metric: MetricDefinition) => {
    switch (metric.data_type) {
      case 'time':
        return metric.unit === 'seconds' ? '4.52 or 4:52' : 'MM:SS or SS.MS'
      case 'percentage':
        return '85.5'
      case 'count':
        return '12'
      default:
        return `Enter ${metric.unit}`
    }
  }

  const getRatingBadgeColor = (rating: string) => {
    switch (rating) {
      case 'excellent':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'good':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'average':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const currentValue = form.watch('value')
  const currentRating = selectedMetric && currentValue ? 
    getPerformanceRating(selectedMetric.id, parseValue(currentValue, selectedMetric)) : null

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Track Performance
        </CardTitle>
        <CardDescription>
          Log your athletic performance metrics and track progress over time
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Metric Selection */}
          <div className="space-y-2">
            <Label>Select Metric</Label>
            <Select onValueChange={handleMetricSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a metric to track" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {/* Group by category */}
                {['speed', 'strength', 'agility', 'endurance', 'skill', 'body_composition'].map(category => {
                  const categoryMetrics = availableMetrics.filter(m => m.category === category)
                  if (categoryMetrics.length === 0) return null
                  
                  return (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground capitalize">
                        {category.replace('_', ' ')}
                      </div>
                      {categoryMetrics.map(metric => (
                        <SelectItem key={metric.id} value={metric.id}>
                          <div className="flex items-center gap-2">
                            <span>{metric.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {metric.unit}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  )
                })}
              </SelectContent>
            </Select>
            {form.formState.errors.metric_id && (
              <p className="text-sm text-red-600">{form.formState.errors.metric_id.message}</p>
            )}
          </div>

          {/* Selected Metric Info */}
          {selectedMetric && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>{selectedMetric.name}:</strong> {selectedMetric.description}</p>
                  {selectedMetric.instructions && (
                    <p className="text-sm text-muted-foreground">{selectedMetric.instructions}</p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Value Input */}
          {selectedMetric && (
            <div className="space-y-2">
              <Label>Value ({selectedMetric.unit})</Label>
              <div className="flex gap-2">
                <Input
                  {...form.register('value')}
                  placeholder={getInputPlaceholder(selectedMetric)}
                  className="flex-1"
                />
                {currentRating && (
                  <Badge variant="outline" className={getRatingBadgeColor(currentRating)}>
                    {currentRating}
                  </Badge>
                )}
              </div>
              {form.formState.errors.value && (
                <p className="text-sm text-red-600">{form.formState.errors.value.message}</p>
              )}
            </div>
          )}

          {/* Session Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                {...form.register('session_date')}
              />
              {form.formState.errors.session_date && (
                <p className="text-sm text-red-600">{form.formState.errors.session_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Session Type</Label>
              <Select 
                value={form.watch('session_type')} 
                onValueChange={(value) => form.setValue('session_type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="training">🏃‍♂️ Training</SelectItem>
                  <SelectItem value="game">🏆 Game</SelectItem>
                  <SelectItem value="combine">⚡ Combine</SelectItem>
                  <SelectItem value="test">📊 Test</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Location (optional)</Label>
              <Input
                {...form.register('location')}
                placeholder="e.g., School gym, Training facility"
              />
            </div>

            <div className="space-y-2">
              <Label>Conditions (optional)</Label>
              <Input
                {...form.register('conditions')}
                placeholder="e.g., Indoor, 72°F, turf surface"
              />
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                {...form.register('notes')}
                placeholder="Any additional notes about this performance..."
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !selectedMetric}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save Metric
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}