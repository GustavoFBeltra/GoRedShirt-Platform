'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Star, 
  Activity,
  BarChart3,
  Download,
  AlertCircle,
  Clock,
  Target,
  Heart,
  Battery
} from 'lucide-react'
import { format, subDays, startOfMonth, endOfMonth, parseISO } from 'date-fns'

interface CoachAnalytics {
  clients: {
    total: number
    active: number
    new_this_month: number
  }
  revenue: {
    total_this_month: number
    total_all_time: number
    average_session_value: number
    platform_fees_paid: number
  }
  sessions: {
    total_this_month: number
    completed_this_month: number
    completion_rate: number
    upcoming_count: number
  }
  client_progress: {
    avg_mood_improvement: number
    avg_energy_improvement: number
    clients_with_progress: number
    total_progress_entries: number
  }
  top_performers: Array<{
    client_id: string
    client_name: string
    progress_score: number
    sessions_completed: number
  }>
}

interface ClientProgressSummary {
  client_id: string
  client_name: string
  total_entries: number
  avg_mood: number
  avg_energy: number
  weight_change: number
  last_entry_date: string
  sessions_completed: number
}

export default function CoachAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<CoachAnalytics | null>(null)
  const [clientProgress, setClientProgress] = useState<ClientProgressSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month')
  const [exportingReport, setExportingReport] = useState(false)

  useEffect(() => {
    fetchAnalytics()
    fetchClientProgress()
  }, [selectedPeriod])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/coach/analytics?period=${selectedPeriod}`)
      const data = await response.json()

      if (response.ok) {
        setAnalytics(data.analytics)
      } else {
        setError(data.error || 'Failed to fetch analytics')
      }
    } catch (err) {
      setError('Network error while fetching analytics')
    } finally {
      setLoading(false)
    }
  }

  const fetchClientProgress = async () => {
    try {
      const response = await fetch(`/api/coach/client-progress?period=${selectedPeriod}`)
      const data = await response.json()

      if (response.ok) {
        setClientProgress(data.progress)
      } else {
        console.error('Failed to fetch client progress:', data.error)
      }
    } catch (err) {
      console.error('Network error while fetching client progress:', err)
    }
  }

  const handleExportReport = async () => {
    try {
      setExportingReport(true)
      
      const response = await fetch(`/api/coach/analytics/export?period=${selectedPeriod}`)
      const blob = await response.blob()
      
      if (response.ok) {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `coach-analytics-${selectedPeriod}-${format(new Date(), 'yyyy-MM-dd')}.csv`
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

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-red-600'
    if (score <= 6) return 'text-yellow-600'
    return 'text-green-600'
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100)
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
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Insights into your coaching business</p>
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
                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.clients.active}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics.clients.new_this_month} new this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue ({selectedPeriod})</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(analytics.revenue.total_this_month)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg: {formatCurrency(analytics.revenue.average_session_value)} per session
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Session Completion</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.sessions.completion_rate}%</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.sessions.completed_this_month} of {analytics.sessions.total_this_month} sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.sessions.upcoming_count}</div>
                <p className="text-xs text-muted-foreground">
                  Scheduled sessions
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="client-progress">Client Progress</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Progress Overview</CardTitle>
                    <CardDescription>
                      How your clients are progressing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>Average Mood Improvement</span>
                      </div>
                      <Badge variant={analytics.client_progress.avg_mood_improvement >= 0 ? "default" : "secondary"}>
                        {analytics.client_progress.avg_mood_improvement > 0 ? '+' : ''}
                        {analytics.client_progress.avg_mood_improvement.toFixed(1)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-green-500" />
                        <span>Average Energy Improvement</span>
                      </div>
                      <Badge variant={analytics.client_progress.avg_energy_improvement >= 0 ? "default" : "secondary"}>
                        {analytics.client_progress.avg_energy_improvement > 0 ? '+' : ''}
                        {analytics.client_progress.avg_energy_improvement.toFixed(1)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span>Clients Tracking Progress</span>
                      </div>
                      <Badge>
                        {analytics.client_progress.clients_with_progress} / {analytics.clients.active}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-purple-500" />
                        <span>Total Progress Entries</span>
                      </div>
                      <Badge variant="outline">
                        {analytics.client_progress.total_progress_entries}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Clients</CardTitle>
                    <CardDescription>
                      Clients with the best progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics.top_performers.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No client progress data available yet
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {analytics.top_performers.map((client, index) => (
                          <div key={client.client_id} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{client.client_name}</div>
                              <div className="text-sm text-muted-foreground">
                                {client.sessions_completed} sessions completed
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-bold">{client.progress_score.toFixed(1)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="client-progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Progress Details</CardTitle>
                  <CardDescription>
                    Detailed progress tracking for all your clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {clientProgress.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No progress data yet</h3>
                      <p className="text-muted-foreground">
                        Encourage your clients to start tracking their progress
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {clientProgress.map((client) => (
                        <div key={client.client_id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{client.client_name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {client.sessions_completed} sessions • {client.total_entries} progress entries
                              </p>
                            </div>
                            <Badge variant="outline">
                              Last entry: {format(parseISO(client.last_entry_date), 'MMM d')}
                            </Badge>
                          </div>

                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="text-center">
                              <div className={`text-lg font-bold ${getScoreColor(client.avg_mood)}`}>
                                {client.avg_mood.toFixed(1)}/10
                              </div>
                              <div className="text-sm text-muted-foreground">Avg Mood</div>
                            </div>
                            <div className="text-center">
                              <div className={`text-lg font-bold ${getScoreColor(client.avg_energy)}`}>
                                {client.avg_energy.toFixed(1)}/10
                              </div>
                              <div className="text-sm text-muted-foreground">Avg Energy</div>
                            </div>
                            <div className="text-center">
                              <div className={`text-lg font-bold ${client.weight_change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {client.weight_change > 0 ? '+' : ''}{client.weight_change.toFixed(1)}kg
                              </div>
                              <div className="text-sm text-muted-foreground">Weight Change</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>
                      Your earnings and platform fees
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Revenue ({selectedPeriod})</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(analytics.revenue.total_this_month)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Platform Fees Paid</span>
                      <span className="font-bold text-red-600">
                        -{formatCurrency(analytics.revenue.platform_fees_paid)}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center font-bold">
                        <span>Net Earnings</span>
                        <span className="text-green-600">
                          {formatCurrency(analytics.revenue.total_this_month - analytics.revenue.platform_fees_paid)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>All-Time Stats</CardTitle>
                    <CardDescription>
                      Your coaching career overview
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Clients</span>
                      <span className="font-bold">{analytics.clients.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Revenue</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(analytics.revenue.total_all_time)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avg Session Value</span>
                      <span className="font-bold">
                        {formatCurrency(analytics.revenue.average_session_value)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}