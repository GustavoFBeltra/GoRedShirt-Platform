'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, CreditCard, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth/context'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  amount: number
  coachId: string
  coachName: string
  description?: string
  onSuccess?: (paymentIntentId: string) => void
  onError?: (error: string) => void
}

function CheckoutFormInner({ 
  amount, 
  coachId, 
  coachName, 
  description = 'Coaching session',
  onSuccess,
  onError 
}: CheckoutFormProps) {
  const { user } = useAuth()
  const stripe = useStripe()
  const elements = useElements()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  // Calculate platform fee (10%)
  const platformFee = Math.round(amount * 0.10)
  const coachReceives = amount - platformFee

  useEffect(() => {
    createPaymentIntent()
  }, [amount, coachId])

  const createPaymentIntent = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          coachId,
          description,
          metadata: {
            coach_name: coachName,
          },
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setClientSecret(data.clientSecret)
      } else {
        setError(data.error || 'Failed to create payment intent')
        onError?.(data.error || 'Failed to create payment intent')
      }
    } catch (err) {
      const errorMessage = 'Network error while creating payment'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret || !user) {
      return
    }

    setLoading(true)
    setError(null)

    const card = elements.getElement(CardElement)
    if (!card) {
      setError('Card element not found')
      setLoading(false)
      return
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: user.user_metadata?.name || user.email,
          email: user.email,
        },
      },
    })

    if (error) {
      setError(error.message || 'Payment failed')
      onError?.(error.message || 'Payment failed')
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setSuccess(true)
      onSuccess?.(paymentIntent.id)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Complete Payment
        </CardTitle>
        <CardDescription>
          Payment to {coachName} for {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 mb-6">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">Payment Breakdown</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Session Amount:</span>
                <span>${(amount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Platform Fee (10%):</span>
                <span>${(platformFee / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Coach Receives:</span>
                <span>${(coachReceives / 100).toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${(amount / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {clientSecret && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 border rounded-lg">
                <label className="block text-sm font-medium mb-2">
                  Card Information
                </label>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>

              <Button 
                type="submit" 
                disabled={!stripe || loading} 
                className="w-full"
                size="lg"
              >
                {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
              </Button>
            </form>
          )}

          {loading && !clientSecret && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Your payment information is secure and encrypted. Powered by Stripe.
        </p>
      </CardContent>
    </Card>
  )
}

export default function CheckoutForm(props: CheckoutFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormInner {...props} />
    </Elements>
  )
}