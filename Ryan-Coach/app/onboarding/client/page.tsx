'use client'

import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout'
import { ClientGoalsForm } from '@/components/onboarding/client-goals-form'

export default function ClientOnboardingPage() {
  const router = useRouter()

  const handleComplete = () => {
    router.push('/dashboard')
  }

  const handleBack = () => {
    router.push('/onboarding')
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  return (
    <OnboardingLayout
      title="Set Your Fitness Goals"
      description="Help us match you with the perfect coach by telling us about your fitness goals and preferences."
      currentStep={2}
      totalSteps={2}
      onBack={handleBack}
      showSkip={true}
      onSkip={handleSkip}
    >
      <ClientGoalsForm onComplete={handleComplete} />
    </OnboardingLayout>
  )
}