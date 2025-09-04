'use client'

import { useAuth } from '@/lib/auth/context'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'
import { CoachDashboard } from '@/components/dashboard/coach-dashboard'
import { ClientDashboard } from '@/components/dashboard/client-dashboard'

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  const renderDashboard = () => {
    console.log('Dashboard: Current user role:', user?.role)
    console.log('Dashboard: User email:', user?.email)
    
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />
      case 'coach':
        return <CoachDashboard />
      case 'client':
        return <ClientDashboard />
      default:
        console.log('Dashboard: Falling back to ClientDashboard for role:', user?.role)
        return <ClientDashboard />
    }
  }

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  )
}