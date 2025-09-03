'use client'

import { useAuth } from '@/lib/auth/context'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'
import { CoachDashboard } from '@/components/dashboard/coach-dashboard'
import { ClientDashboard } from '@/components/dashboard/client-dashboard'
import { RecruiterDashboard } from '@/components/dashboard/recruiter-dashboard'
import { ParentDashboard } from '@/components/dashboard/parent-dashboard'

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
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />
      case 'coach':
        return <CoachDashboard />
      case 'client':
        return <ClientDashboard />
      default:
        return <ClientDashboard />
    }
  }

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  )
}