'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, DollarSign, Users, Calendar, AlertCircle } from 'lucide-react'
import CheckoutForm from '@/components/payment/checkout-form'
import SessionBooking from '@/components/client/session-booking'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Package {
  id: string
  name: string
  description: string
  price: number // in cents
  duration_minutes: number
  session_count: number
  package_type: 'individual' | 'group' | 'package'
  is_active: boolean
  coach_id: string
}

interface Coach {
  user_id: string
  profiles: {
    name: string
  }
}

interface CoachPackagesProps {
  coachId: string
  coachName: string
}

export default function CoachPackages({ coachId, coachName }: CoachPackagesProps) {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showBooking, setShowBooking] = useState(false)

  useEffect(() => {
    fetchPackages()
  }, [coachId])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/coaches/${coachId}/packages`)
      const data = await response.json()

      if (response.ok) {
        setPackages(data.packages)
      } else {
        setError(data.error || 'Failed to fetch packages')
      }
    } catch (err) {
      setError('Network error while fetching packages')
    } finally {
      setLoading(false)
    }
  }

  const handleBookSession = (pkg: Package) => {
    setSelectedPackage(pkg)
    setShowBooking(true)
  }

  const handleBookingComplete = (sessionId: string) => {
    console.log('Session booked:', sessionId)
    setShowBooking(false)
    setSelectedPackage(null)
    // Here you would typically redirect to a success page or show booking confirmation
  }

  const handleBackFromBooking = () => {
    setShowBooking(false)
    setSelectedPackage(null)
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('Payment successful:', paymentIntentId)
    setShowCheckout(false)
    setSelectedPackage(null)
    // Here you would typically redirect to a success page or show confirmation
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    // Error is already handled by the checkout form
  }

  const getPackageTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return <Users className="h-4 w-4" />
      case 'group': return <Users className="h-4 w-4" />
      case 'package': return <Calendar className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  const getPackageTypeLabel = (type: string) => {
    switch (type) {
      case 'individual': return 'Individual Session'
      case 'group': return 'Group Session'
      case 'package': return 'Session Package'
      default: return type
    }
  }

  if (showBooking && selectedPackage) {
    return (
      <SessionBooking
        coachId={coachId}
        coachName={coachName}
        selectedPackage={selectedPackage}
        onBookingComplete={handleBookingComplete}
        onBack={handleBackFromBooking}
      />
    )
  }

  if (showCheckout && selectedPackage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Complete Your Booking</h2>
          <Button variant="outline" onClick={() => setShowCheckout(false)}>
            Back to Packages
          </Button>
        </div>

        <CheckoutForm
          amount={selectedPackage.price}
          coachId={coachId}
          coachName={coachName}
          description={selectedPackage.name}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Sessions</CardTitle>
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
      <div>
        <h2 className="text-2xl font-bold">Available Sessions</h2>
        <p className="text-muted-foreground">
          Choose from {coachName}&apos;s coaching packages
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getPackageTypeIcon(pkg.package_type)}
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                </div>
                <Badge variant="outline">
                  {getPackageTypeLabel(pkg.package_type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-3xl font-bold">${(pkg.price / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {pkg.duration_minutes} min
                  </div>
                </div>

                {pkg.session_count > 1 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Package Deal: {pkg.session_count} sessions included
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      ${((pkg.price / pkg.session_count) / 100).toFixed(2)} per session
                    </p>
                  </div>
                )}

                {pkg.description && (
                  <p className="text-sm text-muted-foreground">
                    {pkg.description}
                  </p>
                )}

                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => handleBookSession(pkg)}
                    className="w-full"
                    size="lg"
                  >
                    Book Now - ${(pkg.price / 100).toFixed(2)}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && !loading && (
        <Card>
          <CardContent className="py-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No sessions available</h3>
            <p className="text-muted-foreground">
              This coach hasn&apos;t set up any coaching packages yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}