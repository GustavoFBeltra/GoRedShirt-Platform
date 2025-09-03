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
import { useAuth } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/client'

const coachProfileSchema = z.object({
  specializations: z.array(z.string()).min(1, 'Please select at least one specialization'),
  years_experience: z.number().min(0, 'Years of experience must be 0 or greater').max(50, 'Please enter a realistic number'),
  certifications: z.array(z.string()),
  hourly_rate: z.number().min(10, 'Minimum rate is $10/hour').max(1000, 'Maximum rate is $1000/hour'),
  bio: z.string().min(50, 'Please write at least 50 characters about your coaching approach').max(1000, 'Bio must be less than 1000 characters'),
})

type CoachProfileFormData = z.infer<typeof coachProfileSchema>

const availableSpecializations = [
  'Strength Training',
  'Cardio & Endurance',
  'Weight Loss',
  'Muscle Building',
  'Sports Performance',
  'Rehabilitation',
  'Yoga',
  'Pilates',
  'CrossFit',
  'Powerlifting',
  'Olympic Lifting',
  'Functional Fitness',
  'Senior Fitness',
  'Youth Training',
  'Nutrition Coaching',
  'Mental Performance',
]

const commonCertifications = [
  'NASM-CPT',
  'ACE-CPT',
  'ACSM-CPT',
  'NSCA-CSCS',
  'ISSA-CPT',
  'NCCPT-CPT',
  'Cooper Institute-PFT',
  'Precision Nutrition',
  'FMS (Functional Movement Screen)',
  'TRX Certified',
  'Yoga Alliance RYT-200',
  'Yoga Alliance RYT-500',
]

interface CoachProfileFormProps {
  onComplete: () => void
}

export function CoachProfileForm({ onComplete }: CoachProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([])
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([])
  const [customCertification, setCustomCertification] = useState('')
  const { user } = useAuth()
  const supabase = createClient()

  const form = useForm<CoachProfileFormData>({
    resolver: zodResolver(coachProfileSchema),
    defaultValues: {
      specializations: [],
      years_experience: 0,
      certifications: [],
      hourly_rate: 50,
      bio: '',
    },
  })

  const handleSpecializationChange = (specialization: string, checked: boolean) => {
    let updated: string[]
    if (checked) {
      updated = [...selectedSpecializations, specialization]
    } else {
      updated = selectedSpecializations.filter(s => s !== specialization)
    }
    setSelectedSpecializations(updated)
    form.setValue('specializations', updated)
  }

  const handleCertificationChange = (certification: string, checked: boolean) => {
    let updated: string[]
    if (checked) {
      updated = [...selectedCertifications, certification]
    } else {
      updated = selectedCertifications.filter(c => c !== certification)
    }
    setSelectedCertifications(updated)
    form.setValue('certifications', updated)
  }

  const addCustomCertification = () => {
    if (customCertification && !selectedCertifications.includes(customCertification)) {
      const updated = [...selectedCertifications, customCertification]
      setSelectedCertifications(updated)
      form.setValue('certifications', updated)
      setCustomCertification('')
    }
  }

  const removeCertification = (certification: string) => {
    const updated = selectedCertifications.filter(c => c !== certification)
    setSelectedCertifications(updated)
    form.setValue('certifications', updated)
  }

  const onSubmit = async (data: CoachProfileFormData) => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const { error: coachProfileError } = await supabase
        .from('coach_profiles')
        .upsert({
          user_id: user.id,
          specializations: data.specializations,
          years_experience: data.years_experience,
          certifications: data.certifications.length > 0 ? data.certifications : null,
          hourly_rate: data.hourly_rate,
          bio: data.bio,
          updated_at: new Date().toISOString(),
        })

      if (coachProfileError) {
        throw coachProfileError
      }

      onComplete()
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving your coach profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="specializations"
          render={() => (
            <FormItem>
              <FormLabel>Specializations</FormLabel>
              <FormDescription>
                Select the areas you specialize in as a coach
              </FormDescription>
              <div className="grid grid-cols-2 gap-3">
                {availableSpecializations.map((specialization) => (
                  <div key={specialization} className="flex items-center space-x-2">
                    <Checkbox
                      id={specialization}
                      checked={selectedSpecializations.includes(specialization)}
                      onCheckedChange={(checked) => 
                        handleSpecializationChange(specialization, checked as boolean)
                      }
                      disabled={isLoading}
                    />
                    <label
                      htmlFor={specialization}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {specialization}
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
          name="years_experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 5"
                  min="0"
                  max="50"
                  disabled={isLoading}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                How many years have you been coaching?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hourly_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hourly Rate (USD)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 75"
                  min="10"
                  max="1000"
                  disabled={isLoading}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Your rate per hour for one-on-one sessions (platform fee will be deducted)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="certifications"
          render={() => (
            <FormItem>
              <FormLabel>Certifications (Optional)</FormLabel>
              <FormDescription>
                Add your professional certifications to build credibility
              </FormDescription>
              
              {selectedCertifications.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCertifications.map((cert) => (
                    <Badge
                      key={cert}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeCertification(cert)}
                    >
                      {cert} ×
                    </Badge>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {commonCertifications.map((certification) => (
                    <div key={certification} className="flex items-center space-x-2">
                      <Checkbox
                        id={certification}
                        checked={selectedCertifications.includes(certification)}
                        onCheckedChange={(checked) => 
                          handleCertificationChange(certification, checked as boolean)
                        }
                        disabled={isLoading}
                      />
                      <label
                        htmlFor={certification}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {certification}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom certification"
                    value={customCertification}
                    onChange={(e) => setCustomCertification(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCustomCertification}
                    disabled={!customCertification || isLoading}
                  >
                    Add
                  </Button>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coaching Philosophy & Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell potential clients about your coaching approach, philosophy, and what makes you unique. What can clients expect when working with you?"
                  className="resize-none"
                  rows={6}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is what clients will see on your profile (50-1000 characters)
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
          {isLoading ? 'Creating Profile...' : 'Complete Setup'}
        </Button>
      </form>
    </Form>
  )
}