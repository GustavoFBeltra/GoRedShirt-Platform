'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, BarChart3, Trophy, Target } from 'lucide-react'
import SportsPerformanceTracker from '@/components/performance/sports-performance-tracker'
import MetricEntryForm from '@/components/metrics/metric-entry-form'

export default function SportsPerformancePage() {
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [selectedSport, setSelectedSport] = useState<'football' | 'soccer' | 'basketball'>('football')

  const handleMetricSubmit = async (data: any) => {
    // In production, this would save to Supabase
    console.log('New metric entry:', data)
    
    // Show success message and close form
    setShowEntryForm(false)
    
    // Here you would typically refresh the performance data
    // or update the local state to reflect the new metric
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent dark:from-white dark:to-red-400">
              Sports Performance Tracker
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your athletic performance, set goals, and monitor progress over time
            </p>
          </div>
          <Button 
            onClick={() => setShowEntryForm(true)}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Metric
          </Button>
        </div>

        {showEntryForm ? (
          <MetricEntryForm
            sport={selectedSport}
            onSubmit={handleMetricSubmit}
            onCancel={() => setShowEntryForm(false)}
          />
        ) : (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tracker">Performance Tracker</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Metrics Tracked
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">24</div>
                    <p className="text-sm text-muted-foreground">Across all sports</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-green-600" />
                      Personal Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">8</div>
                    <p className="text-sm text-muted-foreground">Set this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-5 w-5 text-red-600" />
                      Active Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">5</div>
                    <p className="text-sm text-muted-foreground">In progress</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => setShowEntryForm(true)}
                    >
                      <Plus className="h-6 w-6" />
                      <span className="text-sm">Add Metric</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex flex-col items-center gap-2"
                    >
                      <Target className="h-6 w-6" />
                      <span className="text-sm">Set Goal</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex flex-col items-center gap-2"
                    >
                      <BarChart3 className="h-6 w-6" />
                      <span className="text-sm">View Trends</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex flex-col items-center gap-2"
                    >
                      <Trophy className="h-6 w-6" />
                      <span className="text-sm">Compare</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tracker Tab */}
            <TabsContent value="tracker" className="space-y-6">
              <SportsPerformanceTracker />
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4" />
                    <p>Set goals to track your progress and stay motivated</p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>Your performance history will appear here</p>
                    <Button 
                      className="mt-4"
                      onClick={() => setShowEntryForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Metric
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  )
}