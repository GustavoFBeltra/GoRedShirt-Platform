'use client'

import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout'
import { ProfileForm } from '@/components/onboarding/profile-form'
import { useAuth } from '@/lib/auth/context'

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleComplete = () => {
    if (user?.role === 'coach') {
      router.push('/onboarding/coach')
    } else if (user?.role === 'client') {
      router.push('/onboarding/client')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <OnboardingLayout
      title="Complete Your Profile"
      description="Help us personalize your experience on Ryan Coach by telling us a bit about yourself."
      currentStep={1}
      totalSteps={user?.role === 'coach' ? 2 : 1}
    >
      <ProfileForm onComplete={handleComplete} />
    </OnboardingLayout>
  )
}