'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/client'

const clientGoalsSchema = z.object({
  fitness_level: z.string().min(1, 'Please select your fitness level'),
  training_frequency: z.string().min(1, 'Please select your preferred training frequency'),
  preferred_session_duration: z.number().min(30, 'Minimum session duration is 30 minutes'),
  preferred_times: z.array(z.string()).min(1, 'Please select at least one preferred time'),
  fitness_goals: z.array(z.string()).min(1, 'Please select at least one fitness goal'),
  budget_min: z.number().min(10, 'Minimum budget is $10/hour'),
  budget_max: z.number().min(10, 'Maximum budget must be at least $10/hour'),
  health_conditions: z.array(z.string()),
  specific_goals: z.string().optional(),
})

type ClientGoalsFormData = z.infer<typeof clientGoalsSchema>

const fitnessLevels = [
  { value: 'beginner', label: 'Beginner - New to fitness' },
  { value: 'intermediate', label: 'Intermediate - Some experience' },
  { value: 'advanced', label: 'Advanced - Very experienced' },
  { value: 'athlete', label: 'Athlete - Competitive level' },
]

const trainingFrequencies = [
  { value: '1x per week', label: '1x per week' },
  { value: '2-3x per week', label: '2-3x per week' },
  { value: '4-5x per week', label: '4-5x per week' },
  { value: '6+ per week', label: '6+ per week' },
]

const sessionDurations = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' },
  { value: 90, label: '90 minutes' },
]

const preferredTimes = [
  'Early Morning (6-8 AM)',
  'Morning (8-11 AM)',
  'Lunch (11 AM-2 PM)',
  'Afternoon (2-5 PM)',
  'Evening (5-8 PM)',
  'Night (8+ PM)',
]

const fitnessGoals = [
  'Weight Loss',
  'Muscle Building',
  'Strength Training',
  'Endurance/Cardio',
  'Flexibility/Mobility',
  'Sports Performance',
  'General Fitness',
  'Rehabilitation',
  'Stress Management',
  'Body Composition',
]

const commonHealthConditions = [
  'Back Pain',
  'Knee Problems',
  'Arthritis',
  'High Blood Pressure',
  'Diabetes',
  'Heart Condition',
  'Previous Injuries',
  'Pregnancy',
]

interface ClientGoalsFormProps {
  onComplete: () => void
}

export function ClientGoalsForm({ onComplete }: ClientGoalsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [selectedHealthConditions, setSelectedHealthConditions] = useState<string[]>([])
  const { user } = useAuth()
  const supabase = createClient()

  const form = useForm<ClientGoalsFormData>({
    resolver: zodResolver(clientGoalsSchema),
    defaultValues: {
      fitness_level: '',
      training_frequency: '',
      preferred_session_duration: 60,
      preferred_times: [],
      fitness_goals: [],
      budget_min: 50,
      budget_max: 100,
      health_conditions: [],
      specific_goals: '',
    },
  })

  const handleTimeChange = (time: string, checked: boolean) => {
    let updated: string[]
    if (checked) {
      updated = [...selectedTimes, time]
    } else {
      updated = selectedTimes.filter(t => t !== time)
    }
    setSelectedTimes(updated)
    form.setValue('preferred_times', updated)
  }

  const handleGoalChange = (goal: string, checked: boolean) => {
    let updated: string[]
    if (checked) {
      updated = [...selectedGoals, goal]
    } else {
      updated = selectedGoals.filter(g => g !== goal)
    }
    setSelectedGoals(updated)
    form.setValue('fitness_goals', updated)
  }

  const handleHealthConditionChange = (condition: string, checked: boolean) => {
    let updated: string[]
    if (checked) {
      updated = [...selectedHealthConditions, condition]
    } else {
      updated = selectedHealthConditions.filter(c => c !== condition)
    }
    setSelectedHealthConditions(updated)
    form.setValue('health_conditions', updated)
  }

  const onSubmit = async (data: ClientGoalsFormData) => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      // Update client preferences in profiles
      const clientPreferences = {
        fitness_level: data.fitness_level,
        training_frequency: data.training_frequency,
        preferred_session_duration: data.preferred_session_duration,
        preferred_times: data.preferred_times,
        health_conditions: data.health_conditions,
        fitness_goals: data.fitness_goals,
        budget_range: {
          min: data.budget_min,
          max: data.budget_max,
        },
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          client_preferences: clientPreferences,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      if (profileError) {
        throw profileError
      }

      // Create specific goals if provided
      if (data.specific_goals) {
        const goals = data.specific_goals.split('\n').filter(goal => goal.trim())
        
        for (const goalText of goals) {
          if (goalText.trim()) {
            const { error: goalError } = await supabase
              .from('client_goals')
              .insert({
                client_id: user.id,
                goal_type: 'custom',
                title: goalText.trim(),
                description: `Personal goal: ${goalText.trim()}`,
              })

            if (goalError) {
              console.error('Error inserting goal:', goalError)
            }
          }
        }
      }

      onComplete()
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving your goals')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fitness_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Fitness Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your fitness level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fitnessLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fitness_goals"
          render={() => (
            <FormItem>
              <FormLabel>Fitness Goals</FormLabel>
              <FormDescription>
                What would you like to achieve with coaching?
              </FormDescription>
              <div className="grid grid-cols-2 gap-3">
                {fitnessGoals.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={selectedGoals.includes(goal)}
                      onCheckedChange={(checked) => 
                        handleGoalChange(goal, checked as boolean)
                      }
                      disabled={isLoading}
                    />
                    <label
                      htmlFor={goal}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {goal}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="training_frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Training Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How often would you like to train?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {trainingFrequencies.map((frequency) => (
                    <SelectItem key={frequency.value} value={frequency.value}>
                      {frequency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferred_session_duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Session Duration</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How long per session?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sessionDurations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value.toString()}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferred_times"
          render={() => (
            <FormItem>
              <FormLabel>Preferred Training Times</FormLabel>
              <FormDescription>
                When do you prefer to work out?
              </FormDescription>
              <div className="grid grid-cols-2 gap-3">
                {preferredTimes.map((time) => (
                  <div key={time} className="flex items-center space-x-2">
                    <Checkbox
                      id={time}
                      checked={selectedTimes.includes(time)}
                      onCheckedChange={(checked) => 
                        handleTimeChange(time, checked as boolean)
                      }
                      disabled={isLoading}
                    />
                    <label
                      htmlFor={time}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {time}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budget_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Range (USD/hour)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Min"
                    min="10"
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="budget_max"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-transparent">Budget Max</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Max"
                    min="10"
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="health_conditions"
          render={() => (
            <FormItem>
              <FormLabel>Health Conditions (Optional)</FormLabel>
              <FormDescription>
                Let coaches know about any conditions they should consider
              </FormDescription>
              <div className="grid grid-cols-2 gap-3">
                {commonHealthConditions.map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={condition}
                      checked={selectedHealthConditions.includes(condition)}
                      onCheckedChange={(checked) => 
                        handleHealthConditionChange(condition, checked as boolean)
                      }
                      disabled={isLoading}
                    />
                    <label
                      htmlFor={condition}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specific_goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specific Goals (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter specific goals, one per line. For example:&#10;Lose 20 pounds by summer&#10;Run a 5K in under 25 minutes&#10;Bench press my body weight"
                  className="resize-none"
                  rows={4}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter any specific, measurable goals you'd like to achieve
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Saving Goals...' : 'Complete Setup'}
        </Button>
      </form>
    </Form>
  )
}