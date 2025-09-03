'use client'

import { useAuth } from '@/lib/auth/context'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'

interface OnboardingLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  currentStep: number
  totalSteps: number
  onBack?: () => void
  showSkip?: boolean
  onSkip?: () => void
}

export function OnboardingLayout({
  children,
  title,
  description,
  currentStep,
  totalSteps,
  onBack,
  showSkip = false,
  onSkip,
}: OnboardingLayoutProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="text-xl font-semibold">Ryan Coach</div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.email}
              </span>
              <Button variant="ghost" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="mb-6" />
          
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{description}</p>
        </div>

        <div className="bg-card border rounded-lg p-6 mb-6">
          {children}
        </div>

        <div className="flex justify-between">
          <div>
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                Back
              </Button>
            )}
          </div>
          <div>
            {showSkip && onSkip && (
              <Button variant="ghost" onClick={onSkip}>
                Skip for now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}