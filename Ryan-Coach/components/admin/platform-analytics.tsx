'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Zap,
  Star,
  Download,
  AlertCircle,
  Building,
  CreditCard,
  Calendar,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react'
import { format, parseISO, subDays, startOfMonth, endOfMonth } from 'date-fns'

interface PlatformAnalytics {
  overview: {
    total_users: number
    total_coaches: number
    total_clients: number
    total_admins: number
    active_users_30d: number
    new_users_this_month: number
  }
  revenue: {
    total_revenue: number
    platform_fees_collected: number
    average_transaction: number
    revenue_growth: number
    top_earning_coaches: Array<{
      coach_id: string
      coach_name: string
      revenue: number
      client_count: number
    }>
  }
  engagement: {
    total_sessions: number
    completed_sessions: number
    session_completion_rate: number
    avg_sessions_per_client: number
    active_coach_percentage: number
  }
  health: {
    total_progress_entries: number
    active_tracking_clients: number
    avg_client_satisfaction: number
    platform_health_score: number
  }
}

interface RevenueChart {
  date: string
  revenue: number
  fees: number
  transactions: number
}

interface UserGrowth {
  date: string
  coaches: number
  clients: number
  total: number
}

export default function PlatformAnalytics() {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null)
  const [revenueChart, setRevenueChart] = useState<RevenueChart[]>([])
  const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [exportingReport, setExportingReport] = useState(false)

  useEffect(() => {
    fetchAnalytics()
    fetchChartData()
  }, [selectedPeriod])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/analytics?period=${selectedPeriod}`)
      const data = await response.json()

      if (response.ok) {
        setAnalytics(data.analytics)
      } else {
        setError(data.error || 'Failed to fetch platform analytics')
      }
    } catch (err) {
      setError('Network error while fetching analytics')
    } finally {
      setLoading(false)
    }
  }

  const fetchChartData = async () => {
    try {
      const [revenueResponse, growthResponse] = await Promise.all([
        fetch(`/api/admin/analytics/revenue-chart?period=${selectedPeriod}`),
        fetch(`/api/admin/analytics/user-growth?period=${selectedPeriod}`)
      ])

      if (revenueResponse.ok) {
        const revenueData = await revenueResponse.json()
        setRevenueChart(revenueData.chart)
      }

      if (growthResponse.ok) {
        const growthData = await growthResponse.json()
        setUserGrowth(growthData.growth)
      }
    } catch (err) {
      console.error('Error fetching chart data:', err)
    }
  }

  const handleExportReport = async () => {
    try {
      setExportingReport(true)
      
      const response = await fetch(`/api/admin/analytics/export?period=${selectedPeriod}`)
      const blob = await response.blob()
      
      if (response.ok) {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `platform-analytics-${selectedPeriod}-${format(new Date(), 'yyyy-MM-dd')}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        setError('Failed to export report')
      }
    } catch (err) {
      setError('Failed to export report')
    } finally {
      setExportingReport(false)
    }
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100)
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Platform Analytics</h2>
          <p className="text-muted-foreground">Comprehensive platform insights and metrics</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={handleExportReport}
            disabled={exportingReport}
          >
            <Download className="h-4 w-4 mr-2" />
            {exportingReport ? 'Exporting...' : 'Export Report'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analytics && (
        <>
          {/* Overview Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.overview.total_users}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics.overview.new_users_this_month} new this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(analytics.revenue.platform_fees_collected)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics.revenue.revenue_growth > 0 ? '+' : ''}{analytics.revenue.revenue_growth.toFixed(1)}% growth
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Session Completion</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.engagement.session_completion_rate}%</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.engagement.completed_sessions} of {analytics.engagement.total_sessions} sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getHealthScoreColor(analytics.health.platform_health_score)}`}>
                  {analytics.health.platform_health_score}/100
                </div>
                <p className="text-xs text-muted-foreground">
                  Overall platform health
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>User Distribution</CardTitle>
                    <CardDescription>
                      Platform user breakdown by role
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-blue-500" />
                        <span>Coaches</span>
                      </div>
                      <Badge>{analytics.overview.total_coaches}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span>Clients</span>
                      </div>
                      <Badge>{analytics.overview.total_clients}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-purple-500" />
                        <span>Admins</span>
                      </div>
                      <Badge>{analytics.overview.total_admins}</Badge>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between font-medium">
                        <span>Active Users (30d)</span>
                        <span className="text-green-600">{analytics.overview.active_users_30d}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Health Metrics</CardTitle>
                    <CardDescription>
                      Key indicators of platform performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Active Coach Rate</span>
                      <Badge variant={analytics.engagement.active_coach_percentage >= 70 ? "default" : "secondary"}>
                        {analytics.engagement.active_coach_percentage}%
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Avg Sessions per Client</span>
                      <Badge variant="outline">
                        {analytics.engagement.avg_sessions_per_client.toFixed(1)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Client Satisfaction</span>
                      <Badge variant={analytics.health.avg_client_satisfaction >= 4 ? "default" : "secondary"}>
                        {analytics.health.avg_client_satisfaction.toFixed(1)}/5
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Progress Tracking Rate</span>
                      <Badge>
                        {analytics.health.active_tracking_clients} clients
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>
                      Platform revenue and fee collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Revenue ({selectedPeriod})</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(analytics.revenue.total_revenue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Platform Fees Collected</span>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(analytics.revenue.platform_fees_collected)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Transaction</span>
                      <span className="font-bold">
                        {formatCurrency(analytics.revenue.average_transaction)}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center font-bold">
                        <span>Fee Collection Rate</span>
                        <span className="text-blue-600">
                          {((analytics.revenue.platform_fees_collected / analytics.revenue.total_revenue) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Earning Coaches</CardTitle>
                    <CardDescription>
                      Highest revenue generating coaches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics.revenue.top_earning_coaches.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No revenue data available yet
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {analytics.revenue.top_earning_coaches.map((coach, index) => (
                          <div key={coach.coach_id} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{coach.coach_name}</div>
                              <div className="text-sm text-muted-foreground">
                                {coach.client_count} clients
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">
                                {formatCurrency(coach.revenue)}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                #{index + 1}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity & Growth</CardTitle>
                  <CardDescription>
                    User engagement and platform growth metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.overview.total_coaches}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Coaches</div>
                      <div className="text-xs text-green-600">
                        {analytics.engagement.active_coach_percentage}% active
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {analytics.overview.total_clients}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Clients</div>
                      <div className="text-xs text-blue-600">
                        {analytics.health.active_tracking_clients} tracking progress
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {analytics.overview.active_users_30d}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Users (30d)</div>
                      <div className="text-xs text-green-600">
                        {((analytics.overview.active_users_30d / analytics.overview.total_users) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Engagement</CardTitle>
                  <CardDescription>
                    Session activity and user engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analytics.engagement.total_sessions}</div>
                      <div className="text-sm text-muted-foreground">Total Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {analytics.engagement.completed_sessions}
                      </div>
                      <div className="text-sm text-muted-foreground">Completed Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.engagement.session_completion_rate}%
                      </div>
                      <div className="text-sm text-muted-foreground">Completion Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {analytics.health.total_progress_entries}
                      </div>
                      <div className="text-sm text-muted-foreground">Progress Entries</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}