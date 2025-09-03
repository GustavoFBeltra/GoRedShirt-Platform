'use client'

import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout'
import { CoachProfileForm } from '@/components/onboarding/coach-profile-form'

export default function CoachOnboardingPage() {
  const router = useRouter()

  const handleComplete = () => {
    router.push('/dashboard')
  }

  const handleBack = () => {
    router.push('/onboarding')
  }

  return (
    <OnboardingLayout
      title="Set Up Your Coach Profile"
      description="Complete your coaching profile to start attracting clients and building your business on Ryan Coach."
      currentStep={2}
      totalSteps={2}
      onBack={handleBack}
    >
      <CoachProfileForm onComplete={handleComplete} />
    </OnboardingLayout>
  )
}