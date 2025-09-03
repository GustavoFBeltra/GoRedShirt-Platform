'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertCircle, CreditCard, DollarSign } from 'lucide-react'
import { useAuth } from '@/lib/auth/context'

interface AccountStatus {
  hasAccount: boolean
  accountId?: string
  onboardingComplete: boolean
  chargesEnabled: boolean
  payoutsEnabled?: boolean
  requirements?: any
}

export default function StripeConnectOnboarding() {
  const { user } = useAuth()
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAccountStatus()
  }, [])

  const checkAccountStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stripe/connect/account-status')
      const data = await response.json()
      
      if (response.ok) {
        setAccountStatus(data)
      } else {
        setError(data.error || 'Failed to check account status')
      }
    } catch (err) {
      setError('Network error while checking account status')
    } finally {
      setLoading(false)
    }
  }

  const createAccount = async () => {
    if (!user) return
    
    try {
      setCreating(true)
      setError(null)

      const response = await fetch('/api/stripe/connect/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })

      const data = await response.json()

      if (response.ok) {
        await checkAccountStatus() // Refresh status
      } else {
        setError(data.error || 'Failed to create account')
      }
    } catch (err) {
      setError('Network error while creating account')
    } finally {
      setCreating(false)
    }
  }

  const startOnboarding = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/stripe/connect/onboarding-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to Stripe onboarding
        window.location.href = data.onboardingUrl
      } else {
        setError(data.error || 'Failed to start onboarding')
      }
    } catch (err) {
      setError('Network error while starting onboarding')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !accountStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Payment Setup...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Setup
          </CardTitle>
          <CardDescription>
            Set up your payment processing to receive payments from clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {!accountStatus?.hasAccount ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To receive payments from clients, you need to create a Stripe Connect account.
                This allows us to process payments securely and transfer your earnings directly to your bank account.
              </p>
              <Button 
                onClick={createAccount} 
                disabled={creating}
                className="w-full"
              >
                {creating ? 'Creating Account...' : 'Create Payment Account'}
              </Button>
            </div>
          ) : !accountStatus.onboardingComplete ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Complete your payment setup to start receiving payments</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your payment account has been created, but you need to complete the setup process
                with Stripe to verify your identity and add your bank account details.
              </p>
              <Button 
                onClick={startOnboarding} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Loading...' : 'Complete Payment Setup'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Payment setup complete!</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Charges</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {accountStatus.chargesEnabled ? 'Enabled' : 'Pending'}
                  </span>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Payouts</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {accountStatus.payoutsEnabled ? 'Enabled' : 'Pending'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Your payment processing is set up and ready. You can now receive payments from clients.
              </p>

              <Button 
                onClick={checkAccountStatus} 
                variant="outline"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Refreshing...' : 'Refresh Status'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}