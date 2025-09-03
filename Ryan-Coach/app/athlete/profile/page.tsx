'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import AthleteProfile from '@/components/athlete/athlete-profile'

export default function AthleteProfilePage() {
  return (
    <DashboardLayout>
      <AthleteProfile />
    </DashboardLayout>
  )
}