'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { 
  ThemeButton, 
  ThemeCard,
  glassmorphism, 
  shadows, 
  animations, 
  textGradient 
} from '@/components/ui/theme-system'
import { cn } from '@/lib/utils'
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth/context'
import { Database, UserRole } from '@/lib/database.types'
import { createClient } from '@/lib/supabase/client'

const registerSchema = z.object({
  // Basic info
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  role: z.enum(['athlete', 'coach', 'recruiter', 'parent'] as const),
  
  // Location
  location: z.string().optional(),
  school: z.string().optional(),
  graduationYear: z.number().optional(),
  
  // Athlete-specific
  selectedSports: z.array(z.number()).optional(),
  positions: z.array(z.string()).optional(),
  
  // Coach-specific
  specializations: z.array(z.string()).optional(),
  yearsExperience: z.number().optional(),
  certifications: z.array(z.string()).optional(),
  coachBio: z.string().optional(),
  
  // Recruiter-specific
  organization: z.string().optional(),
  recruiterTitle: z.string().optional(),
  
  // Parent-specific
  childEmail: z.string().email().optional(),
  
  // Legal
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  parentalConsent: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  // Validate role-specific required fields
  if (data.role === 'athlete') {
    return data.selectedSports && data.selectedSports.length > 0
  }
  if (data.role === 'coach') {
    return data.specializations && data.specializations.length > 0
  }
  if (data.role === 'recruiter') {
    return data.organization && data.recruiterTitle
  }
  if (data.role === 'parent') {
    return data.childEmail
  }
  return true
}, {
  message: "Please complete all required fields for your selected role",
  path: ["role"],
})

type RegisterFormData = z.infer<typeof registerSchema>

interface Sport {
  id: number
  name: string
  category: string | null
}

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [sports, setSports] = useState<Sport[]>([])
  const { signUp } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      role: 'athlete',
      location: '',
      school: '',
      graduationYear: new Date().getFullYear() + 4,
      selectedSports: [],
      positions: [],
      specializations: [],
      yearsExperience: 0,
      certifications: [],
      coachBio: '',
      organization: '',
      recruiterTitle: '',
      childEmail: '',
      agreeToTerms: false,
      parentalConsent: false,
    },
  })

  // Fetch sports data
  useEffect(() => {
    const fetchSports = async () => {
      const { data } = await supabase
        .from('sports')
        .select('id, name, category')
        .eq('is_active', true)
        .order('name')
      
      if (data) {
        setSports(data)
      }
    }
    
    fetchSports()
  }, [])

  const onSubmit = async (formData: RegisterFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    // Calculate if user is a minor
    const birthYear = new Date(formData.dateOfBirth).getFullYear()
    const currentYear = new Date().getFullYear()
    const isMinor = currentYear - birthYear < 18

    // Prepare signup data
    const signupData = {
      name: `${formData.firstName} ${formData.lastName}`,
      role: formData.role as UserRole,
      dateOfBirth: formData.dateOfBirth,
      location: formData.location,
      school: formData.school,
      ...(formData.childEmail && { parentEmail: formData.childEmail }),
    }

    const { error } = await signUp(formData.email, formData.password, signupData)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        if (isMinor && formData.role === 'athlete') {
          router.push('/login?message=Account created! Parent consent required - check email.')
        } else {
          router.push('/login?message=Check your email to verify your account')
        }
      }, 2000)
    }

    setIsLoading(false)
  }

  const selectedRole = form.watch('role')
  const isMinor = form.watch('dateOfBirth') ? 
    new Date().getFullYear() - new Date(form.watch('dateOfBirth')).getFullYear() < 18 : false

  const totalSteps = selectedRole === 'athlete' ? 4 : 3

  if (success) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
        <ThemeCard variant="glass" className={cn(shadows.strong, "border-0")}>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                <CheckCircle className="w-8 h-8 text-green-600 animate-scale-in" />
              </div>
              <h3 className={cn("text-xl font-semibold mb-2", textGradient('primary'))}>
                Welcome to GoRedShirt!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {isMinor && selectedRole === 'athlete' 
                  ? 'Your account has been created! Since you\'re under 18, we\'ve sent a consent form to your parent/guardian. You can sign in once they approve.'
                  : 'Your account has been created successfully! Please check your email to verify your account before signing in.'
                }
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500 animate-pulse">
                Redirecting to sign in...
              </div>
            </div>
          </CardContent>
        </ThemeCard>
      </div>
    )
  }

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
              step < currentStep
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                : step === currentStep
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 animate-pulse'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            )}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {step < totalSteps && (
            <div
              className={cn(
                "w-12 h-0.5 transition-colors duration-300",
                step < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="animate-fade-in-up">
              <h3 className={cn("text-lg font-semibold mb-2", textGradient('primary'))}>Welcome to GoRedShirt</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Join the premier multi-sport recruiting and performance platform
              </p>
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="animate-fade-in-up animation-delay-200">
                  <FormLabel>I want to join as a</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="athlete">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Athlete</span>
                          <span className="text-xs text-muted-foreground">Track performance, connect with coaches & recruiters</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="coach">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Coach</span>
                          <span className="text-xs text-muted-foreground">Train athletes, offer services, build your reputation</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="recruiter">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Recruiter</span>
                          <span className="text-xs text-muted-foreground">Discover talent, evaluate prospects</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="parent">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Parent/Guardian</span>
                          <span className="text-xs text-muted-foreground">Support your young athlete's journey</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tell us about yourself
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  {isMinor && (
                    <p className="text-sm text-amber-600">
                      As you're under 18, parental consent will be required.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Choose a secure password"
                        disabled={isLoading}
                        className="transition-all duration-200 focus:scale-[1.01] focus:shadow-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        disabled={isLoading}
                        className="transition-all duration-200 focus:scale-[1.01] focus:shadow-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )

      case 3:
        if (selectedRole === 'athlete') {
          return (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Athletic Background</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tell us about your sports and academic background
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School</FormLabel>
                      <FormControl>
                        <Input placeholder="Your high school or college" disabled={isLoading} className="transition-all duration-200 focus:scale-[1.01] focus:shadow-md" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="graduationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Graduation Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2025"
                          disabled={isLoading}
                          className="transition-all duration-200 focus:scale-[1.01] focus:shadow-md"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State" disabled={isLoading} className="transition-all duration-200 focus:scale-[1.01] focus:shadow-md" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selectedSports"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Your Sports</FormLabel>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-4">
                      {sports.map((sport) => (
                        <div key={sport.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`sport-${sport.id}`}
                            checked={field.value?.includes(sport.id)}
                            onCheckedChange={(checked) => {
                              const currentSports = field.value || []
                              if (checked) {
                                field.onChange([...currentSports, sport.id])
                              } else {
                                field.onChange(currentSports.filter(id => id !== sport.id))
                              }
                            }}
                          />
                          <label htmlFor={`sport-${sport.id}`} className="text-sm font-medium">
                            {sport.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )
        }

        // Final step for non-athletes
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Complete Your Registration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Review and agree to our terms
              </p>
            </div>

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      I agree to the Terms of Service and Privacy Policy
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isMinor && selectedRole === 'athlete' && (
              <FormField
                control={form.control}
                name="parentalConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">
                        I have parental permission to create this account
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )

      case 4:
        // Final step for athletes
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Complete Your Registration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Review and agree to our terms
              </p>
            </div>

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      I agree to the Terms of Service and Privacy Policy
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isMinor && (
              <FormField
                control={form.control}
                name="parentalConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">
                        I have parental permission to create this account
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl",
            "bg-gradient-to-br from-red-500/20 to-red-600/10",
            "flex items-center justify-center",
            "border border-red-500/20",
            "animate-float",
            shadows.default
          )}>
            <span className="text-red-600 dark:text-red-400 font-bold text-xl">
              GR
            </span>
          </div>
        </div>
        <h1 className={cn("text-3xl font-bold mb-2", textGradient('primary'))}>
          Join GoRedShirt
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Start your athletic journey with the premier recruiting platform
        </p>
      </div>

      <ThemeCard variant="glass" className={cn("border-0", shadows.strong, "animate-scale-in animation-delay-200")}>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-red-600" />
            Step {currentStep} of {totalSteps}
          </CardTitle>
          <CardDescription>
            Complete your registration to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
        {renderStepIndicator()}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStep()}
            
            {error && (
              <div className={cn(
                "text-sm text-red-600 p-3 rounded-md border animate-fade-in-up animation-delay-300",
                "bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-900/50",
                glassmorphism.card,
                shadows.soft
              )}>
                {error}
              </div>
            )}

            <div className="flex justify-between items-center animate-fade-in-up animation-delay-400">
              {currentStep > 1 && (
                <ThemeButton
                  type="button"
                  variant="ghost"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={isLoading}
                  className="group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Previous
                </ThemeButton>
              )}
              
              <div className="flex-1" />

              {currentStep < totalSteps ? (
                <ThemeButton
                  type="button"
                  variant="primary"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={isLoading}
                  className="group"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </ThemeButton>
              ) : (
                <ThemeButton
                  type="submit"
                  variant="primary"
                  disabled={isLoading || !form.watch('agreeToTerms')}
                  className="group"
                >
                  {isLoading ? 'Creating account...' : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </ThemeButton>
              )}
            </div>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm animate-fade-in-up animation-delay-500">
          Already have an account?{' '}
          <Link href="/login" className={cn(
            "font-medium transition-all duration-200 hover:scale-105",
            textGradient('primary'),
            "hover:drop-shadow-sm"
          )}>
            Sign in
          </Link>
        </div>
      </CardContent>
    </ThemeCard>
    </div>
  )
}