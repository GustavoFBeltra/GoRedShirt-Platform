'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, DollarSign, Clock, Users, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'

interface Package {
  id: string
  name: string
  description: string
  price: number // in cents
  duration_minutes: number
  session_count: number
  package_type: 'individual' | 'group' | 'package'
  is_active: boolean
  created_at: string
}

interface PackageFormData {
  name: string
  description: string
  price: number
  duration_minutes: number
  session_count: number
  package_type: 'individual' | 'group' | 'package'
  is_active: boolean
}

export default function PricingManagement() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PackageFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      duration_minutes: 60,
      session_count: 1,
      package_type: 'individual',
      is_active: true,
    }
  })

  const packageType = watch('package_type')

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/coach/pricing')
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

  const onSubmit = async (formData: PackageFormData) => {
    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch('/api/coach/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setPackages([data.package, ...packages])
        setShowForm(false)
        reset()
      } else {
        setError(data.error || 'Failed to create package')
      }
    } catch (err) {
      setError('Network error while creating package')
    } finally {
      setSubmitting(false)
    }
  }

  const getPackageTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return <Users className="h-4 w-4" />
      case 'group': return <Users className="h-4 w-4" />
      case 'package': return <Plus className="h-4 w-4" />
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pricing Management</CardTitle>
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Pricing Management</h2>
          <p className="text-muted-foreground">
            Create and manage your coaching packages and pricing
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Package'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Package</CardTitle>
            <CardDescription>
              Set up a new coaching package with pricing and session details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Package Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., 1-on-1 Training Session"
                    {...register('name', { required: 'Package name is required' })}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package_type">Package Type</Label>
                  <Select onValueChange={(value: any) => setValue('package_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select package type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual Session</SelectItem>
                      <SelectItem value="group">Group Session</SelectItem>
                      <SelectItem value="package">Session Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    min="15"
                    step="15"
                    placeholder="60"
                    {...register('duration_minutes', { 
                      required: 'Duration is required',
                      min: { value: 15, message: 'Minimum 15 minutes' }
                    })}
                  />
                  {errors.duration_minutes && (
                    <p className="text-sm text-destructive">{errors.duration_minutes.message}</p>
                  )}
                </div>

                {packageType === 'package' && (
                  <div className="space-y-2">
                    <Label htmlFor="session_count">Number of Sessions</Label>
                    <Input
                      id="session_count"
                      type="number"
                      min="1"
                      placeholder="4"
                      {...register('session_count', { 
                        min: { value: 1, message: 'Minimum 1 session' }
                      })}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what's included in this package..."
                  rows={3}
                  {...register('description')}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Package'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card key={pkg.id} className={`relative ${!pkg.is_active ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getPackageTypeIcon(pkg.package_type)}
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                </div>
                <Badge variant={pkg.is_active ? 'default' : 'secondary'}>
                  {pkg.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {getPackageTypeLabel(pkg.package_type)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-2xl font-bold">${(pkg.price / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {pkg.duration_minutes}min
                  </div>
                </div>

                {pkg.session_count > 1 && (
                  <div className="text-sm text-muted-foreground">
                    {pkg.session_count} sessions included
                  </div>
                )}

                {pkg.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {pkg.description}
                  </p>
                )}

                <div className="pt-2 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Package
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
            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No packages yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first pricing package to start accepting payments from clients.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Package
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}