import { Suspense } from 'react'
import StripeConnectOnboarding from '@/components/stripe/stripe-connect-onboarding'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StripeOnboardingPage() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Payment Setup</h1>
        <p className="text-muted-foreground mt-2">
          Set up your payment processing to start receiving payments from clients
        </p>
      </div>

      <Suspense fallback={
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      }>
        <StripeConnectOnboarding />
      </Suspense>
    </div>
  )
}