'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import AthleteSearch from '@/components/discovery/athlete-search'

export default function DiscoveryPage() {
  return (
    <DashboardLayout>
      <AthleteSearch />
    </DashboardLayout>
  )
}