'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Trophy,
  Target,
  Users,
  MessageCircle,
  Calendar,
  Star,
  Play,
  Upload,
  Search,
  Heart,
  Sparkles,
  Zap,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ElementType
  component: React.ComponentType<OnboardingStepProps>
  canSkip?: boolean
  completionCriteria?: string[]
}

interface OnboardingStepProps {
  onNext: () => void
  onPrev: () => void
  onSkip?: () => void
  isFirst: boolean
  isLast: boolean
  stepData: any
  setStepData: (data: any) => void
}

interface OnboardingData {
  welcome: {
    hasWatched: boolean
  }
  profile: {
    bio: string
    goals: string[]
    experience: string
    availability: string
  }
  preferences: {
    notifications: boolean
    publicProfile: boolean
    contactable: boolean
    newsletter: boolean
  }
  firstActions: {
    completedActions: string[]
  }
  completion: {
    feedback: string
    rating: number
  }
}

// Welcome Step Component
function WelcomeStep({ onNext, isFirst, isLast }: OnboardingStepProps) {
  const { user } = useAuth()
  const [hasWatched, setHasWatched] = useState(false)

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
          <Trophy className="h-10 w-10 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to GoRedShirt, {user?.firstName || 'Athlete'}!
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You're about to join the premier platform for athletic performance and recruiting. 
            Let's get you set up for success in just a few easy steps.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
        <h3 className="font-semibold text-blue-900 mb-3">What you'll accomplish:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <span>Complete your athletic profile</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <span>Set your performance goals</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <span>Configure privacy settings</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <span>Take your first actions</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <input
            type="checkbox"
            id="welcome-video"
            checked={hasWatched}
            onChange={(e) => setHasWatched(e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="welcome-video" className="text-sm text-muted-foreground">
            I've watched the welcome video (2 mins)
          </label>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={onNext}
            disabled={!hasWatched}
            size="lg" 
            className="bg-red-600 hover:bg-red-700"
          >
            Let's Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-xs text-muted-foreground">
            This should take about 5 minutes to complete
          </p>
        </div>
      </div>
    </div>
  )
}

// Profile Setup Step
function ProfileStep({ onNext, onPrev, stepData, setStepData }: OnboardingStepProps) {
  const [bio, setBio] = useState(stepData.bio || '')
  const [selectedGoals, setSelectedGoals] = useState<string[]>(stepData.goals || [])
  const [experience, setExperience] = useState(stepData.experience || '')
  const [availability, setAvailability] = useState(stepData.availability || '')

  const goalOptions = [
    'College Recruitment',
    'Professional Development',
    'Skill Improvement',
    'Strength & Conditioning',
    'Mental Performance',
    'Injury Prevention',
    'Competition Preparation',
    'Team Leadership'
  ]

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    )
  }

  const handleNext = () => {
    setStepData({
      bio,
      goals: selectedGoals,
      experience,
      availability
    })
    onNext()
  }

  const isComplete = bio.trim().length > 20 && selectedGoals.length > 0 && experience && availability

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <Target className="mx-auto h-12 w-12 text-red-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h2>
        <p className="text-muted-foreground">
          Help coaches and recruiters understand your athletic journey and goals
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Athletic Bio <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell your story... What drives you as an athlete? What are your biggest achievements and aspirations?"
            rows={4}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {bio.length}/500 characters (minimum 20)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Primary Goals <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {goalOptions.map((goal) => (
              <div
                key={goal}
                onClick={() => handleGoalToggle(goal)}
                className={cn(
                  "p-3 border rounded-lg cursor-pointer transition-all",
                  selectedGoals.includes(goal)
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 hover:border-red-300"
                )}
              >
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    "w-4 h-4 rounded border-2 transition-all",
                    selectedGoals.includes(goal)
                      ? "bg-red-500 border-red-500"
                      : "border-gray-300"
                  )}>
                    {selectedGoals.includes(goal) && (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{goal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level <span className="text-red-500">*</span>
            </label>
            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                <SelectItem value="advanced">Advanced (5-10 years)</SelectItem>
                <SelectItem value="elite">Elite (10+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Training Availability <span className="text-red-500">*</span>
            </label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flexible">Very Flexible</SelectItem>
                <SelectItem value="regular">Regular Schedule</SelectItem>
                <SelectItem value="limited">Limited Availability</SelectItem>
                <SelectItem value="seasonal">Seasonal Training</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!isComplete}
          className="bg-red-600 hover:bg-red-700"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Preferences Step
function PreferencesStep({ onNext, onPrev, stepData, setStepData }: OnboardingStepProps) {
  const [preferences, setPreferences] = useState({
    notifications: stepData.notifications ?? true,
    publicProfile: stepData.publicProfile ?? true,
    contactable: stepData.contactable ?? true,
    newsletter: stepData.newsletter ?? false
  })

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleNext = () => {
    setStepData(preferences)
    onNext()
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <Users className="mx-auto h-12 w-12 text-red-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy & Preferences</h2>
        <p className="text-muted-foreground">
          Control how coaches and recruiters can interact with you
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="notifications"
              checked={preferences.notifications}
              onCheckedChange={() => handlePreferenceChange('notifications')}
            />
            <div className="space-y-1">
              <label htmlFor="notifications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Enable Notifications
              </label>
              <p className="text-xs text-muted-foreground">
                Receive updates about messages, opportunities, and performance insights
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="publicProfile"
              checked={preferences.publicProfile}
              onCheckedChange={() => handlePreferenceChange('publicProfile')}
            />
            <div className="space-y-1">
              <label htmlFor="publicProfile" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Public Profile
              </label>
              <p className="text-xs text-muted-foreground">
                Allow your profile to be discovered by coaches and recruiters
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="contactable"
              checked={preferences.contactable}
              onCheckedChange={() => handlePreferenceChange('contactable')}
            />
            <div className="space-y-1">
              <label htmlFor="contactable" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Accept Direct Messages
              </label>
              <p className="text-xs text-muted-foreground">
                Allow coaches and recruiters to send you direct messages
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="newsletter"
              checked={preferences.newsletter}
              onCheckedChange={() => handlePreferenceChange('newsletter')}
            />
            <div className="space-y-1">
              <label htmlFor="newsletter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Newsletter & Updates
              </label>
              <p className="text-xs text-muted-foreground">
                Receive our weekly newsletter with tips, success stories, and platform updates
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">💡 Recommendation</h3>
          <p className="text-sm text-blue-800">
            We recommend keeping your profile public and allowing direct messages to maximize opportunities. 
            You can always change these settings later in your account preferences.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext} className="bg-red-600 hover:bg-red-700">
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// First Actions Step
function FirstActionsStep({ onNext, onPrev, stepData, setStepData }: OnboardingStepProps) {
  const [completedActions, setCompletedActions] = useState<string[]>(stepData.completedActions || [])

  const actions = [
    {
      id: 'upload_photo',
      title: 'Upload Profile Photo',
      description: 'Add a professional headshot to your profile',
      icon: Upload,
      required: false
    },
    {
      id: 'add_performance',
      title: 'Log First Performance Metric',
      description: 'Track your 40-yard dash, vertical jump, or other key metric',
      icon: Trophy,
      required: true
    },
    {
      id: 'explore_coaches',
      title: 'Browse Available Coaches',
      description: 'Discover coaches who can help you reach your goals',
      icon: Search,
      required: false
    },
    {
      id: 'complete_profile',
      title: 'Complete Athletic Profile',
      description: 'Add your sports, positions, and achievements',
      icon: Star,
      required: true
    }
  ]

  const toggleAction = (actionId: string) => {
    setCompletedActions(prev => 
      prev.includes(actionId)
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    )
  }

  const handleNext = () => {
    setStepData({ completedActions })
    onNext()
  }

  const requiredActions = actions.filter(action => action.required)
  const completedRequired = requiredActions.filter(action => completedActions.includes(action.id))
  const canProceed = completedRequired.length === requiredActions.length

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <Zap className="mx-auto h-12 w-12 text-red-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Take Your First Steps</h2>
        <p className="text-muted-foreground">
          Complete these actions to get the most out of GoRedShirt
        </p>
      </div>

      <div className="space-y-4">
        {actions.map((action) => {
          const isCompleted = completedActions.includes(action.id)
          const Icon = action.icon

          return (
            <div
              key={action.id}
              onClick={() => toggleAction(action.id)}
              className={cn(
                "p-4 border rounded-lg cursor-pointer transition-all",
                isCompleted
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-red-300"
              )}
            >
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "w-6 h-6 rounded border-2 flex items-center justify-center",
                  isCompleted
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300"
                )}>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon className="h-5 w-5 text-red-600" />
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    {action.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Complete {completedRequired.length}/{requiredActions.length} required actions to continue
        </p>
        <Progress value={(completedRequired.length / requiredActions.length) * 100} className="mb-4" />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!canProceed}
          className="bg-red-600 hover:bg-red-700"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Completion Step
function CompletionStep({ onNext, onPrev, stepData, setStepData }: OnboardingStepProps) {
  const [feedback, setFeedback] = useState(stepData.feedback || '')
  const [rating, setRating] = useState(stepData.rating || 0)

  const handleFinish = () => {
    setStepData({ feedback, rating })
    // Mark onboarding as complete
    localStorage.setItem('onboarding_completed', 'true')
    onNext() // This will close the wizard
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-center">
      <div className="space-y-4">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            You're All Set! 🎉
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Welcome to the GoRedShirt community! You're now ready to connect with coaches, 
            track your performance, and take your athletic career to the next level.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6">
        <h3 className="font-semibold text-red-900 mb-3">What's Next?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col items-center space-y-2">
            <MessageCircle className="h-6 w-6 text-red-600" />
            <span className="font-medium">Start Messaging</span>
            <span className="text-muted-foreground text-center">Connect with coaches and recruiters</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Trophy className="h-6 w-6 text-red-600" />
            <span className="font-medium">Track Performance</span>
            <span className="text-muted-foreground text-center">Log your metrics and progress</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Calendar className="h-6 w-6 text-red-600" />
            <span className="font-medium">Book Sessions</span>
            <span className="text-muted-foreground text-center">Schedule training with expert coaches</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How was your onboarding experience?
          </label>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={cn(
                  "h-8 w-8 transition-colors",
                  rating >= star ? "text-yellow-500" : "text-gray-300"
                )}
              >
                <Star className="h-full w-full fill-current" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Any suggestions to improve our onboarding? (optional)"
            rows={3}
            className="max-w-md mx-auto"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Button 
          onClick={handleFinish}
          size="lg" 
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-8"
        >
          Enter GoRedShirt Platform
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Main Onboarding Wizard Component
export function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    welcome: { hasWatched: false },
    profile: { bio: '', goals: [], experience: '', availability: '' },
    preferences: { notifications: true, publicProfile: true, contactable: true, newsletter: false },
    firstActions: { completedActions: [] },
    completion: { feedback: '', rating: 0 }
  })

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Get started with GoRedShirt',
      icon: Heart,
      component: WelcomeStep
    },
    {
      id: 'profile',
      title: 'Profile Setup',
      description: 'Tell us about your athletic journey',
      icon: Target,
      component: ProfileStep
    },
    {
      id: 'preferences',
      title: 'Privacy & Preferences',
      description: 'Control your visibility and notifications',
      icon: Users,
      component: PreferencesStep
    },
    {
      id: 'first-actions',
      title: 'First Steps',
      description: 'Complete essential setup tasks',
      icon: Zap,
      component: FirstActionsStep
    },
    {
      id: 'completion',
      title: 'All Set!',
      description: 'Welcome to the community',
      icon: Award,
      component: CompletionStep
    }
  ]

  const currentStepData = steps[currentStep]
  const StepComponent = currentStepData.component

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    if (currentStepData.canSkip) {
      handleNext()
    }
  }

  const setStepData = (data: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [currentStepData.id.replace('-', '_')]: data
    }))
  }

  const progress = ((currentStep) / (steps.length - 1)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-white border-b">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-xl">GoRedShirt Setup</CardTitle>
                <CardDescription>
                  Step {currentStep + 1} of {steps.length}: {currentStepData.title}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">
                  {Math.round(progress)}% Complete
                </div>
                <Progress value={progress} className="w-32" />
              </div>
            </div>
            
            {/* Step indicators */}
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isCompleted = index < currentStep
                
                return (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all",
                      isActive 
                        ? "bg-red-100 text-red-700"
                        : isCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-400"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium hidden sm:block">{step.title}</span>
                    {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                )
              })}
            </div>
          </CardHeader>
          
          <CardContent className="p-8 min-h-[500px] flex items-center">
            <StepComponent
              onNext={handleNext}
              onPrev={handlePrev}
              onSkip={currentStepData.canSkip ? handleSkip : undefined}
              isFirst={currentStep === 0}
              isLast={currentStep === steps.length - 1}
              stepData={onboardingData[currentStepData.id.replace('-', '_') as keyof OnboardingData]}
              setStepData={setStepData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}