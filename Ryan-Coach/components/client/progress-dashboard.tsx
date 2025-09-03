'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar, 
  Scale, 
  Heart, 
  Battery, 
  Moon, 
  Zap,
  Target,
  Plus,
  AlertCircle
} from 'lucide-react'
import { format, parseISO, subDays, startOfMonth, endOfMonth } from 'date-fns'
import ProgressEntryForm from './progress-entry-form'

interface ProgressEntry {
  id: string
  created_at: string
  weight?: number
  mood_score: number
  energy_level: number
  sleep_quality?: number
  stress_level?: number
  workout_intensity?: number
  nutrition_adherence?: number
  notes?: string
  measurements?: Record<string, number>
}

interface ProgressStats {
  totalEntries: number
  avgMood: number
  avgEnergy: number
  weightTrend: 'up' | 'down' | 'stable'
  weightChange: number
  lastEntry: Date | null
}

export default function ProgressDashboard() {
  const [entries, setEntries] = useState<ProgressEntry[]>([])
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month')

  useEffect(() => {
    fetchProgressEntries()
  }, [selectedPeriod])

  const fetchProgressEntries = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (selectedPeriod === 'week') {
        params.append('start_date', subDays(new Date(), 7).toISOString())
      } else if (selectedPeriod === 'month') {
        params.append('start_date', startOfMonth(new Date()).toISOString())
        params.append('end_date', endOfMonth(new Date()).toISOString())
      }
      
      params.append('limit', selectedPeriod === 'all' ? '100' : '50')

      const response = await fetch(`/api/client/progress?${params}`)
      const data = await response.json()

      if (response.ok) {
        setEntries(data.entries)
        calculateStats(data.entries)
      } else {
        setError(data.error || 'Failed to fetch progress entries')
      }
    } catch (err) {
      setError('Network error while fetching progress data')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (entries: ProgressEntry[]) => {
    if (entries.length === 0) {
      setStats({
        totalEntries: 0,
        avgMood: 0,
        avgEnergy: 0,
        weightTrend: 'stable',
        weightChange: 0,
        lastEntry: null
      })
      return
    }

    const totalEntries = entries.length
    const avgMood = entries.reduce((sum, entry) => sum + entry.mood_score, 0) / totalEntries
    const avgEnergy = entries.reduce((sum, entry) => sum + entry.energy_level, 0) / totalEntries
    
    const weightsWithDates = entries
      .filter(entry => entry.weight)
      .map(entry => ({ weight: entry.weight!, date: parseISO(entry.created_at) }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    let weightTrend: 'up' | 'down' | 'stable' = 'stable'
    let weightChange = 0

    if (weightsWithDates.length >= 2) {
      const firstWeight = weightsWithDates[0].weight
      const lastWeight = weightsWithDates[weightsWithDates.length - 1].weight
      weightChange = lastWeight - firstWeight
      
      if (Math.abs(weightChange) >= 0.5) {
        weightTrend = weightChange > 0 ? 'up' : 'down'
      }
    }

    setStats({
      totalEntries,
      avgMood: Math.round(avgMood * 10) / 10,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      weightTrend,
      weightChange: Math.round(weightChange * 10) / 10,
      lastEntry: parseISO(entries[0].created_at)
    })
  }

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-red-600'
    if (score <= 6) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const handleNewEntry = () => {
    setShowNewEntry(false)
    fetchProgressEntries() // Refresh the data
  }

  if (showNewEntry) {
    return (
      <ProgressEntryForm
        onEntrySubmitted={handleNewEntry}
        onCancel={() => setShowNewEntry(false)}
      />
    )
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
          <h2 className="text-2xl font-bold">Progress Dashboard</h2>
          <p className="text-muted-foreground">Track your fitness journey</p>
        </div>
        <Button onClick={() => setShowNewEntry(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {stats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEntries}</div>
              <p className="text-xs text-muted-foreground">
                {stats.lastEntry ? `Last: ${format(stats.lastEntry, 'MMM d')}` : 'No entries yet'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(stats.avgMood)}`}>
                {stats.avgMood}/10
              </div>
              <p className="text-xs text-muted-foreground">
                Overall wellbeing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Energy</CardTitle>
              <Battery className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(stats.avgEnergy)}`}>
                {stats.avgEnergy}/10
              </div>
              <p className="text-xs text-muted-foreground">
                Energy levels
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weight Trend</CardTitle>
              <Scale className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {getTrendIcon(stats.weightTrend)}
                <span className="text-2xl font-bold">
                  {stats.weightChange > 0 ? '+' : ''}{stats.weightChange}kg
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Change this period
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
        <TabsList>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPeriod} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
              <CardDescription>
                Your progress entries for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No entries yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start tracking your progress by creating your first entry
                  </p>
                  <Button onClick={() => setShowNewEntry(true)}>
                    Create First Entry
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {format(parseISO(entry.created_at), 'MMMM d, yyyy')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(parseISO(entry.created_at), 'h:mm a')}
                          </div>
                        </div>
                        {entry.weight && (
                          <Badge variant="outline">
                            <Scale className="h-3 w-3 mr-1" />
                            {entry.weight}kg
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          <Heart className="h-3 w-3 mr-1" />
                          Mood: {entry.mood_score}/10
                        </Badge>
                        <Badge variant="secondary">
                          <Battery className="h-3 w-3 mr-1" />
                          Energy: {entry.energy_level}/10
                        </Badge>
                        {entry.sleep_quality && (
                          <Badge variant="secondary">
                            <Moon className="h-3 w-3 mr-1" />
                            Sleep: {entry.sleep_quality}/10
                          </Badge>
                        )}
                        {entry.workout_intensity && (
                          <Badge variant="secondary">
                            <Zap className="h-3 w-3 mr-1" />
                            Workout: {entry.workout_intensity}/10
                          </Badge>
                        )}
                      </div>

                      {entry.measurements && Object.keys(entry.measurements).length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">Measurements: </span>
                          {Object.entries(entry.measurements).map(([key, value]) => (
                            <span key={key} className="mr-3">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}

                      {entry.notes && (
                        <div className="text-sm bg-muted p-3 rounded">
                          <span className="font-medium">Notes: </span>
                          {entry.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}